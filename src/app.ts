import express from "express";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { handleStripeWebhook } from "./controller/webhookController";

const app = express();

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

export default app;
