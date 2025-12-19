'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, Ticket, ClipboardList, MapPin } from 'lucide-react';

const navTabs = [
  { href: '/customer', label: '홈', icon: Home },
  { href: '/customer/coupons', label: '쿠폰', icon: Ticket },
  { href: '/customer/orders', label: '주문', icon: ClipboardList },
  { href: '/customer/stores', label: '매장', icon: MapPin },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <main className="pb-24 min-h-screen bg-gray-50 pt-16">
        {children}
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive
                    ? 'text-primary border-t-2 border-primary'
                    : 'text-gray-600 border-t-2 border-transparent'
                }`}
              >
                <Icon size={24} className="mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
