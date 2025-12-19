'use client';

import { useEffect } from 'react';
import { localStorageManager } from '@/lib/localStorage';
import { Navigation } from '@/components/shared/Navigation';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 최초 로드시 데이터 초기화
    localStorageManager.initializeData();
  }, []);

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
