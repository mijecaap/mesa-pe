export const PaymentMethodType = {
  YAPE: "YAPE",
  PLIN: "PLIN",
  CASH: "CASH",
  TRANSFER: "TRANSFER",
  POS: "POS",
} as const;

export type PaymentMethodType =
  (typeof PaymentMethodType)[keyof typeof PaymentMethodType];

export const FulfillmentType = {
  DINE_IN: "DINE_IN",
  PICKUP: "PICKUP",
  DELIVERY: "DELIVERY",
} as const;

export type FulfillmentType =
  (typeof FulfillmentType)[keyof typeof FulfillmentType];

export const BusinessStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  AUTO: "AUTO",
} as const;

export type BusinessStatus =
  (typeof BusinessStatus)[keyof typeof BusinessStatus];

export const OrderLeadStatus = {
  STARTED: "STARTED",
  SENT_TO_WHATSAPP: "SENT_TO_WHATSAPP",
  CANCELLED: "CANCELLED",
} as const;

export type OrderLeadStatus =
  (typeof OrderLeadStatus)[keyof typeof OrderLeadStatus];

export const PlanType = {
  FREE: "FREE",
  STARTER: "STARTER",
  PRO: "PRO",
} as const;

export type PlanType = (typeof PlanType)[keyof typeof PlanType];

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const UpgradeRequestStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type UpgradeRequestStatus =
  (typeof UpgradeRequestStatus)[keyof typeof UpgradeRequestStatus];

export const UpgradeRequestPaymentMethod = {
  YAPE: "YAPE",
  PLIN: "PLIN",
  TRANSFER: "TRANSFER",
} as const;

export type UpgradeRequestPaymentMethod =
  (typeof UpgradeRequestPaymentMethod)[keyof typeof UpgradeRequestPaymentMethod];

export const SelectionType = {
  SINGLE: "SINGLE",
  MULTIPLE: "MULTIPLE",
} as const;

export type SelectionType = (typeof SelectionType)[keyof typeof SelectionType];

export const ItemTag = {
  NEW: "new",
  POPULAR: "popular",
  PROMO: "promo",
  VEGETARIAN: "vegetarian",
  SPICY: "spicy",
} as const;

export type ItemTag = (typeof ItemTag)[keyof typeof ItemTag];
