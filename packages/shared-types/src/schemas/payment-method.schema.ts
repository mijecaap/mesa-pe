import { z } from "zod";

export const createPaymentMethodSchema = z.object({
  type: z.enum(["YAPE", "PLIN", "CASH", "TRANSFER", "POS"]),
  name: z.string().min(1).max(100),
  details: z.string().max(500).optional(),
  qrImageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;
