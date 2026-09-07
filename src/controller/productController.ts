import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { PrismaClient } from "@prisma/client";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/productSchema";
import { AppError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const { title, description, price, imageUrl } = result.data;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        sellerId: req.userId as number,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const listProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        seller: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.id);
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    if (existingProduct.sellerId !== req.userId) {
      throw new AppError("You are not authorized to update this product", 403);
    }

    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: result.data,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    if (existingProduct.sellerId !== req.userId) {
      throw new AppError("You are not authorized to delete this product", 403);
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        isActive: false,
      },
    });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.id);
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    if (existingProduct.sellerId !== req.userId) {
      throw new AppError("You are not authorized to update this product", 403);
    }

    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const updateProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        imageUrl,
      },
    });
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
};
