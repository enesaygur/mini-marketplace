import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Lütfen ürün adını giriniz."),
  description: z.string().min(1, "Lütfen ürün açıklamasını giriniz."),
  price: z.number().positive("Lütfen ürün fiyatını pozitif bir değer giriniz."),
  imageUrl: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
