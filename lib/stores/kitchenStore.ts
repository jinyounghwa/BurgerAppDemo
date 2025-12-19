import { create } from 'zustand';
import { Order } from '@/types/index';

interface KitchenStore {
  orders: Order[];
  selectedOrderNumber: string | null;
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (orderNumber: string | null) => void;
  getPendingOrders: () => Order[];
  getPreparingOrders: () => Order[];
  getReadyOrders: () => Order[];
}

export const useKitchenStore = create<KitchenStore>((set, get) => ({
  orders: [],
  selectedOrderNumber: null,
  setOrders: (orders) => set(() => ({ orders })),
  setSelectedOrder: (orderNumber) =>
    set(() => ({ selectedOrderNumber: orderNumber })),
  getPendingOrders: () => {
    const state = get();
    return state.orders.filter((o) => o.status === 'PENDING');
  },
  getPreparingOrders: () => {
    const state = get();
    return state.orders.filter((o) => o.status === 'PREPARING');
  },
  getReadyOrders: () => {
    const state = get();
    return state.orders.filter((o) => o.status === 'READY');
  },
}));
