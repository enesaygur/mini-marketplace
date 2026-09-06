import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Lütfen geçerli bir email adresi giriniz."),
  password: z.string().min(6, "Lütfen en az 6 karakter giriniz."),
});

export const loginSchema = z.object({
  email: z.string().email("Lütfen geçerli bir email adresi giriniz."),
  password: z.string().min(1, "Lütfen şifrenizi giriniz."),
});
