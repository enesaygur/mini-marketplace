import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createCheckoutSession } from "../controller/paymentController";

const router = Router();

router.post("/checkout/:orderId", authMiddleware, createCheckoutSession);

export default router;
