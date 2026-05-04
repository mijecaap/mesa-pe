"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl px-0">
        <SheetHeader className="px-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Tu pedido
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#7D6F65]">
              <ShoppingBag className="mb-3 size-12 opacity-30" />
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
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
                          <p className="mt-0.5 line-clamp-1 text-[10px] text-[#7D6F65]">
                            {item.modifiers
                              .map(
                                (m) =>
                                  `${m.groupName}: ${m.options
                                    .map((o) => o.name)
                                    .join(", ")}`
                              )
                              .join(" | ")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-[#EDE6DE] text-[#2A211E] transition-colors hover:bg-[#EDE6DE]"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm font-medium text-[#2A211E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-[#EDE6DE] text-[#2A211E] transition-colors hover:bg-[#EDE6DE]"
                          >
                            <Plus className="size-3" />
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
                            <Trash2 className="size-4" />
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

        {items.length > 0 && (
          <SheetFooter className="border-t bg-white">
            <div className="w-full">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[#7D6F65]">Subtotal</span>
                <span className="font-semibold text-[#2A211E]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button
                className="w-full bg-[#C25E3A] text-white hover:bg-[#A3492D]"
                onClick={() => {
                  onOpenChange(false);
                  onCheckout();
                }}
              >
                Continuar con el pedido
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
