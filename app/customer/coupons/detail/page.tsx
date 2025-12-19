'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Coupon } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { QRCodeDisplay } from '@/components/customer/Coupons/QRCodeDisplay';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertTriangle } from 'lucide-react';

function CouponDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponId = searchParams.get('id');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!couponId) {
      setLoading(false);
      return;
    }

    const allCoupons = localStorageManager.getCoupons();
    const found = allCoupons.find((c) => c.id === couponId);
    setCoupon(found || null);
    setLoading(false);
  }, [couponId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
        <EmptyState
          icon={AlertTriangle}
          title="쿠폰을 찾을 수 없습니다"
          action={{ label: '쿠폰함으로 돌아가기', onClick: () => router.push('/customer/coupons') }}
        />
      </div>
    );
  }

  return <QRCodeDisplay coupon={coupon} />;
}

export default function CouponDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-600">로딩 중...</p></div>}>
      <CouponDetailContent />
    </Suspense>
  );
}
