'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/lib/stores/kioskStore';
import { localStorageManager } from '@/lib/localStorage';
import { generateOrderNumber } from '@/lib/utils/orderNumber';
import { validateCoupon } from '@/lib/utils/validation';
import { formatPrice } from '@/lib/utils/format';
import { Input } from '@/components/shared/Input';
import { EmptyState } from '@/components/shared/EmptyState';
import { CreditCard, Banknote, Smartphone, QrCode, ShoppingBag } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const cart = useKioskStore((state) => state.cart);
  const clearCart = useKioskStore((state) => state.clearCart);
  const cartTotal = useKioskStore((state) => state.getCartTotal());

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH' | 'MOBILE'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">결제</h1>
        <EmptyState
          icon={ShoppingBag}
          title="장바구니가 비어있습니다"
          action={{ label: '메뉴 보기', onClick: () => router.push('/kiosk') }}
        />
      </div>
    );
  }

  const handleApplyCoupon = () => {
    setCouponError('');

    const coupon = localStorageManager.getCouponByCode(couponCode);
    const validation = validateCoupon(coupon);

    if (!validation.valid) {
      setCouponError(validation.error || '유효하지 않은 쿠폰입니다');
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleMockCamera = () => {
    setCouponError('카메라 권한이 필요합니다. 쿠폰 코드를 직접 입력해주세요.');
  };

  // 가격 계산
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'PERCENT'
      ? Math.floor((cartTotal * appliedCoupon.discount) / 100)
      : appliedCoupon.discount
    : 0;

  const finalAmount = Math.max(0, cartTotal - discountAmount);

  // 결제 처리
  const handlePayment = async () => {
    setIsProcessing(true);

    // 결제 시뮬레이션 (2초)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 주문 생성
    const orderNumber = generateOrderNumber();
    const order = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: undefined, // 게스트
      items: cart.map((item) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        optionDetails: item.selectedOptions,
        price: item.price,
      })),
      totalAmount: cartTotal,
      discountAmount,
      finalAmount,
      couponId: appliedCoupon?.id,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };

    // LocalStorage 저장
    localStorageManager.addOrder(order);

    // 쿠폰 사용 처리
    if (appliedCoupon) {
      localStorageManager.useCoupon(appliedCoupon.id);
    }

    // 장바구니 비우기
    clearCart();

    // 완료 페이지로 이동
    router.push(`/kiosk/complete?orderNumber=${orderNumber}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-32">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">결제</h1>

      {/* 쿠폰 입력 */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-3">쿠폰 코드</h2>

        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 rounded p-3 border border-green-200">
            <div>
              <p className="font-semibold text-dark">{appliedCoupon.name}</p>
              <p className="text-sm text-gray-600">
                {appliedCoupon.type === 'PERCENT'
                  ? `${appliedCoupon.discount}% 할인`
                  : formatPrice(appliedCoupon.discount) + ' 할인'}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="쿠폰 코드 입력"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                확인
              </button>
            </div>

            <button
              onClick={handleMockCamera}
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <QrCode size={18} />
              QR 스캔
            </button>

            {couponError && (
              <p className="text-red-600 text-sm">{couponError}</p>
            )}
          </div>
        )}
      </div>

      {/* 결제 수단 */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-3">결제 수단</h2>
        <div className="grid grid-cols-3 gap-2">
          {['CARD', 'CASH', 'MOBILE'].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method as any)}
              className={`py-3 rounded-lg font-semibold transition-all ${
                paymentMethod === method
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {method === 'CARD' && (
                <div className="flex flex-col items-center gap-1">
                  <CreditCard size={20} />
                  <span className="text-xs">카드</span>
                </div>
              )}
              {method === 'CASH' && (
                <div className="flex flex-col items-center gap-1">
                  <Banknote size={20} />
                  <span className="text-xs">현금</span>
                </div>
              )}
              {method === 'MOBILE' && (
                <div className="flex flex-col items-center gap-1">
                  <Smartphone size={20} />
                  <span className="text-xs">간편</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 가격 요약 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-semibold">{formatPrice(cartTotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-primary">
            <span>할인</span>
            <span className="font-semibold">
              -{formatPrice(discountAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold pt-2 border-t">
          <span>최종 금액</span>
          <span className="text-primary">{formatPrice(finalAmount)}</span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full h-14 bg-primary text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            결제 처리 중...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            {formatPrice(finalAmount)} 결제하기
          </>
        )}
      </button>
    </div>
  );
}
