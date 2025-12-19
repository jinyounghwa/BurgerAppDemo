import { create } from 'zustand';
import { Customer, Coupon, Order } from '@/types/index';

interface CustomerStore {
  currentCustomer: Customer | null;
  coupons: Coupon[];
  orders: Order[];
  setCurrentCustomer: (customer: Customer | null) => void;
  setCoupons: (coupons: Coupon[]) => void;
  setOrders: (orders: Order[]) => void;
  updatePoints: (points: number) => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  currentCustomer: null,
  coupons: [],
  orders: [],
  setCurrentCustomer: (customer) =>
    set(() => ({ currentCustomer: customer })),
  setCoupons: (coupons) => set(() => ({ coupons })),
  setOrders: (orders) => set(() => ({ orders })),
  updatePoints: (points) =>
    set((state) =>
      state.currentCustomer
        ? {
            currentCustomer: {
              ...state.currentCustomer,
              points,
            },
          }
        : {}
    ),
}));
