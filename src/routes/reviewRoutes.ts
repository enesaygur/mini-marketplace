import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createReview,
  deleteReview,
  listReview,
  updateReview,
} from "../controller/reviewController";

const router = Router();

router.get("/product/:productId", listReview);
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
