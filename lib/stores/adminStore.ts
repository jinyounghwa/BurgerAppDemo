import { create } from 'zustand';
import { Order, Menu, Customer, Coupon, Dashboard } from '@/types/index';

interface AdminStore {
  orders: Order[];
  menus: Menu[];
  customers: Customer[];
  coupons: Coupon[];
  dashboard: Dashboard | null;
  setOrders: (orders: Order[]) => void;
  setMenus: (menus: Menu[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setCoupons: (coupons: Coupon[]) => void;
  setDashboard: (dashboard: Dashboard) => void;
  calculateDashboard: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  orders: [],
  menus: [],
  customers: [],
  coupons: [],
  dashboard: null,
  setOrders: (orders) => set(() => ({ orders })),
  setMenus: (menus) => set(() => ({ menus })),
  setCustomers: (customers) => set(() => ({ customers })),
  setCoupons: (coupons) => set(() => ({ coupons })),
  setDashboard: (dashboard) => set(() => ({ dashboard })),
  calculateDashboard: () => {
    const state = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = state.orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const todaySales = todayOrders.reduce(
      (total, o) => total + o.finalAmount,
      0
    );

    const popularMenus = state.menus
      .map((menu) => {
        const soldCount = todayOrders.reduce((count, order) => {
          return (
            count +
            order.items.filter((item) => item.menuId === menu.id).length
          );
        }, 0);
        return { ...menu, soldCount };
      })
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);

    const hourlyOrders = Array.from({ length: 24 }, (_, i) => {
      const count = todayOrders.filter((o) => {
        const orderHour = new Date(o.createdAt).getHours();
        return orderHour === i;
      }).length;
      return { hour: i, count };
    });

    set(() => ({
      dashboard: {
        todaySales,
        todayOrders: todayOrders.length,
        averageOrderValue:
          todayOrders.length > 0
            ? Math.round(todaySales / todayOrders.length)
            : 0,
        popularMenus,
        hourlyOrders,
      },
    }));
  },
}));
