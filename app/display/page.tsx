'use client';

import { useEffect, useState, useRef } from 'react';
import { Order } from '@/types/index';
import { localStorageManager } from '@/lib/localStorage';
import { useStorageSync } from '@/lib/hooks/useStorageSync';

export default function CustomerDisplayPage() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [waitingOrders, setWaitingOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // localStorage 동기화
  useStorageSync('orders', () => {
    const allOrders = localStorageManager.getOrders();
    const readyOrders = allOrders.filter((o) => o.status === 'READY');

    // 새로운 완료 주문이 있으면 처리
    readyOrders.forEach((order) => {
      if (!displayedOrders.has(order.orderNumber)) {
        setCurrentOrder(order);
        setDisplayedOrders((prev) => new Set([...prev, order.orderNumber]));
        playNotificationSound();
      }
    });

    setWaitingOrders(readyOrders);
  });

  const playNotificationSound = () => {
    // 음성 안내 시뮬레이션 (실제 환경에서는 Web Audio API 또는 mp3 파일 사용)
    try {
      if ('speechSynthesis' in window && currentOrder) {
        const utterance = new SpeechSynthesisUtterance(
          `주문번호 ${currentOrder.orderNumber}번 고객님, 음식이 준비되었습니다`
        );
        utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log('Speech synthesis not available');
    }
  };

  // 초기 로드
  useEffect(() => {
    let allOrders = localStorageManager.getOrders();

    // 목업 데이터가 없으면 추가
    if (allOrders.length === 0) {
      const mockOrders: Order[] = [
        {
          id: 'mock-1',
          orderNumber: '1001',
          customerId: undefined,
          items: [
            {
              menuId: 'menu-1',
              menuName: '와퍼',
              quantity: 1,
              selectedOptions: ['치즈 추가'],
              optionDetails: ['치즈 추가'],
              price: 7000,
            },
          ],
          totalAmount: 7000,
          discountAmount: 0,
          finalAmount: 7000,
          status: 'READY',
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          id: 'mock-2',
          orderNumber: '1002',
          customerId: undefined,
          items: [
            {
              menuId: 'menu-2',
              menuName: '치즈버거',
              quantity: 2,
              selectedOptions: [],
              optionDetails: [],
              price: 11000,
            },
          ],
          totalAmount: 11000,
          discountAmount: 0,
          finalAmount: 11000,
          status: 'READY',
          createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
        },
        {
          id: 'mock-3',
          orderNumber: '1003',
          customerId: undefined,
          items: [
            {
              menuId: 'menu-3',
              menuName: '불고기버거',
              quantity: 1,
              selectedOptions: [],
              optionDetails: [],
              price: 5800,
            },
            {
              menuId: 'menu-4',
              menuName: '콜라',
              quantity: 1,
              selectedOptions: [],
              optionDetails: [],
              price: 2500,
            },
          ],
          totalAmount: 8300,
          discountAmount: 0,
          finalAmount: 8300,
          status: 'READY',
          createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
        },
        {
          id: 'mock-4',
          orderNumber: '1004',
          customerId: undefined,
          items: [
            {
              menuId: 'menu-5',
              menuName: '새우버거',
              quantity: 1,
              selectedOptions: [],
              optionDetails: [],
              price: 6200,
            },
          ],
          totalAmount: 6200,
          discountAmount: 0,
          finalAmount: 6200,
          status: 'READY',
          createdAt: new Date(Date.now() - 1 * 60000).toISOString(),
        },
      ];

      // localStorage에 목업 데이터 저장
      mockOrders.forEach((order) => {
        localStorageManager.addOrder(order);
      });

      allOrders = mockOrders;
    }

    const readyOrders = allOrders.filter((o) => o.status === 'READY');
    setWaitingOrders(readyOrders);

    // 첫 번째 READY 주문을 현재 호출로 설정
    if (readyOrders.length > 0 && !currentOrder) {
      setCurrentOrder(readyOrders[0]);
      setDisplayedOrders((prev) => new Set([...prev, readyOrders[0].orderNumber]));
    }

    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  const averageWaitTime = 3; // 고정값 (실제 구현시 계산)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      <audio ref={audioRef} />

      {/* 호출 중인 주문 */}
      {currentOrder && (
        <div className="text-center mb-12 animate-bounce">
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            주문하신 음식이 준비되었습니다!
          </p>
          <div className="bg-white rounded-3xl p-12 shadow-2xl border-8 border-primary inline-block">
            <div className="text-9xl font-black text-primary mb-4">
              #{currentOrder.orderNumber}
            </div>
            <p className="text-2xl text-gray-600">번 고객님</p>
          </div>
        </div>
      )}

      {/* 대기 중인 주문 */}
      {waitingOrders.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            대기 중인 주문
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
            {waitingOrders.map((order) => (
              <div
                key={order.id}
                className={`rounded-2xl p-4 text-center font-bold text-2xl shadow-lg transition-all ${
                  currentOrder?.id === order.id
                    ? 'bg-primary text-white scale-110'
                    : 'bg-white text-primary border-2 border-primary'
                }`}
              >
                #{order.orderNumber}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 평균 대기 시간 */}
      <div className="mt-12 text-center">
        <p className="text-xl text-gray-700 mb-2">평균 대기시간</p>
        <p className="text-6xl font-bold text-primary">약 {averageWaitTime}분</p>
      </div>

      {/* 정보 메시지 */}
      {waitingOrders.length === 0 && !currentOrder && (
        <div className="text-center text-gray-600 text-2xl">
          현재 준비 완료 된 주문이 없습니다
        </div>
      )}
    </div>
  );
}
