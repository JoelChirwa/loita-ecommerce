import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
  persist(
    (set, get) => ({
      cartItems: [],

      addItem: (item) => {
        const existItem = get().cartItems.find((x) => x._id === item._id);
        if (existItem) {
          set({
            cartItems: get().cartItems.map((x) =>
              x._id === item._id ? { ...x, qty: x.qty + 1 } : x,
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, { ...item, qty: 1 }] });
        }
      },

      removeItem: (id) => {
        set({
          cartItems: get().cartItems.filter((x) => x._id !== id),
        });
      },

      updateQty: (id, qty) => {
        set({
          cartItems: get().cartItems.map((x) =>
            x._id === id ? { ...x, qty: Number(qty) } : x,
          ),
        });
      },

      clearCart: () => set({ cartItems: [] }),

      getTotal: () => {
        return get().cartItems.reduce(
          (acc, item) => acc + item.qty * item.price,
          0,
        );
      },
    }),
    {
      name: "loita-cart-storage",
    },
  ),
);
