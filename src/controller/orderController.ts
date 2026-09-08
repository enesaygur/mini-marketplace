import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { NextFunction, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { createOrderSchema } from "../schemas/orderSchema";
import { getIO } from "../socket";

const prisma = new PrismaClient();

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = createOrderSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const { items } = result.data;
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new AppError("One or more products are not available", 400);
    }

    const order = await prisma.order.create({
      data: {
        buyerId: req.userId as number,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });
    for (const product of products) {
      getIO()
        .to(`user_${product.sellerId}`)
        .emit("newOrder", {
          message: `Ürününüz için yeni bir sipariş alındı: ${product.title}`,
          productId: product.id,
          orderId: order.id,
        });
    }
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const listOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.userId as number },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
