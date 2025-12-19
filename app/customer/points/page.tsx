'use client';

import { useEffect, useState } from 'react';
import { Customer } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import { formatDate } from '@/lib/utils/format';

interface PointTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'earn' | 'use';
}

// Mock 포인트 내역 데이터
const mockPointHistory: PointTransaction[] = [
  {
    id: 'pt-1',
    date: new Date().toISOString(),
    description: '주문 완료 적립 (#1234)',
    amount: 100,
    balance: 1334,
    type: 'earn',
  },
  {
    id: 'pt-2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: '쿠폰 할인 사용',
    amount: -500,
    balance: 1234,
    type: 'use',
  },
  {
    id: 'pt-3',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: '월드컵 이벤트 선물',
    amount: 1000,
    balance: 1734,
    type: 'earn',
  },
  {
    id: 'pt-4',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: '주문 완료 적립 (#1200)',
    amount: 200,
    balance: 734,
    type: 'earn',
  },
];

export default function PointsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const customer = localStorageManager.getCustomer('customer-1');
    setCustomer(customer);
  }, []);

  useStorageSync('customers', () => {
    const customer = localStorageManager.getCustomer('customer-1');
    setCustomer(customer);
  });

  if (!customer) {
    return <div>로딩 중...</div>;
  }

  // 날짜별로 그룹화
  const groupedByDate: Record<string, PointTransaction[]> = {};
  mockPointHistory.forEach((tx) => {
    const dateKey = formatDate(tx.date);
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(tx);
  });

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">⭐ 포인트</h1>

      {/* 포인트 요약 */}
      <div className="bg-gradient-to-br from-primary to-red-700 text-white rounded-lg p-6 mb-6">
        <p className="text-sm opacity-90 mb-1">보유 포인트</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{customer.points.toLocaleString()}</span>
          <span className="text-lg">P</span>
        </div>
      </div>

      {/* 포인트 내역 */}
      <div className="space-y-4">
        {Object.entries(groupedByDate).map(([date, transactions]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{date}</h3>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between bg-white rounded-lg p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      보유: {tx.balance.toLocaleString()}P
                    </p>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      tx.type === 'earn' ? 'text-primary' : 'text-gray-600'
                    }`}
                  >
                    {tx.type === 'earn' ? '+' : '-'}
                    {Math.abs(tx.amount).toLocaleString()}P
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
