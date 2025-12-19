'use client';

import { useEffect } from 'react';

/**
 * localStorage 변경을 감지하고 콜백을 실행하는 커스텀 훅
 * - 크로스탭 동기화: storage 이벤트 리스닝
 * - 같은 탭 폴링: 2초마다 확인
 */
export const useStorageSync = (key: string, callback: () => void) => {
  useEffect(() => {
    // 같은 탭에서의 변경 감지를 위한 폴링
    const interval = setInterval(callback, 2000);

    // 크로스탭 동기화 (다른 탭에서 localStorage 변경시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key || e.key === null) {
        callback();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, callback]);
};
