import { z } from "zod";

export const planConfigSchema = z.object({
  plan: z.enum(["FREE", "STARTER", "PRO"]),
  productsLimit: z.number(),
  categoriesLimit: z.number(),
  modifiersLimit: z.number(),
  watermark: z.boolean(),
  advancedAnalytics: z.boolean(),
});

export const featureFlagsSchema = z.object({
  canCreateProduct: z.boolean(),
  canCreateCategory: z.boolean(),
  canCreateModifier: z.boolean(),
  showWatermark: z.boolean(),
  showAdvancedAnalytics: z.boolean(),
  productsRemaining: z.number().int(),
  categoriesRemaining: z.number().int(),
  modifiersRemaining: z.number().int(),
});

export type PlanConfig = z.infer<typeof planConfigSchema>;
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
