import type { Metadata, Viewport } from 'next';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'BurgerAppDemo - 버거 주문 시스템',
  description: '고객앱부터 키오스크, 주방, 알림판까지 완전한 버거 주문 생태계 데모',
  keywords: ['버거', '주문', '키오스크', '배달', 'burger', 'order'],
  authors: [{ name: 'BurgerAppDemo Team' }],

  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://burgerapp-demo.netlify.app',
    siteName: 'BurgerAppDemo',
    title: 'BurgerAppDemo - 버거 주문 시스템',
    description: '고객앱부터 키오스크, 주방, 알림판까지 완전한 버거 주문 생태계 데모',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'BurgerAppDemo - Burger Ordering System',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'BurgerAppDemo - 버거 주문 시스템',
    description: '완전한 버거 주문 생태계 데모',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=630&fit=crop',
    ],
  },

  // Additional Meta Tags
  icons: {
    icon: [{ url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23d62300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.8V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v9.8M6 13.8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2M6 13.8h12M9 19V5M15 19V5"/></svg>' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#d62300" />
        <link rel="canonical" href="https://burgerapp-demo.netlify.app" />
      </head>
      <body className="bg-gray-50">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
