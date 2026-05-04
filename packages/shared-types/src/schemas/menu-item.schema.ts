import { z } from "zod";

export const createMenuItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  basePrice: z.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isVisible: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  tags: z.array(z.enum(["new", "popular", "promo", "vegetarian", "spicy"])).default([]),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const reorderMenuItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number().int(),
    }),
  ),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type ReorderMenuItemsInput = z.infer<typeof reorderMenuItemsSchema>;
