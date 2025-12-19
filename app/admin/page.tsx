'use client';

import { useEffect, useState, useMemo } from 'react';
import { Order, Menu } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import { formatPrice } from '@/lib/utils/format';
import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [mounted, setMounted] = useState(false);

  // localStorage 동기화
  useStorageSync('orders', () => {
    const allOrders = localStorageManager.getOrders();
    setOrders(allOrders);
  });

  useStorageSync('menus', () => {
    const allMenus = localStorageManager.getMenus();
    setMenus(allMenus);
  });

  // 초기 로드
  useEffect(() => {
    const allOrders = localStorageManager.getOrders();
    const allMenus = localStorageManager.getMenus();
    setOrders(allOrders);
    setMenus(allMenus);
    setMounted(true);
  }, []);

  // 통계 계산
  const statistics = useMemo(() => {
    const todayOrders = orders.filter(
      (o) =>
        new Date(o.createdAt).toDateString() === new Date().toDateString()
    );

    const totalSales = todayOrders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount), 0);
    const totalOrders = todayOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // 메뉴별 판매량
    const menuSales: Record<string, { name: string; count: number; revenue: number }> = {};
    todayOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!menuSales[item.menuId]) {
          menuSales[item.menuId] = { name: item.menuName, count: 0, revenue: 0 };
        }
        menuSales[item.menuId].count += item.quantity;
        menuSales[item.menuId].revenue += item.price;
      });
    });

    const popularMenus = Object.values(menuSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSales,
      totalOrders,
      avgOrderValue,
      popularMenus,
    };
  }, [orders]);

  if (!mounted) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 pt-20">
      <div className="w-full max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">관리자 대시보드</h1>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* 오늘의 매출 */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">오늘의 매출</p>
            <p className="text-3xl font-bold text-primary">
              ₩{formatPrice(statistics.totalSales)}
            </p>
          </div>

          {/* 주문 건수 */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">주문 건수</p>
            <p className="text-3xl font-bold text-blue-600">{statistics.totalOrders}건</p>
          </div>

          {/* 평균 주문액 */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">평균 주문액</p>
            <p className="text-3xl font-bold text-green-600">
              ₩{formatPrice(Math.round(statistics.avgOrderValue))}
            </p>
          </div>

          {/* 주문 현황 */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">주문 현황</p>
            <div className="space-y-1 text-sm">
              <p>대기: <span className="font-bold text-red-600">{pendingCount}</span></p>
              <p>조리중: <span className="font-bold text-yellow-600">{preparingCount}</span></p>
              <p>완료: <span className="font-bold text-green-600">{readyCount}</span></p>
            </div>
          </div>
        </div>

        {/* 인기 메뉴 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">인기 메뉴</h2>
            <div className="space-y-3">
              {statistics.popularMenus.length > 0 ? (
                statistics.popularMenus.map((menu, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {idx + 1}. {menu.name}
                      </p>
                      <p className="text-sm text-gray-600">{menu.count}개 판매</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₩{formatPrice(menu.revenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">판매 데이터가 없습니다</p>
              )}
            </div>
          </div>

          {/* 메뉴 재고 상태 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">메뉴 재고</h2>
            <div className="space-y-2">
              {menus.slice(0, 5).map((menu) => (
                <div key={menu.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{menu.name}</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      menu.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : menu.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {menu.stock}개
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 주문 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">최근 주문</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">주문번호</th>
                  <th className="text-left py-3 px-4 font-semibold">메뉴</th>
                  <th className="text-left py-3 px-4 font-semibold">상태</th>
                  <th className="text-right py-3 px-4 font-semibold">금액</th>
                  <th className="text-left py-3 px-4 font-semibold">시간</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-primary">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.items.map((item) => item.menuName).join(', ')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'PENDING'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'PREPARING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'READY'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status === 'PENDING'
                            ? '대기'
                            : order.status === 'PREPARING'
                            ? '조리중'
                            : order.status === 'READY'
                            ? '완료'
                            : '완료됨'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        ₩{formatPrice(order.finalAmount || order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {new Date(order.createdAt).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
