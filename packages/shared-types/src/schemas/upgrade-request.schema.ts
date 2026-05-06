import { z } from "zod";
import { PlanType, UpgradeRequestPaymentMethod, UpgradeRequestStatus } from "../enums.js";

export const createUpgradeRequestSchema = z.object({
  requestedPlan: z.enum(Object.values(PlanType) as [string, ...string[]]),
  paymentMethod: z.enum(
    Object.values(UpgradeRequestPaymentMethod) as [string, ...string[]],
  ),
  receiptUrl: z.string().url().optional(),
});

export const approveUpgradeRequestSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const rejectUpgradeRequestSchema = z.object({
  notes: z.string().min(1).max(500),
});

export type CreateUpgradeRequestInput = z.infer<
  typeof createUpgradeRequestSchema
>;
export type ApproveUpgradeRequestInput = z.infer<
  typeof approveUpgradeRequestSchema
>;
export type RejectUpgradeRequestInput = z.infer<
  typeof rejectUpgradeRequestSchema
>;

export const upgradeRequestResponseSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  requestedPlan: z.string(),
  paymentMethod: z.string(),
  status: z.enum(Object.values(UpgradeRequestStatus) as [string, ...string[]]),
  receiptUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UpgradeRequestResponse = z.infer<
  typeof upgradeRequestResponseSchema
>;
