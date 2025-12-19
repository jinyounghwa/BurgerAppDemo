'use client';

import Link from 'next/link';
import { Ticket, Star, ClipboardList, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  {
    href: '/customer/coupons',
    icon: Ticket,
    label: '쿠폰함',
    description: '보유 쿠폰',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    href: '/customer/points',
    icon: Star,
    label: '포인트',
    description: '내역 보기',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    href: '/customer/orders',
    icon: ClipboardList,
    label: '주문내역',
    description: '조회하기',
    color: 'bg-orange-50 text-orange-500',
  },
  {
    href: '/customer/stores',
    icon: MapPin,
    label: '매장찾기',
    description: '가까운 점',
    color: 'bg-green-50 text-green-500',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={action.href}
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-premium hover:translate-y-[-4px] transition-all group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <Icon size={24} />
              </div>
              <p className="font-bold text-dark text-sm mb-1">
                {action.label}
              </p>
              <p className="text-xs text-dark/40 font-medium">{action.description}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
