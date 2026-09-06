import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number().positive("Lütfen pozitif bir değer giriniz."),
      }),
    )
    .min(1, "Lütfen en az bir ürün seçiniz."),
});
