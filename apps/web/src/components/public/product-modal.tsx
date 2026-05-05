"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check } from "lucide-react";
import { toast } from "sonner";
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
  const [quantity, setQuantity] = useState(1);

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
    return price * quantity;
  }, [item, selectedModifiers, quantity]);

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
        setQuantity(1);
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

    // Add multiple times if quantity > 1
    for (let i = 0; i < quantity; i++) {
      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}-${i}`,
        menuItemId: item.id,
        name: item.name,
        basePrice: parseFloat(item.basePrice),
        quantity: 1,
        modifiers,
        imageUrl: item.imageUrl,
      };
      addItem(cartItem);
    }

    trackEvent("add_to_cart", {
      product_id: item.id,
      product_name: item.name,
      price: totalPrice,
      quantity,
    });
    toast.success(`${item.name} agregado al carrito`);
    onOpenChange(false);
    setSelectedModifiers({});
    setQuantity(1);
  };

  if (!item) return null;

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
        onClick={() => handleOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[var(--theme-bg)] shadow-2xl transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "translate-y-full sm:translate-y-8 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => handleOpenChange(false)}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/30"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image */}
        {item.imageUrl ? (
          <div className="relative h-56 w-full sm:h-64">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-transparent" />
          </div>
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-[var(--theme-border)]">
            <span className="text-4xl font-semibold text-[var(--theme-primary)]/20">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="px-5 pb-6 sm:px-6">
          {/* Header */}
          <div className="-mt-6 relative">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--theme-text)] text-balance">
              {item.name}
            </h2>
            {item.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-text-secondary)] text-pretty">
                {item.description}
              </p>
            )}
            <p className="mt-3 text-xl font-bold text-[var(--theme-primary)]">
              {formatPrice(parseFloat(item.basePrice))}
            </p>
          </div>

          {/* Modifiers */}
          {item.modifiers.length > 0 && (
            <div className="mt-6 space-y-6">
              {item.modifiers.map((mod) => (
                <div key={mod.id}>
                  <div className="mb-3 flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--theme-text)]">
                      {mod.name}
                    </h4>
                    {mod.isRequired && (
                      <span className="rounded-full bg-[var(--theme-primary)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-primary)]">
                        Obligatorio
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {mod.options.map((opt) => {
                      const isSelected = (selectedModifiers[mod.id] || []).includes(opt.id);
                      const isSingle = mod.selectionType === "SINGLE";

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            if (!opt.isAvailable) return;
                            if (isSingle) {
                              handleSingleChange(mod.id, opt.id);
                            } else {
                              handleMultipleChange(mod.id, opt.id, !isSelected);
                            }
                          }}
                          disabled={!opt.isAvailable}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                            !opt.isAvailable
                              ? "cursor-not-allowed opacity-40 border-[var(--theme-border)]"
                              : isSelected
                              ? "cursor-pointer border-[var(--theme-primary)] bg-[var(--theme-primary)]/5"
                              : "cursor-pointer border-[var(--theme-border)] hover:border-[var(--theme-primary)]/30"
                          }`}
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              isSelected
                                ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]"
                                : "border-[var(--theme-border)]"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="flex-1 text-sm text-[var(--theme-text)]">
                            {opt.name}
                          </span>
                          {parseFloat(opt.priceDelta) > 0 && (
                            <span className="text-xs text-[var(--theme-text-secondary)]">
                              +{formatPrice(parseFloat(opt.priceDelta))}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            {/* Quantity selector */}
            <div className="flex items-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-11 w-11 items-center justify-center text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-bg)]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-11 w-10 items-center justify-center text-sm font-semibold text-[var(--theme-text)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-bg)]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add button */}
            <button
              type="button"
              disabled={!allRequiredSelected || !isOpenNow}
              onClick={handleAddToCart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 ${
                !allRequiredSelected || !isOpenNow
                  ? "cursor-not-allowed bg-[var(--theme-text-muted)]/50"
                  : "bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] active:scale-[0.98]"
              }`}
            >
              {isOpenNow
                ? `Agregar — ${formatPrice(totalPrice)}`
                : "Cerrado — No disponible"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
