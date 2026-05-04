"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/stores/cart-store";
import { trackEvent } from "@/lib/analytics";
import type { PublicBusiness } from "@/hooks/use-public-business";
import type { CartItem, CartModifier } from "@mesa/shared-types";

interface ProductModalProps {
  item: PublicBusiness["categories"][0]["items"][0] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  isOpenNow?: boolean;
}

export function ProductModal({
  item,
  open,
  onOpenChange,
  currency,
  isOpenNow = true,
}: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<string, string[]>
  >({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency || "PEN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    let price = parseFloat(item.basePrice);
    item.modifiers.forEach((mod) => {
      const selected = selectedModifiers[mod.id] || [];
      selected.forEach((optId) => {
        const opt = mod.options.find((o) => o.id === optId);
        if (opt) price += parseFloat(opt.priceDelta);
      });
    });
    return price;
  }, [item, selectedModifiers]);

  const allRequiredSelected = useMemo(() => {
    if (!item) return false;
    return item.modifiers
      .filter((m) => m.isRequired)
      .every((m) => {
        const selected = selectedModifiers[m.id] || [];
        return selected.length > 0;
      });
  }, [item, selectedModifiers]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setSelectedModifiers({});
      } else if (item) {
        trackEvent("product_view", {
          product_id: item.id,
          product_name: item.name,
        });
      }
    },
    [onOpenChange, item]
  );

  const handleSingleChange = (groupId: string, optionId: string) => {
    setSelectedModifiers((prev) => ({ ...prev, [groupId]: [optionId] }));
  };

  const handleMultipleChange = (
    groupId: string,
    optionId: string,
    checked: boolean
  ) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || [];
      if (checked) {
        return { ...prev, [groupId]: [...current, optionId] };
      }
      return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
    });
  };

  const handleAddToCart = () => {
    if (!item) return;

    const modifiers: CartModifier[] = item.modifiers
      .map((mod) => {
        const selected = selectedModifiers[mod.id] || [];
        if (selected.length === 0) return null;
        return {
          groupId: mod.id,
          groupName: mod.name,
          options: selected
            .map((optId) => {
              const opt = mod.options.find((o) => o.id === optId);
              if (!opt) return null;
              return {
                optionId: opt.id,
                name: opt.name,
                priceDelta: parseFloat(opt.priceDelta),
              };
            })
            .filter(Boolean) as CartModifier["options"],
        };
      })
      .filter(Boolean) as CartModifier[];

    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      basePrice: parseFloat(item.basePrice),
      quantity: 1,
      modifiers,
      imageUrl: item.imageUrl,
    };

    addItem(cartItem);
    trackEvent("add_to_cart", {
      product_id: item.id,
      product_name: item.name,
      price: totalPrice,
    });
    toast.success(`${item.name} agregado al carrito`);
    onOpenChange(false);
    setSelectedModifiers({});
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-md">
        {item.imageUrl ? (
          <div className="relative h-48 w-full shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        ) : null}

        <div className="px-4 pb-4">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg">{item.name}</DialogTitle>
            {item.description ? (
              <DialogDescription>{item.description}</DialogDescription>
            ) : null}
            <p className="text-base font-bold text-[#C25E3A]">
              {formatPrice(totalPrice)}
            </p>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            {item.modifiers.map((mod) => (
              <div key={mod.id}>
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#2A211E]">
                    {mod.name}
                  </h4>
                  {mod.isRequired && (
                    <span className="text-[10px] font-medium text-[#C25E3A]">
                      Obligatorio
                    </span>
                  )}
                </div>

                {mod.selectionType === "SINGLE" ? (
                  <RadioGroup
                    value={selectedModifiers[mod.id]?.[0] || ""}
                    onValueChange={(val) =>
                      handleSingleChange(mod.id, val)
                    }
                    className="gap-2"
                  >
                    {mod.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                          !opt.isAvailable
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer border-[#EDE6DE] hover:border-[#C25E3A]/30"
                        }`}
                      >
                        <RadioGroupItem
                          value={opt.id}
                          disabled={!opt.isAvailable}
                        />
                        <span className="flex-1 text-sm text-[#2A211E]">
                          {opt.name}
                        </span>
                        {parseFloat(opt.priceDelta) > 0 && (
                          <span className="text-xs text-[#7D6F65]">
                            +{formatPrice(parseFloat(opt.priceDelta))}
                          </span>
                        )}
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {mod.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                          !opt.isAvailable
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer border-[#EDE6DE] hover:border-[#C25E3A]/30"
                        }`}
                      >
                        <Checkbox
                          checked={(
                            selectedModifiers[mod.id] || []
                          ).includes(opt.id)}
                          onCheckedChange={(checked) =>
                            handleMultipleChange(
                              mod.id,
                              opt.id,
                              checked as boolean
                            )
                          }
                          disabled={!opt.isAvailable}
                        />
                        <span className="flex-1 text-sm text-[#2A211E]">
                          {opt.name}
                        </span>
                        {parseFloat(opt.priceDelta) > 0 && (
                          <span className="text-xs text-[#7D6F65]">
                            +{formatPrice(parseFloat(opt.priceDelta))}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            className="mt-6 w-full bg-[#C25E3A] text-white hover:bg-[#A3492D]"
            disabled={!allRequiredSelected || !isOpenNow}
            onClick={handleAddToCart}
          >
            {isOpenNow ? `Agregar al carrito — ${formatPrice(totalPrice)}` : "Cerrado — No disponible"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
