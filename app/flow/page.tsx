'use client';

import { useEffect, useState, useMemo } from 'react';
import { Order } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import Link from 'next/link';
import { 
  Smartphone, 
  Monitor, 
  ChefHat, 
  Tv, 
  Activity, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Settings,
  ChevronRight,
  ArrowDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FlowVisualizationPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  // localStorage 동기화
  useStorageSync('orders', () => {
    const allOrders = localStorageManager.getOrders();
    setOrders(allOrders);
  });

  // 초기 로드
  useEffect(() => {
    const allOrders = localStorageManager.getOrders();
    setOrders(allOrders);
    setMounted(true);
  }, []);

  // 통계 계산
  const metrics = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'PENDING').length;
    const preparing = orders.filter((o) => o.status === 'PREPARING').length;
    const ready = orders.filter((o) => o.status === 'READY').length;
    const completed = orders.filter((o) => o.status === 'COMPLETED').length;

    return { pending, preparing, ready, completed };
  }, [orders]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const FlowNode = ({ icon: Icon, title, description, badge, href, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 min-w-[240px]"
    >
      <div className="glass group relative p-8 rounded-[32px] border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
          <Icon size={40} />
        </div>
        <h3 className="text-xl font-black mb-2">{title}</h3>
        <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2">{description}</p>
        <div className="bg-white/5 px-4 py-2 rounded-xl text-accent font-black text-xl mb-6 border border-white/5">
          {badge}
        </div>
        <Link
          href={href}
          className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 group/btn"
        >
          접속 <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-primary font-black text-xs uppercase tracking-widest mb-6"
          >
            <Zap size={14} /> LIVE SYSTEM STATUS
          </motion.div>
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            SYSTEM<span className="text-primary italic">FLOW</span> VISUALIZER
          </h1>
          <p className="text-gray-400 font-bold max-w-2xl mx-auto">
            Monitoring the real-time state of the entire BurgerApp ecosystem. 
            All endpoints are connected and synchronized via shared localStorage.
          </p>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { label: 'Pending', value: metrics.pending, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Preparing', value: metrics.preparing, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { label: 'Ready', value: metrics.ready, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Completed', value: metrics.completed, color: 'text-blue-500', bg: 'bg-blue-500/10' }
          ].map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors`}
            >
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{m.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black ${m.color}`}>{m.value}</span>
                <span className="text-sm font-bold text-gray-600">tickets</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Flow Diagram */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 pointer-events-none" />
            
            <FlowNode 
              icon={Smartphone} 
              title="고객앱" 
              description="포인트 적립, 쿠폰 관리 및 주문 내역 조회 시스템"
              badge="ONLINE"
              href="/customer"
              delay={0.2}
            />

            <div className="flex items-center justify-center p-4">
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-white/20 lg:rotate-0 rotate-90">
                <ArrowRight size={24} />
              </motion.div>
            </div>

            <FlowNode 
              icon={Monitor} 
              title="키오스크" 
              description="고객 주문 접수, 메뉴 탐색 및 자동 결제 시스템"
              badge={`${orders.length} 건`}
              href="/kiosk"
              delay={0.3}
            />

            <div className="flex items-center justify-center p-4">
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-white/20 lg:rotate-0 rotate-90">
                <ArrowRight size={24} />
              </motion.div>
            </div>

            <FlowNode 
              icon={ChefHat} 
              title="주방앱" 
              description="주문 수락, 조리 타이머 및 KDS 주문 관리 시스템"
              badge={`${metrics.pending + metrics.preparing} 건`}
              href="/kitchen"
              delay={0.4}
            />

            <div className="flex items-center justify-center p-4">
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-white/20 lg:rotate-0 rotate-90">
                <ArrowRight size={24} />
              </motion.div>
            </div>

            <FlowNode 
              icon={Tv} 
              title="알림판" 
              description="완료된 주문 번호 실시간 호출 및 고객 안내 시스템"
              badge={`${metrics.ready} 건`}
              href="/display"
              delay={0.5}
            />
          </div>

          <div className="mt-12 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-md w-full"
            >
              <div className="flex flex-col items-center gap-4">
                <ArrowDown className="text-white/10 animate-bounce" />
                <Link
                  href="/admin"
                  className="w-full glass group p-8 rounded-[32px] border border-white/10 hover:border-white/20 text-center flex flex-col items-center transition-all hover:bg-white/10"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                    <Settings size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-1">통합 관리 센터</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Administrator Dashboard</p>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* System Details Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
            <Activity size={200} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-3xl font-black mb-6">Real-time Sync Info</h2>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: 'Network Frequency', desc: 'Syncing via browser storage events in < 2ms' },
                  { icon: ShoppingBag, title: 'Total Volume', desc: `Processing history of ${orders.length} order tickets` },
                  { icon: Users, title: 'System Access', desc: 'Active instances available for multi-device test' }
                ].map((item, id) => (
                  <div key={id} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-black text-lg">{item.title}</p>
                      <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/20 rounded-3xl p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-black tracking-widest text-xs uppercase text-gray-400">System Log Terminal</span>
              </div>
              <div className="font-mono text-[11px] text-gray-500 space-y-2 leading-relaxed">
                <p><span className="text-primary">[SYNC]</span> Initializing cross-tab synchronization...</p>
                <p><span className="text-green-500">[OK]</span> LocalStorage session is active</p>
                <p><span className="text-yellow-500">[INFO]</span> {orders.length} orders loaded from persistent store</p>
                <p className="animate-pulse"><span className="text-accent">[LIVE]</span> Listening for storage events...</p>
                <div className="w-2 h-4 bg-primary inline-block animate-pulse ml-1 align-middle" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
