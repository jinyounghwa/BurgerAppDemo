'use client';

import { useEffect, useState } from 'react';
import { Customer, Order } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import { getPageBannerUrl } from '@/lib/utils/unsplashImages';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { PointsCard } from '@/components/customer/Dashboard/PointsCard';
import { QuickActions } from '@/components/customer/Dashboard/QuickActions';
import { RecentActivity } from '@/components/customer/Dashboard/RecentActivity';
import { Bell } from 'lucide-react';

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // 초기 데이터 로드
  useEffect(() => {
    const customer = localStorageManager.getCustomer('customer-1');
    setCustomer(customer);

    const allOrders = localStorageManager.getOrders();
    const customerOrders = allOrders.filter((o) => o.customerId === 'customer-1');
    setOrders(customerOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  // 실시간 동기화
  useStorageSync('orders', () => {
    const allOrders = localStorageManager.getOrders();
    const customerOrders = allOrders.filter((o) => o.customerId === 'customer-1');
    setOrders(customerOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  });

  useStorageSync('customers', () => {
    const customer = localStorageManager.getCustomer('customer-1');
    setCustomer(customer);
  });

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">고객 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-32">
      {/* 배너 이미지 */}
      <div className="relative w-full h-48 overflow-hidden">
        <OptimizedImage
          src={getPageBannerUrl('customer')}
          alt="Customer App Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">마이버거킹</h1>
            <p className="text-sm text-gray-600">{customer.name}님</p>
          </div>
          <div className="p-2 bg-white rounded-xl shadow-sm relative group cursor-pointer hover:bg-gray-50 transition-colors">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
          </div>
        </div>

        {/* 포인트 카드 */}
        <PointsCard customer={customer} />

        {/* 빠른 액션 */}
        <QuickActions />

        {/* 최근 활동 */}
        <RecentActivity orders={orders} />
      </div>
    </div>
  );
}
