import express from "express";
import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", homeRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
