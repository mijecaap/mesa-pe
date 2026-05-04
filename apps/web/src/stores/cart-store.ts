import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@mesa/shared-types";

interface CartState {
  businessId: string | null;
  items: CartItem[];
  setBusinessId: (id: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
  totalPrice: () => number;
}

function getItemTotalPrice(item: CartItem): number {
  const modifiersTotal = item.modifiers.reduce((sum, mod) => {
    return sum + mod.options.reduce((s, opt) => s + opt.priceDelta, 0);
  }, 0);
  return (item.basePrice + modifiersTotal) * item.quantity;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      businessId: null,
      items: [],

      setBusinessId: (id) => {
        const current = get().businessId;
        if (current && current !== id) {
          set({ businessId: id, items: [] });
        } else {
          set({ businessId: id });
        }
      },

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.menuItemId === item.menuItemId &&
              JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
          );
          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + item.quantity,
            };
            return { items: updated };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + getItemTotalPrice(item), 0),

      totalPrice: () => get().subtotal(),
    }),
    {
      name: "mesa-cart",
      partialize: (state) => ({
        businessId: state.businessId,
        items: state.items,
      }),
    }
  )
);
