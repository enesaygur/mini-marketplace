import { NextFunction, Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../schemas/reviewSchema";

const prisma = new PrismaClient();
export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createReviewSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const { productId, rating, comment } = result.data;
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          buyerId: req.userId as number,
        },
      },
    });
    if (!hasPurchased) {
      throw new AppError(
        "You can only review products you have purchased",
        403,
      );
    }
    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        userId: req.userId as number,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const listReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviewId = Number(req.params.id);
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      throw new AppError("Review not found", 404);
    }

    if (existingReview.userId !== req.userId) {
      throw new AppError("You are not authorized to update this review", 403);
    }

    const result = updateReviewSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const updateReview = await prisma.review.update({
      where: { id: reviewId },
      data: result.data,
    });
    res.status(200).json(updateReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviewId = Number(req.params.id);
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!existingReview) {
      throw new AppError("Review not found", 404);
    }

    if (existingReview.userId !== req.userId) {
      throw new AppError("You are not authorized to delete this review", 403);
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};
