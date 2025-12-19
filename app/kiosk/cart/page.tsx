'use client';

import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/lib/stores/kioskStore';
import { formatPrice } from '@/lib/utils/format';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShoppingCart, CreditCard, Plus, Minus, X, AlertTriangle } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const cart = useKioskStore((state) => state.cart);
  const removeFromCart = useKioskStore((state) => state.removeFromCart);
  const updateCartItem = useKioskStore((state) => state.updateCartItem);
  const cartTotal = useKioskStore((state) => state.getCartTotal());

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={28} className="text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-800">장바구니</h1>
        </div>
        <EmptyState
          icon={AlertTriangle} // Changed from ShoppingBag to AlertTriangle
          title="장바구니가 비어있습니다"
          description="메뉴를 선택해주세요"
          action={{ label: '메뉴 보기', onClick: () => router.push('/kiosk') }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={28} className="text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-800">장바구니</h1>
        </div>

      {/* 장바구니 항목 */}
      <div className="space-y-3 mb-8">
        {cart.map((item) => (
          <div
            key={item.menuId}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.menuName}</h3>
                {item.selectedOptions.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.selectedOptions.join(', ')}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeFromCart(item.menuId)}
                className="text-gray-400 hover:text-red-600 text-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateCartItem(item.menuId, Math.max(1, item.quantity - 1))
                  }
                  className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateCartItem(item.menuId, Math.min(99, item.quantity + 1))
                  }
                  className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <span className="font-bold text-primary">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 가격 요약 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
        <div className="flex justify-between font-bold text-lg text-primary">
          <span>합계</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/kiosk/payment')}
          className="w-full h-14 bg-primary text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          <CreditCard size={20} />
          결제하기
        </button>
        <button
          onClick={() => router.push('/kiosk')}
          className="w-full h-14 bg-gray-200 text-gray-800 rounded-lg font-bold text-lg hover:bg-gray-300 transition-colors"
        >
          메뉴 더 담기
        </button>
      </div>
    </div>
  );
}
