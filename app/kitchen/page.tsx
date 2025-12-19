'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import { ChefHat, CheckCircle2, Play, AlertCircle, ArrowRight, Timer, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock 데이터 생성기 (데모용)
const generateMockOrders = (): Order[] => {
  const now = new Date();
  return [
    {
      id: 'mock-1',
      orderNumber: '1001',
      customerId: 'customer-1',
      items: [
        { menuId: 'm1', menuName: '베이컨 치즈 와퍼', quantity: 1, price: 9500, selectedOptions: ['올엑스트라'], optionDetails: ['올엑스트라'] },
        { menuId: 'm2', menuName: '콜라', quantity: 1, price: 2000, selectedOptions: ['L'], optionDetails: ['L'] }
      ],
      totalAmount: 11500,
      discountAmount: 0,
      finalAmount: 11500,
      status: 'PENDING',
      createdAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: 'mock-2',
      orderNumber: '1002',
      customerId: undefined,
      items: [
        { menuId: 'm3', menuName: '콰트로치즈와퍼 세트', quantity: 2, price: 22000, selectedOptions: ['프렌치프라이', '제로콜라'], optionDetails: ['프렌치프라이', '제로콜라'] }
      ],
      totalAmount: 22000,
      discountAmount: 2000,
      finalAmount: 20000,
      status: 'PREPARING',
      createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
      startedAt: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
    },
    {
      id: 'mock-3',
      orderNumber: '1003',
      customerId: 'customer-1',
      items: [
        { menuId: 'm4', menuName: '불고기버거', quantity: 3, price: 15000, selectedOptions: [], optionDetails: [] }
      ],
      totalAmount: 15000,
      discountAmount: 0,
      finalAmount: 15000,
      status: 'PENDING',
      createdAt: new Date(now.getTime() - 1000 * 60 * 1).toISOString(),
    },
    {
      id: 'mock-4',
      orderNumber: '1004',
      customerId: undefined,
      items: [
        { menuId: 'm5', menuName: '치즈버거', quantity: 1, price: 4500, selectedOptions: ['패티추가'], optionDetails: ['패티추가'] },
        { menuId: 'm6', menuName: '어니언링', quantity: 1, price: 2500, selectedOptions: [], optionDetails: [] }
      ],
      totalAmount: 7000,
      discountAmount: 0,
      finalAmount: 7000,
      status: 'READY',
      createdAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
      startedAt: new Date(now.getTime() - 1000 * 60 * 8).toISOString(),
      completedAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: 'mock-5',
      orderNumber: '1005',
      customerId: 'customer-1',
      items: [
        { menuId: 'm7', menuName: '기네스와퍼', quantity: 1, price: 10500, selectedOptions: ['치즈추가'], optionDetails: ['치즈추가'] }
      ],
      totalAmount: 10500,
      discountAmount: 1500,
      finalAmount: 9000,
      status: 'PENDING',
      createdAt: new Date(now.getTime() - 1000 * 30).toISOString(),
    }
  ];
};

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // localStorage 동기화
  useStorageSync('orders', () => {
    const allOrders = localStorageManager.getOrders();
    if (allOrders.length === 0) {
      setOrders(generateMockOrders());
    } else {
      setOrders(allOrders);
    }
  });

  // 초기 로드
  useEffect(() => {
    const allOrders = localStorageManager.getOrders();
    if (allOrders.length === 0) {
      const mocks = generateMockOrders();
      setOrders(mocks);
      mocks.forEach(m => localStorageManager.addOrder(m));
    } else {
      setOrders(allOrders);
    }
    setMounted(true);

    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 상태별 분류
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const updateOrderStatus = (orderNumber: string, status: 'PREPARING' | 'READY') => {
    localStorageManager.updateOrderStatus(orderNumber, status);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-bold tracking-tight">주방 시스템 로딩 중...</p>
      </div>
    );
  }

  const OrderCard = ({ order, type }: { order: Order, type: 'PENDING'|'PREPARING'|'READY' }) => {
    const config = {
      PENDING: {
        theme: 'border-red-900 bg-neutral-900',
        statusLabel: '대기 중',
        statusColor: 'text-red-400',
        statusBg: 'bg-red-950/50',
        icon: AlertCircle,
        buttonText: '조리 시작',
        buttonAction: () => updateOrderStatus(order.orderNumber, 'PREPARING'),
        buttonStyle: 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40'
      },
      PREPARING: {
        theme: 'border-amber-900 bg-neutral-900',
        statusLabel: '조리 중',
        statusColor: 'text-amber-400',
        statusBg: 'bg-amber-950/50',
        icon: Play,
        buttonText: '조리 완료',
        buttonAction: () => updateOrderStatus(order.orderNumber, 'READY'),
        buttonStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/40'
      },
      READY: {
        theme: 'border-emerald-900/50 bg-neutral-900 opacity-60',
        statusLabel: '준비 완료',
        statusColor: 'text-emerald-400',
        statusBg: 'bg-emerald-950/50',
        icon: CheckCircle2,
        buttonText: null,
        buttonAction: null,
        buttonStyle: ''
      }
    }[type];

    const Icon = config.icon;
    const timeRef = type === 'PENDING' ? order.createdAt : (type === 'PREPARING' ? order.startedAt : order.completedAt);
    const elapsed = Math.floor((currentTime - new Date(timeRef!).getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`flex flex-col border-2 rounded-3xl overflow-hidden shadow-2xl transition-all ${config.theme}`}
      >
        <div className={`px-6 py-5 border-b border-white/5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-tight ${config.statusBg} ${config.statusColor}`}>
               <Icon size={12} strokeWidth={3} />
               {config.statusLabel}
             </div>
             <h3 className="text-2xl font-black text-white tracking-tighter">#{order.orderNumber}</h3>
          </div>
          <div className="flex items-center gap-2 text-white/50 font-mono font-bold text-sm bg-black/40 px-3 py-1 rounded-xl border border-white/10">
            <Timer size={14} />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="p-6 flex-1 space-y-4 max-h-[400px] overflow-y-auto">
          {order.items.map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-lg font-bold text-white leading-tight">{item.menuName}</p>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <p className="text-white/40 text-xs mt-1.5 font-medium">
                      {item.selectedOptions.join(', ')}
                    </p>
                  )}
                </div>
                <div className="bg-white/10 text-white/60 text-xs font-black px-2 py-1 rounded-lg">
                  x{item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 pt-0">
          {config.buttonText ? (
            <button
              onClick={config.buttonAction!}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${config.buttonStyle}`}
            >
              {config.buttonText}
              <ArrowRight size={18} />
            </button>
          ) : (
            <div className={`w-full py-4 rounded-2xl font-bold text-sm text-center border border-emerald-900/50 bg-emerald-950/50 text-emerald-400 flex items-center justify-center gap-2`}>
              <CheckCircle2 size={18} />
              수령 대기 중
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-primary selection:text-white pt-24 md:pt-32">
      {/* 주방 헤더 */}
      <div className="max-w-[1700px] mx-auto mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-neutral-900 p-8 rounded-[2.5rem] shadow-2xl border border-white/5">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary rounded-2xl shadow-xl shadow-primary/20">
              <ChefHat size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                주방 관리 <span className="text-white/20">시스템</span>
              </h1>
              <p className="text-white/30 font-bold text-sm tracking-tight mt-0.5 uppercase tracking-[0.2em]">Kitchen Display System v5.1</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { label: '전체 주문', count: orders.length, color: 'text-white/40', bg: 'bg-neutral-800' },
              { label: '대기', count: pendingOrders.length, color: 'text-red-400', bg: 'bg-red-950/30' },
              { label: '조리', count: preparingOrders.length, color: 'text-amber-400', bg: 'bg-amber-950/30' },
              { label: '완료', count: readyOrders.length, color: 'text-emerald-400', bg: 'bg-emerald-950/30' }
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]`}>
                <span className="text-[10px] font-black tracking-widest text-white/20 mb-0.5 uppercase">{stat.label}</span>
                <span className={`text-2xl font-black ${stat.color}`}>{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주문 그리드 */}
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} type="PENDING" />
            ))}
            {preparingOrders.map((order) => (
              <OrderCard key={order.id} order={order} type="PREPARING" />
            ))}
            {readyOrders.map((order) => (
              <OrderCard key={order.id} order={order} type="READY" />
            ))}
          </AnimatePresence>
        </div>

        {/* 빈 상태 */}
        {orders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-40 rounded-[3rem] border-4 border-dashed border-white/5 bg-neutral-900/50"
          >
            <div className="w-24 h-24 bg-neutral-800 rounded-3xl flex items-center justify-center text-white/5 mb-6">
              <UtensilsCrossed size={48} />
            </div>
            <h2 className="text-2xl font-black text-white/20 tracking-tight uppercase">No Active Orders</h2>
            <p className="text-white/10 font-bold mt-2 uppercase tracking-widest text-sm">Waiting for incoming tickets...</p>
          </motion.div>
        )}
      </div>

      {/* 푸터 */}
      <div className="max-w-[1700px] mx-auto mt-12 flex justify-between items-center text-[10px] font-bold text-white/10 px-4">
        <div className="flex gap-6 uppercase tracking-widest">
          <span>스테이션: Main Kitchen</span>
          <span>상태: 실시간 동기화 중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="uppercase tracking-widest">System Online</span>
        </div>
      </div>
    </div>
  );
}
