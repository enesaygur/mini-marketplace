import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  listProduct,
  updateProduct,
  uploadImage,
} from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", listProduct);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.post("/:id/image", authMiddleware, upload.single("image"),uploadImage);

export default router;
