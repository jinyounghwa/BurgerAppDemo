'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Coupon } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';
import { Badge } from '@/components/shared/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatDiscountType } from '@/lib/utils/format';
import { Ticket, MailQuestion } from 'lucide-react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // 초기 데이터 로드
  useEffect(() => {
    const allCoupons = localStorageManager.getCoupons();
    const customerCoupons = allCoupons.filter((c) => c.customerId === 'customer-1');
    setCoupons(customerCoupons);
  }, []);

  // 실시간 동기화
  useStorageSync('coupons', () => {
    const allCoupons = localStorageManager.getCoupons();
    const customerCoupons = allCoupons.filter((c) => c.customerId === 'customer-1');
    setCoupons(customerCoupons);
  });

  if (coupons.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Ticket size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">쿠폰함</h1>
      </div>
      <EmptyState
        icon={MailQuestion}
        title="보유한 쿠폰이 없습니다"
        description="새로운 쿠폰을 받으면 여기에 표시됩니다"
        action={{ label: '메뉴 보기', href: '/kiosk' }}
      />
      </div>
    );
  }

  // 사용 가능한 쿠폰과 사용된 쿠폰 분류
  const availableCoupons = coupons.filter(
    (c) => !c.isUsed && new Date(c.expiresAt) > new Date()
  );
  const usedCoupons = coupons.filter((c) => c.isUsed || new Date(c.expiresAt) <= new Date());

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🎟️ 쿠폰함</h1>

      {/* 사용 가능한 쿠폰 */}
      {availableCoupons.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">사용 가능</h2>
          <div className="space-y-3">
            {availableCoupons.map((coupon) => (
              <Link
                key={coupon.id}
                href={`/customer/coupons/${coupon.id}`}
                className="block bg-gradient-to-br from-secondary to-yellow-50 rounded-lg p-4 hover:shadow-md transition-shadow active:scale-95"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark mb-1">{coupon.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDiscountType(coupon.type, coupon.discount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ~ {formatDate(coupon.expiresAt)}
                    </p>
                  </div>
                  <Badge status="AVAILABLE">사용가능</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 사용된/만료된 쿠폰 */}
      {usedCoupons.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3">
            사용됨 & 만료됨
          </h2>
          <div className="space-y-3">
            {usedCoupons.map((coupon) => {
              const isUsed = coupon.isUsed;
              const isExpired = new Date(coupon.expiresAt) < new Date();
              return (
                <div
                  key={coupon.id}
                  className="bg-gray-100 rounded-lg p-4 opacity-60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-600 mb-1">
                        {coupon.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDiscountType(coupon.type, coupon.discount)}
                      </p>
                    </div>
                    {isUsed && <Badge status="USED">사용됨</Badge>}
                    {isExpired && <Badge status="EXPIRED">만료됨</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
