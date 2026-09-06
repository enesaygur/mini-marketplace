import express from "express";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
