"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-md">
        <div className="px-4 pb-4">
          <DialogHeader className="gap-1 pt-4">
            <DialogTitle className="text-lg">Finalizar pedido</DialogTitle>
            <DialogDescription>
              Completa tus datos para enviar el pedido por WhatsApp
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Modalidad */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-[#2B2D42]">
                ¿Cómo deseas recibir tu pedido?
              </Label>
              <RadioGroup
                value={fulfillmentType}
                onValueChange={(val) =>
                  setValue("fulfillmentType", val as FulfillmentType)
                }
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { value: FulfillmentType.DINE_IN, label: "Mesa" },
                  { value: FulfillmentType.PICKUP, label: "Recojo" },
                  { value: FulfillmentType.DELIVERY, label: "Delivery" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors ${
                      fulfillmentType === opt.value
                        ? "border-[#E85D04] bg-[#E85D04]/5"
                        : "border-[#EBE5E0] hover:border-[#E85D04]/30"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} className="sr-only" />
                    <span className="text-sm font-medium text-[#2B2D42]">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Número de mesa */}
            {fulfillmentType === FulfillmentType.DINE_IN && (
              <div>
                <Label htmlFor="tableNumber" className="text-[#2B2D42]">
                  Número de mesa
                </Label>
                <Input
                  id="tableNumber"
                  placeholder="Ej: 5"
                  {...register("tableNumber")}
                  className="mt-1"
                />
                {errors.tableNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.tableNumber.message}
                  </p>
                )}
              </div>
            )}

            {/* Dirección y zona */}
            {fulfillmentType === FulfillmentType.DELIVERY && (
              <>
                <div>
                  <Label htmlFor="address" className="text-[#2B2D42]">
                    Dirección de entrega
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Calle, número, referencia..."
                    {...register("address")}
                    className="mt-1 min-h-[80px]"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {business.zones.length > 0 && (
                  <div>
                    <Label className="mb-2 block text-[#2B2D42]">
                      Zona de delivery
                    </Label>
                    <RadioGroup
                      value={deliveryZoneId || ""}
                      onValueChange={(val) => setValue("deliveryZoneId", val)}
                      className="gap-2"
                    >
                      {business.zones.map((zone) => (
                        <label
                          key={zone.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                            deliveryZoneId === zone.id
                              ? "border-[#E85D04] bg-[#E85D04]/5"
                              : "border-[#EBE5E0] hover:border-[#E85D04]/30"
                          }`}
                        >
                          <RadioGroupItem value={zone.id} />
                          <span className="flex-1 text-sm text-[#2B2D42]">
                            {zone.name}
                          </span>
                          <span className="text-xs text-[#8D817C]">
                            {formatPrice(parseFloat(zone.deliveryFee))}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </>
            )}

            {/* Datos personales */}
            <div>
              <Label htmlFor="customerName" className="text-[#2B2D42]">
                Tu nombre *
              </Label>
              <Input
                id="customerName"
                placeholder="Ej: Juan Pérez"
                {...register("customerName")}
                className="mt-1"
              />
              {errors.customerName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="customerPhone" className="text-[#2B2D42]">
                Teléfono
              </Label>
              <Input
                id="customerPhone"
                placeholder="Ej: 987654321"
                {...register("customerPhone")}
                className="mt-1"
              />
            </div>

            {/* Método de pago */}
            {business.paymentMethods.length > 0 && (
              <div>
                <Label className="mb-2 block text-[#2B2D42]">
                  Método de pago preferido
                </Label>
                <RadioGroup
                  onValueChange={(val) =>
                    setValue("preferredPaymentMethod", val)
                  }
                  className="gap-2"
                >
                  {business.paymentMethods.map((pm) => (
                    <label
                      key={pm.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EBE5E0] p-3 transition-colors hover:border-[#E85D04]/30"
                    >
                      <RadioGroupItem value={pm.name} />
                      <span className="text-sm text-[#2B2D42]">
                        {pm.name}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Nota */}
            <div>
              <Label htmlFor="note" className="text-[#2B2D42]">
                Nota adicional
              </Label>
              <Textarea
                id="note"
                placeholder="Alguna indicación especial..."
                {...register("note")}
                className="mt-1 min-h-[80px]"
              />
            </div>

            {/* Resumen */}
            <div className="rounded-xl border border-[#EBE5E0] bg-[#F5F0EB]/50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-[#2B2D42]">
                Resumen
              </h4>
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
                      <span className="text-[#2B2D42]">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-[#8D817C]">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-[#EBE5E0] pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8D817C]">Subtotal</span>
                  <span className="text-[#2B2D42]">{formatPrice(subtotal)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8D817C]">Delivery</span>
                    <span className="text-[#2B2D42]">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex justify-between text-base font-bold">
                  <span className="text-[#2B2D42]">Total</span>
                  <span className="text-[#E85D04]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-[#25D366] text-white hover:bg-[#1DA851]"
            >
              {isSubmitting ? "Enviando..." : "Enviar pedido por WhatsApp"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
