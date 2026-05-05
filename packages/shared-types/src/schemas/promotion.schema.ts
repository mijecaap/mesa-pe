import { z } from "zod";

export const createPromotionSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  ctaUrl: z.string().url().optional().nullable(),
  buttonText: z.string().max(50).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updatePromotionSchema = createPromotionSchema.partial();

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
