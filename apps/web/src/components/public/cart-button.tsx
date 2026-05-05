"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

interface CartButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CartButton({ onClick, disabled }: CartButtonProps) {
  const count = useCartStore((s) => s.itemCount());

  if (disabled || count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-5 px-4 pointer-events-none">
      <button
        onClick={onClick}
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-[var(--theme-primary)] px-6 py-3.5 text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Ver carrito"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-sm font-semibold">Ver pedido</span>
        <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
          {count}
        </span>
      </button>
    </div>
  );
}
