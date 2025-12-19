'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDateTime, formatOrderStatus, formatPrice } from '@/lib/utils/format';
import { ClipboardList, History } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
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

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <History size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">주문내역</h1>
      </div>
      <EmptyState
        icon={ClipboardList}
        title="주문 내역이 없습니다"
        description="첫 주문을 시작해보세요!"
        action={{ label: '주문하기', href: '/kiosk' }}
      />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <History size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">주문내역</h1>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="w-full bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow active:scale-95"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-800">#{order.orderNumber}</p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <Badge status={order.status}>
                {formatOrderStatus(order.status)}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {order.items.map((item) => item.menuName).join(', ')}
              {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">총 금액</span>
              <span className="font-bold text-primary">{formatPrice(order.finalAmount)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 주문 상세 모달 */}
      <Modal
        isOpen={!!selectedOrder}
        title={selectedOrder ? `주문 #${selectedOrder.orderNumber}` : undefined}
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div className="space-y-4">
            {/* 주문 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">상태</p>
                  <Badge status={selectedOrder.status}>
                    {formatOrderStatus(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">주문 시간</p>
                  <p className="text-sm font-semibold">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* 주문 항목 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">주문 항목</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-800">{item.menuName}</p>
                      {item.optionDetails.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {item.optionDetails.join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold">
                      {item.quantity}개 x {formatPrice(item.price / item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 가격 요약 */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-semibold">
                  {formatPrice(selectedOrder.totalAmount)}
                </span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>할인</span>
                  <span className="font-semibold">
                    -{formatPrice(selectedOrder.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>결제 금액</span>
                <span className="text-primary">{formatPrice(selectedOrder.finalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
