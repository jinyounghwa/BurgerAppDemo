// Customer Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
  grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';
  createdAt: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  customerId: string;
  code: string;
  name: string;
  discount: number;
  type: 'PERCENT' | 'AMOUNT';
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
}

// Menu Types
export interface OptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface MenuOption {
  id: string;
  name: string;
  type: 'REQUIRED' | 'OPTIONAL';
  choices: OptionChoice[];
}

export interface Menu {
  id: string;
  name: string;
  category: 'BURGER' | 'SIDE' | 'DRINK' | 'SET';
  price: number;
  image: string;
  stock: number;
  options: MenuOption[];
  isAvailable: boolean;
}

// Order Types
export interface OrderItem {
  menuId: string;
  menuName: string;
  quantity: number;
  selectedOptions: string[];
  optionDetails: string[];
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponId?: string;
  usedPoints?: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

// Cart Types
export interface CartItem {
  menuId: string;
  menuName: string;
  quantity: number;
  selectedOptions: string[];
  price: number;
}

// Admin Types
export interface Dashboard {
  todaySales: number;
  todayOrders: number;
  averageOrderValue: number;
  popularMenus: Menu[];
  hourlyOrders: { hour: number; count: number }[];
}
