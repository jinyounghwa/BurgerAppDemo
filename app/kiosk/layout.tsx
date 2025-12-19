'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKioskStore } from '@/lib/stores/kioskStore';
import { ChefHat, ShoppingCart } from 'lucide-react';

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const cart = useKioskStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showCartBadge = mounted && pathname !== '/kiosk/cart' && pathname !== '/kiosk/complete';

  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="max-w-full h-16 flex items-center justify-between px-4">
          <Link href="/kiosk" className="text-xl font-bold text-primary flex items-center gap-2">
            <ChefHat size={24} />
            키오스크
          </Link>

          {showCartBadge && (
            <Link
              href="/kiosk/cart"
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-red-700 transition-colors active:scale-95"
            >
              <ShoppingCart size={20} />
              장바구니
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>

      <main className="pt-32 pb-8 min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}
