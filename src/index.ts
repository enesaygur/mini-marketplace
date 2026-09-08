import express from "express";
import { createServer } from "http";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { Server } from "socket.io";
import { initSocket } from "./socket";
import { handleStripeWebhook } from "./controller/webhookController";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

const PORT = 3000;

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payments", paymentRoutes);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı.", socket.id);

  socket.on("register", (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`Kullanıcı ${userId}, oda user_${userId}'ye katıldı.`);
  });

  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı.", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
