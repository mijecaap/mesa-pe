"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

interface CartButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CartButton({ onClick, disabled }: CartButtonProps) {
  const count = useCartStore((s) => s.itemCount());

  if (disabled) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#E85D04] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Ver carrito"
    >
      <ShoppingBag className="size-6" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2B2D42] text-[10px] font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
