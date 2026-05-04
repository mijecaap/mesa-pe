import { z } from "zod";

export const createDeliveryZoneSchema = z.object({
  name: z.string().min(1).max(100),
  deliveryFee: z.number().nonnegative(),
  minimumOrderAmount: z.number().nonnegative().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

export const updateDeliveryZoneSchema = createDeliveryZoneSchema.partial();

export type CreateDeliveryZoneInput = z.infer<typeof createDeliveryZoneSchema>;
export type UpdateDeliveryZoneInput = z.infer<typeof updateDeliveryZoneSchema>;
