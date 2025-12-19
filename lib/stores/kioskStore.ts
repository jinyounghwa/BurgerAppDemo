import { create } from 'zustand';
import { CartItem, Menu, Order } from '@/types/index';

interface KioskStore {
  cart: CartItem[];
  selectedCouponId: string | null;
  usedPoints: number;
  menus: Menu[];
  lastOrder: Order | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuId: string) => void;
  updateCartItem: (menuId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedCoupon: (couponId: string | null) => void;
  setUsedPoints: (points: number) => void;
  setMenus: (menus: Menu[]) => void;
  setLastOrder: (order: Order | null) => void;
  getCartTotal: () => number;
}

export const useKioskStore = create<KioskStore>((set, get) => ({
  cart: [],
  selectedCouponId: null,
  usedPoints: 0,
  menus: [],
  lastOrder: null,
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.menuId === item.menuId);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.menuId === item.menuId
              ? { ...c, quantity: c.quantity + item.quantity }
              : c
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (menuId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.menuId !== menuId),
    })),
  updateCartItem: (menuId, quantity) =>
    set((state) => ({
      cart: state.cart.map((c) =>
        c.menuId === menuId ? { ...c, quantity } : c
      ),
    })),
  clearCart: () =>
    set(() => ({
      cart: [],
      selectedCouponId: null,
      usedPoints: 0,
    })),
  setSelectedCoupon: (couponId) =>
    set(() => ({ selectedCouponId: couponId })),
  setUsedPoints: (points) => set(() => ({ usedPoints: points })),
  setMenus: (menus) => set(() => ({ menus })),
  setLastOrder: (order) => set(() => ({ lastOrder: order })),
  getCartTotal: () => {
    const state = get();
    return state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
