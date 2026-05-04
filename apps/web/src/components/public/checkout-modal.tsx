"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { X, UtensilsCrossed, Store, Truck, User, Phone, CreditCard, FileText, Check } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { generateWhatsAppMessage } from "@/lib/whatsapp-message";
import { createOrderLead } from "@/lib/order-lead-api";
import { trackEvent } from "@/lib/analytics";
import type { PublicBusiness } from "@/hooks/use-public-business";
import { FulfillmentType } from "@mesa/shared-types";

const checkoutSchema = z
  .object({
    customerName: z.string().min(1, "Ingresa tu nombre"),
    customerPhone: z.string().optional(),
    fulfillmentType: z.enum([
      FulfillmentType.DINE_IN,
      FulfillmentType.PICKUP,
      FulfillmentType.DELIVERY,
    ]),
    tableNumber: z.string().optional(),
    address: z.string().optional(),
    deliveryZoneId: z.string().optional(),
    preferredPaymentMethod: z.string().optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === FulfillmentType.DINE_IN && !data.tableNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tableNumber"],
        message: "Ingresa el número de mesa",
      });
    }
    if (
      data.fulfillmentType === FulfillmentType.DELIVERY &&
      !data.address
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Ingresa tu dirección",
      });
    }
  });

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  business: PublicBusiness;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ business, open, onOpenChange }: CheckoutModalProps) {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillmentType: FulfillmentType.DINE_IN,
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const deliveryZoneId = watch("deliveryZoneId");

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const modifiersTotal = item.modifiers.reduce((s, mod) => {
        return s + mod.options.reduce((o, opt) => o + opt.priceDelta, 0);
      }, 0);
      return sum + (item.basePrice + modifiersTotal) * item.quantity;
    }, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (fulfillmentType !== FulfillmentType.DELIVERY || !deliveryZoneId)
      return 0;
    const zone = business.zones.find((z) => z.id === deliveryZoneId);
    return zone ? parseFloat(zone.deliveryFee) : 0;
  }, [fulfillmentType, deliveryZoneId, business.zones]);

  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: business.currency || "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedZone = business.zones.find(
        (z) => z.id === data.deliveryZoneId
      );

      const message = generateWhatsAppMessage(business, items, {
        customerName: data.customerName,
        customerPhone: data.customerPhone || null,
        fulfillmentType: data.fulfillmentType,
        tableNumber: data.tableNumber || null,
        address: data.address || null,
        deliveryZoneName: selectedZone?.name || null,
        preferredPaymentMethod: data.preferredPaymentMethod || null,
        note: data.note || null,
      });

      const itemsSummary = items.map((item) => {
        const modifiersTotal = item.modifiers.reduce((sum, mod) => {
          return sum + mod.options.reduce((s, opt) => s + opt.priceDelta, 0);
        }, 0);
        const unitPrice = item.basePrice + modifiersTotal;
        return {
          name: item.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
          modifiers: item.modifiers.map((mod) => ({
            groupName: mod.groupName,
            options: mod.options.map((o) => o.name),
          })),
        };
      });

      await createOrderLead(business.slug, {
        customerName: data.customerName,
        customerPhone: data.customerPhone || null,
        fulfillmentType: data.fulfillmentType,
        tableNumber: data.tableNumber || null,
        address: data.address || null,
        deliveryZoneId: data.deliveryZoneId || null,
        itemsSummary,
        subtotal,
        deliveryFee: deliveryFee || null,
        total,
        preferredPaymentMethod: data.preferredPaymentMethod || null,
        note: data.note || null,
        whatsappMessage: message,
      });

      trackEvent("whatsapp_click", {
        business_id: business.id,
        business_name: business.name,
        total_items: items.length,
        total_amount: total,
      });

      clearCart();
      onOpenChange(false);

      const encodedMessage = encodeURIComponent(message);
      window.location.href = `https://wa.me/${business.whatsappNumber}?text=${encodedMessage}`;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al enviar el pedido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fulfillmentOptions = [
    { value: FulfillmentType.DINE_IN, label: "En el local", icon: UtensilsCrossed },
    { value: FulfillmentType.PICKUP, label: "Para recoger", icon: Store },
    { value: FulfillmentType.DELIVERY, label: "Delivery", icon: Truck },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#FDF8F3] shadow-2xl transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "translate-y-full sm:translate-y-8 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE6DE] text-[#7D6F65] transition-colors hover:bg-[#E5DDD4]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-5 pb-6 pt-6 sm:px-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2A211E]">
              Finalizar pedido
            </h2>
            <p className="mt-1 text-sm text-[#7D6F65]">
              Completa tus datos para enviar el pedido por WhatsApp
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Fulfillment type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2A211E]">
                ¿Cómo deseas recibir tu pedido?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {fulfillmentOptions.map((opt) => {
                  const isSelected = fulfillmentType === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("fulfillmentType", opt.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 ${
                        isSelected
                          ? "border-[#C25E3A] bg-[#C25E3A]/5"
                          : "border-[#EDE6DE] hover:border-[#C25E3A]/30"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? "text-[#C25E3A]" : "text-[#7D6F65]"}`} />
                      <span className="text-xs font-medium text-[#2A211E]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table number */}
            {fulfillmentType === FulfillmentType.DINE_IN && (
              <div>
                <label htmlFor="tableNumber" className="block text-sm font-semibold text-[#2A211E]">
                  Número de mesa
                </label>
                <input
                  id="tableNumber"
                  placeholder="Ej: 5"
                  {...register("tableNumber")}
                  className="mt-1.5 w-full rounded-xl border border-[#EDE6DE] bg-white px-4 py-2.5 text-sm text-[#2A211E] placeholder:text-[#7D6F65]/70 focus:border-[#C25E3A]/50 focus:outline-none focus:ring-2 focus:ring-[#C25E3A]/20"
                />
                {errors.tableNumber && (
                  <p className="mt-1 text-xs text-red-500">{errors.tableNumber.message}</p>
                )}
              </div>
            )}

            {/* Delivery */}
            {fulfillmentType === FulfillmentType.DELIVERY && (
              <>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-[#2A211E]">
                    Dirección de entrega
                  </label>
                  <textarea
                    id="address"
                    placeholder="Calle, número, referencia..."
                    {...register("address")}
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-[#EDE6DE] bg-white px-4 py-2.5 text-sm text-[#2A211E] placeholder:text-[#7D6F65]/70 focus:border-[#C25E3A]/50 focus:outline-none focus:ring-2 focus:ring-[#C25E3A]/20 resize-none"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                  )}
                </div>

                {business.zones.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2A211E]">
                      Zona de delivery
                    </label>
                    <div className="space-y-2">
                      {business.zones.map((zone) => {
                        const isSelected = deliveryZoneId === zone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => setValue("deliveryZoneId", zone.id)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-[#C25E3A] bg-[#C25E3A]/5"
                                : "border-[#EDE6DE] hover:border-[#C25E3A]/30"
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                isSelected ? "border-[#C25E3A] bg-[#C25E3A]" : "border-[#EDE6DE]"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="flex-1 text-sm text-[#2A211E]">{zone.name}</span>
                            <span className="text-xs text-[#7D6F65]">
                              {formatPrice(parseFloat(zone.deliveryFee))}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Personal info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="customerName" className="block text-sm font-semibold text-[#2A211E]">
                  Tu nombre *
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D6F65]" />
                  <input
                    id="customerName"
                    placeholder="Ej: Juan Pérez"
                    {...register("customerName")}
                    className="w-full rounded-xl border border-[#EDE6DE] bg-white py-2.5 pl-9 pr-4 text-sm text-[#2A211E] placeholder:text-[#7D6F65]/70 focus:border-[#C25E3A]/50 focus:outline-none focus:ring-2 focus:ring-[#C25E3A]/20"
                  />
                </div>
                {errors.customerName && (
                  <p className="mt-1 text-xs text-red-500">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-semibold text-[#2A211E]">
                  Teléfono
                </label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D6F65]" />
                  <input
                    id="customerPhone"
                    placeholder="Ej: 987654321"
                    {...register("customerPhone")}
                    className="w-full rounded-xl border border-[#EDE6DE] bg-white py-2.5 pl-9 pr-4 text-sm text-[#2A211E] placeholder:text-[#7D6F65]/70 focus:border-[#C25E3A]/50 focus:outline-none focus:ring-2 focus:ring-[#C25E3A]/20"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            {business.paymentMethods.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2A211E]">
                  Método de pago preferido
                </label>
                <div className="space-y-2">
                  {business.paymentMethods.map((pm) => {
                    const isSelected = watch("preferredPaymentMethod") === pm.name;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setValue("preferredPaymentMethod", pm.name)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-[#C25E3A] bg-[#C25E3A]/5"
                            : "border-[#EDE6DE] hover:border-[#C25E3A]/30"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            isSelected ? "border-[#C25E3A] bg-[#C25E3A]" : "border-[#EDE6DE]"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <CreditCard className="h-4 w-4 text-[#7D6F65]" />
                        <span className="text-sm text-[#2A211E]">{pm.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-semibold text-[#2A211E]">
                Nota adicional
              </label>
              <div className="relative mt-1.5">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-[#7D6F65]" />
                <textarea
                  id="note"
                  placeholder="Alguna indicación especial..."
                  {...register("note")}
                  rows={3}
                  className="w-full rounded-xl border border-[#EDE6DE] bg-white px-4 py-2.5 pl-9 text-sm text-[#2A211E] placeholder:text-[#7D6F65]/70 focus:border-[#C25E3A]/50 focus:outline-none focus:ring-2 focus:ring-[#C25E3A]/20 resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-[#EDE6DE] bg-white p-4">
              <h4 className="mb-3 text-sm font-semibold text-[#2A211E]">Resumen</h4>
              <div className="space-y-2">
                {items.map((item) => {
                  const modifiersTotal = item.modifiers.reduce((sum, mod) => {
                    return (
                      sum +
                      mod.options.reduce((s, opt) => s + opt.priceDelta, 0)
                    );
                  }, 0);
                  const unitPrice = item.basePrice + modifiersTotal;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#2A211E]">
                        {item.name} <span className="text-[#7D6F65]">x{item.quantity}</span>
                      </span>
                      <span className="text-[#7D6F65]">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-[#EDE6DE] pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7D6F65]">Subtotal</span>
                  <span className="text-[#2A211E]">{formatPrice(subtotal)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7D6F65]">Delivery</span>
                    <span className="text-[#2A211E]">{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-1">
                  <span className="text-[#2A211E]">Total</span>
                  <span className="text-[#C25E3A]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 ${
                isSubmitting || items.length === 0
                  ? "cursor-not-allowed bg-[#7D6F65]/50"
                  : "bg-[#25D366] hover:bg-[#1DA851] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Enviando..." : "Enviar pedido por WhatsApp"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
