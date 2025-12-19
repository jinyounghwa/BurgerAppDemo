'use client';

import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { getPageBannerUrl } from '@/lib/utils/unsplashImages';
import { MapPin, Phone, Clock } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  hours: string;
}

const mockStores: Store[] = [
  {
    id: '1',
    name: '강남역점',
    address: '서울 강남구 테헤란로 123',
    phone: '02-1234-5678',
    distance: 0.5,
    hours: '10:00 - 22:00',
  },
  {
    id: '2',
    name: '홍대입구역점',
    address: '서울 마포구 홍익로 456',
    phone: '02-2345-6789',
    distance: 2.1,
    hours: '09:00 - 23:00',
  },
  {
    id: '3',
    name: '신사역점',
    address: '서울 강남구 강남대로 789',
    phone: '02-3456-7890',
    distance: 1.3,
    hours: '10:00 - 22:00',
  },
];

export default function StoresPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <MapPin size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">매장찾기</h1>
      </div>

      {/* 지도 영역 */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
        <OptimizedImage
          src={getPageBannerUrl('stores')}
          alt="매장 위치 지도"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 500px"
        />
      </div>

      {/* 매장 목록 */}
      <div className="space-y-3">
        {mockStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{store.name}</h3>
                <p className="text-sm text-primary font-medium">
                  {store.distance} km
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-1 shrink-0" />
                <span>{store.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-primary shrink-0" />
                <a href={`tel:${store.phone}`} className="text-primary hover:underline">
                  {store.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-primary shrink-0" />
                <span>{store.hours}</span>
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`tel:${store.phone}`}
                className="flex-1 py-2 bg-primary text-white rounded-lg text-center text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                전화
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg text-center text-sm font-semibold hover:bg-gray-300 transition-colors"
              >
                길찾기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
