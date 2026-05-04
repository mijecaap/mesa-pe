"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  onCheckout: () => void;
}

export function CartSheet({ open, onOpenChange, currency, onCheckout }: CartSheetProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={`relative w-full max-w-lg rounded-t-2xl bg-[#FDF8F3] shadow-2xl transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-12 rounded-full bg-[#EDE6DE]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#2A211E]">
            <ShoppingBag className="h-5 w-5 text-[#C25E3A]" />
            Tu pedido
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7D6F65] transition-colors hover:bg-[#EDE6DE]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="overflow-y-auto px-5" style={{ maxHeight: "calc(85vh - 180px)" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-12 w-12 text-[#EDE6DE]" />
              <p className="mt-4 text-base font-medium text-[#2A211E]">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-[#7D6F65]">Agrega productos para empezar tu pedido</p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {items.map((item) => {
                const modifiersTotal = item.modifiers.reduce((sum, mod) => {
                  return (
                    sum +
                    mod.options.reduce((s, opt) => s + opt.priceDelta, 0)
                  );
                }, 0);
                const unitPrice = item.basePrice + modifiersTotal;
                const totalPrice = unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-[#EDE6DE] bg-white p-3"
                  >
                    {item.imageUrl ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#EDE6DE]">
                        <span className="text-lg font-semibold text-[#C25E3A]/30">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h4 className="truncate text-sm font-semibold text-[#2A211E]">
                          {item.name}
                        </h4>
                        {item.modifiers.length > 0 && (
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-[#7D6F65]">
                            {item.modifiers
                              .map(
                                (m) =>
                                  `${m.groupName}: ${m.options
                                    .map((o) => o.name)
                                    .join(", ")}`
                              )
                              .join(" · ")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EDE6DE] text-[#2A211E] transition-colors hover:bg-[#EDE6DE]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm font-medium text-[#2A211E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#EDE6DE] text-[#2A211E] transition-colors hover:bg-[#EDE6DE]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#C25E3A]">
                            {formatPrice(totalPrice)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#7D6F65] transition-colors hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#EDE6DE] bg-white px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[#7D6F65]">Subtotal</span>
              <span className="font-semibold text-[#2A211E]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-[#C25E3A] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#A3492D] active:scale-[0.98]"
              onClick={() => {
                onOpenChange(false);
                onCheckout();
              }}
            >
              Continuar con el pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
