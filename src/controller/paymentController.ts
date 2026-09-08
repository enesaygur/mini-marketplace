import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { NextFunction, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import stripe from "../utils/stripe";

const prisma = new PrismaClient();

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.buyerId !== req.userId) {
      throw new AppError(
        "You are not authorized to create a checkout session",
        403,
      );
    }

    if (order.status !== "pending") {
      throw new AppError("This order is not pending payment", 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.product.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: { orderId: order.id.toString() },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: session.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
