import {
  Customer,
  Coupon,
  Menu,
  Order,
} from '@/types/index';
import { mockCustomers, mockCoupons, mockMenus, mockOrders } from './mockData';

export const localStorageManager = {
  // Orders
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('orders');
    return data ? JSON.parse(data) : [];
  },

  addOrder: (order: Order) => {
    if (typeof window === 'undefined') return;
    const orders = localStorageManager.getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    window.dispatchEvent(
      new Event('ordersUpdated')
    );
  },

  updateOrderStatus: (orderNumber: string, status: Order['status']) => {
    if (typeof window === 'undefined') return;
    const orders = localStorageManager.getOrders();
    const updated = orders.map((o) =>
      o.orderNumber === orderNumber
        ? {
            ...o,
            status,
            ...(status === 'PREPARING' && { startedAt: new Date().toISOString() }),
            ...(status === 'READY' && { completedAt: new Date().toISOString() }),
          }
        : o
    );
    localStorage.setItem('orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('ordersUpdated'));
  },

  getOrderByNumber: (orderNumber: string): Order | null => {
    const orders = localStorageManager.getOrders();
    return orders.find((o) => o.orderNumber === orderNumber) || null;
  },

  // Customers
  getCustomers: (): Customer[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('customers');
    return data ? JSON.parse(data) : [];
  },

  getCustomer: (customerId: string): Customer | null => {
    const customers = localStorageManager.getCustomers();
    return customers.find((c) => c.id === customerId) || null;
  },

  updateCustomerPoints: (customerId: string, pointsChange: number) => {
    if (typeof window === 'undefined') return;
    const customers = localStorageManager.getCustomers();
    const updated = customers.map((c) =>
      c.id === customerId
        ? { ...c, points: Math.max(0, c.points + pointsChange) }
        : c
    );
    localStorage.setItem('customers', JSON.stringify(updated));
    window.dispatchEvent(new Event('customersUpdated'));
  },

  // Coupons
  getCoupons: (): Coupon[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('coupons');
    return data ? JSON.parse(data) : [];
  },

  getCouponsByCustomer: (customerId: string): Coupon[] => {
    const coupons = localStorageManager.getCoupons();
    return coupons.filter(
      (c) => c.customerId === customerId && !c.isUsed && new Date(c.expiresAt) > new Date()
    );
  },

  useCoupon: (couponId: string) => {
    if (typeof window === 'undefined') return;
    const coupons = localStorageManager.getCoupons();
    const updated = coupons.map((c) =>
      c.id === couponId
        ? { ...c, isUsed: true, usedAt: new Date().toISOString() }
        : c
    );
    localStorage.setItem('coupons', JSON.stringify(updated));
    window.dispatchEvent(new Event('couponsUpdated'));
  },

  getCouponByCode: (code: string): Coupon | null => {
    const coupons = localStorageManager.getCoupons();
    return (
      coupons.find(
        (c) =>
          c.code === code &&
          !c.isUsed &&
          new Date(c.expiresAt) > new Date()
      ) || null
    );
  },

  // Menus
  getMenus: (): Menu[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('menus');
    return data ? JSON.parse(data) : [];
  },

  getMenusByCategory: (category: Menu['category']): Menu[] => {
    const menus = localStorageManager.getMenus();
    return menus.filter((m) => m.category === category && m.isAvailable);
  },

  getMenu: (menuId: string): Menu | null => {
    const menus = localStorageManager.getMenus();
    return menus.find((m) => m.id === menuId) || null;
  },

  updateMenuStock: (menuId: string, quantity: number) => {
    if (typeof window === 'undefined') return;
    const menus = localStorageManager.getMenus();
    const updated = menus.map((m) =>
      m.id === menuId
        ? { ...m, stock: Math.max(0, m.stock - quantity) }
        : m
    );
    localStorage.setItem('menus', JSON.stringify(updated));
    window.dispatchEvent(new Event('menusUpdated'));
  },

  // Initialize Data
  initializeData: () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
    if (!localStorage.getItem('customers')) {
      localStorage.setItem('customers', JSON.stringify(mockCustomers));
    }
    if (!localStorage.getItem('coupons')) {
      localStorage.setItem('coupons', JSON.stringify(mockCoupons));
    }
    if (!localStorage.getItem('menus')) {
      localStorage.setItem('menus', JSON.stringify(mockMenus));
    }
  },

  // Clear All Data
  clearAllData: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('orders');
    localStorage.removeItem('customers');
    localStorage.removeItem('coupons');
    localStorage.removeItem('menus');
    localStorageManager.initializeData();
  },
};
