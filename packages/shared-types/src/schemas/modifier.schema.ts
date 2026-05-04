import { z } from "zod";

export const createModifierGroupSchema = z.object({
  name: z.string().min(1).max(100),
  isRequired: z.boolean().default(false),
  selectionType: z.enum(["SINGLE", "MULTIPLE"]).default("SINGLE"),
  minSelections: z.number().int().min(0).optional(),
  maxSelections: z.number().int().min(1).optional(),
});

export const updateModifierGroupSchema = createModifierGroupSchema.partial();

export const createModifierOptionSchema = z.object({
  name: z.string().min(1).max(100),
  priceDelta: z.number().default(0),
  isAvailable: z.boolean().default(true),
});

export const updateModifierOptionSchema = createModifierOptionSchema.partial();

export type CreateModifierGroupInput = z.infer<typeof createModifierGroupSchema>;
export type UpdateModifierGroupInput = z.infer<typeof updateModifierGroupSchema>;
export type CreateModifierOptionInput = z.infer<typeof createModifierOptionSchema>;
export type UpdateModifierOptionInput = z.infer<typeof updateModifierOptionSchema>;
