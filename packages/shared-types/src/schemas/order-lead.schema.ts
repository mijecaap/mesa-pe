import { z } from "zod";
import { FulfillmentType } from "../enums";

export const cartModifierSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  options: z.array(
    z.object({
      optionId: z.string(),
      name: z.string(),
      priceDelta: z.number(),
    })
  ),
});

export const cartItemSchema = z.object({
  id: z.string(),
  menuItemId: z.string(),
  name: z.string(),
  basePrice: z.number(),
  quantity: z.number().int().min(1),
  modifiers: z.array(cartModifierSchema).default([]),
  imageUrl: z.string().nullable().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartModifier = z.infer<typeof cartModifierSchema>;

export const itemsSummarySchema = z.array(
  z.object({
    name: z.string(),
    quantity: z.number().int().min(1),
    unitPrice: z.number(),
    totalPrice: z.number(),
    modifiers: z.array(
      z.object({
        groupName: z.string(),
        options: z.array(z.string()),
      })
    ).default([]),
  })
);

export type ItemsSummary = z.infer<typeof itemsSummarySchema>;

export const createOrderLeadSchema = z.object({
  customerName: z.string().min(1, "El nombre es requerido"),
  customerPhone: z.string().optional().nullable(),
  fulfillmentType: z.enum([
    FulfillmentType.DINE_IN,
    FulfillmentType.PICKUP,
    FulfillmentType.DELIVERY,
  ]),
  tableNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  deliveryZoneId: z.string().optional().nullable(),
  itemsSummary: itemsSummarySchema,
  subtotal: z.number().min(0),
  deliveryFee: z.number().min(0).optional().nullable(),
  total: z.number().min(0),
  preferredPaymentMethod: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  whatsappMessage: z.string().min(1),
});

export type CreateOrderLeadInput = z.infer<typeof createOrderLeadSchema>;
