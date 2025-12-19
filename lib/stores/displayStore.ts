import { create } from 'zustand';
import { Order } from '@/types/index';

interface DisplayStore {
  readyOrders: Order[];
  waitingOrders: Order[];
  currentCallingOrder: Order | null;
  displayedOrderNumbers: string[];
  setReadyOrders: (orders: Order[]) => void;
  setWaitingOrders: (orders: Order[]) => void;
  setCurrentCallingOrder: (order: Order | null) => void;
  addDisplayedOrder: (orderNumber: string) => void;
  getAverageWaitTime: () => number;
}

export const useDisplayStore = create<DisplayStore>((set, get) => ({
  readyOrders: [],
  waitingOrders: [],
  currentCallingOrder: null,
  displayedOrderNumbers: [],
  setReadyOrders: (orders) => set(() => ({ readyOrders: orders })),
  setWaitingOrders: (orders) => set(() => ({ waitingOrders: orders })),
  setCurrentCallingOrder: (order) =>
    set(() => ({ currentCallingOrder: order })),
  addDisplayedOrder: (orderNumber) =>
    set((state) => ({
      displayedOrderNumbers: [...state.displayedOrderNumbers, orderNumber],
    })),
  getAverageWaitTime: () => {
    const state = get();
    if (state.waitingOrders.length === 0) return 0;
    const totalWaitTime = state.waitingOrders.reduce((total, order) => {
      const createdTime = new Date(order.createdAt).getTime();
      const now = new Date().getTime();
      return total + (now - createdTime) / 1000 / 60; // 분 단위
    }, 0);
    return Math.round(totalWaitTime / state.waitingOrders.length);
  },
}));
