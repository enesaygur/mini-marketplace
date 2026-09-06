import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  listProduct,
  updateProduct,
} from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", listProduct);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
