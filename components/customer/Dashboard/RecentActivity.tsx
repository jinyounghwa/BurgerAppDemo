'use client';

import { Order } from '@/types/index';
import { Badge } from '@/components/shared/Badge';
import { formatDateTime, formatOrderStatus } from '@/lib/utils/format';
import { ShoppingBag, Calendar, Hash, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentActivityProps {
  orders: Order[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ orders }) => {
  const recentOrders = orders.slice(0, 3);

  if (recentOrders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-premium"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
          <ShoppingBag size={32} />
        </div>
        <p className="text-dark/40 font-bold">최근 주문 내역이 없습니다</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="font-black text-dark text-lg flex items-center gap-2">
          <ShoppingBag size={20} className="text-primary" />
          최근 주문
        </h3>
        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
          전체보기 <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid gap-4">
        {recentOrders.map((order, idx) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-premium border border-gray-100 hover:border-primary/10 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Hash size={18} />
                </div>
                <div>
                  <p className="font-black text-dark tracking-tight">{order.orderNumber}</p>
                  <p className="text-[10px] text-dark/40 font-bold uppercase flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>
              <Badge status={order.status}>
                {formatOrderStatus(order.status)}
              </Badge>
            </div>

            <p className="text-sm font-bold text-dark/70 mb-4 line-clamp-1">
              {order.items.map((item) => item.menuName).join(', ')}
              {order.items.length > 1 && <span className="text-primary ml-1">외 {order.items.length - 1}건</span>}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-xs font-bold text-dark/30 uppercase tracking-widest">Total Amount</span>
              <p className="font-black text-primary text-lg">
                {order.finalAmount.toLocaleString()}<span className="text-xs ml-0.5">원</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
