import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.number(),
  rating: z
    .number()
    .min(1, "Lütfen 1-5 arasında bir puan giriniz")
    .max(5, "Lütfen 1-5 arasında bir puan giriniz"),
  comment: z.string().min(1, "Lütfen bir yorum giriniz"),
});

export const updateReviewSchema = createReviewSchema
  .omit({ productId: true })
  .partial();
