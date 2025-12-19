'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ChefHat, Clock } from 'lucide-react';

function OrderCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('0000');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const number = searchParams.get('orderNumber') || '0000';
    setOrderNumber(number);
    setShowConfetti(true);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex flex-col items-center justify-center px-4 pt-32 pb-32">
      {/* 주문 번호 */}
      <div className="mb-8 text-center">
        <p className="text-gray-600 mb-2">주문 번호</p>
        <div className={`text-7xl font-bold text-primary transition-all duration-500 ${
          showConfetti ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}>
          #{orderNumber}
        </div>
      </div>

      {/* 완료 메시지 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2 text-primary">
          <CheckCircle2 size={32} />
          <p className="text-2xl font-bold">주문이 완료되었습니다!</p>
        </div>
        <p className="text-gray-600 text-lg">
          잠시만 기다려주세요
        </p>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full mb-8 border-2 border-primary shadow-lg">
        <div className="text-center space-y-3">
          <div className="flex justify-center text-primary">
            <ChefHat size={40} />
          </div>
          <p className="font-semibold text-dark">조리 중입니다</p>
          <p className="text-sm text-gray-600">
            주문 번호가 호출되면 카운터에서 받아가세요
          </p>
        </div>
      </div>

      {/* 타이머 (Optional) */}
      <div className="bg-yellow-50 rounded-lg p-4 max-w-md w-full mb-8 border border-accent text-center flex items-center justify-center gap-3">
        <Clock size={24} className="text-accent" />
        <div>
          <p className="text-sm text-gray-600">예상 준비시간</p>
          <p className="text-3xl font-bold text-accent">약 15분</p>
        </div>
      </div>

      {/* 버튼 */}
      <button
        onClick={() => router.push('/kiosk')}
        className="w-full max-w-md h-14 bg-primary text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors active:scale-95"
      >
        확인
      </button>

      {/* 고객앱 추천 */}
      <div className="mt-8 p-4 max-w-md w-full bg-blue-50 rounded-lg border border-blue-200 text-center">
        <p className="text-sm text-gray-600 mb-2">고객앱에서 주문을 확인하세요</p>
        <a
          href="/customer"
          className="text-primary font-semibold hover:underline"
        >
          고객앱 열기 →
        </a>
      </div>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <OrderCompleteContent />
    </Suspense>
  );
}
