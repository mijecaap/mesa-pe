import { z } from "zod";
import { PlanType, SubscriptionStatus } from "../enums.js";

export const createSubscriptionSchema = z.object({
  plan: z.enum(Object.values(PlanType) as [string, ...string[]]),
  endsAt: z.coerce.date().refine((d) => d > new Date(), {
    message: "La fecha de fin debe ser futura",
  }),
  notes: z.string().max(500).optional(),
  isTrial: z.boolean().optional().default(false),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

export const subscriptionResponseSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  plan: z.string(),
  status: z.enum(Object.values(SubscriptionStatus) as [string, ...string[]]),
  isTrial: z.boolean(),
  startsAt: z.date(),
  endsAt: z.date(),
  notes: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SubscriptionResponse = z.infer<typeof subscriptionResponseSchema>;
