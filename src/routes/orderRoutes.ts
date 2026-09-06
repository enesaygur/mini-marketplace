import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createOrder, listOrder } from "../controller/orderController";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, listOrder);

export default router;
