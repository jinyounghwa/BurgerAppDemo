'use client';

import { useEffect, useState } from 'react';
import { Coupon } from '@/types/index';
import { Badge } from '@/components/shared/Badge';
import { formatDate, formatDiscountType } from '@/lib/utils/format';

interface QRCodeDisplayProps {
  coupon: Coupon;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ coupon }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(coupon.code, {
          width: 200,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setQrUrl(url);
      } catch (error) {
        console.error('QR 코드 생성 실패:', error);
      }
    };

    generateQR();
  }, [coupon.code]);

  const isExpired = new Date(coupon.expiresAt) < new Date();
  const isUsed = coupon.isUsed;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* 상태 배지 */}
      <div className="flex gap-2 mb-6">
        {isUsed && <Badge status="USED">사용됨</Badge>}
        {isExpired && <Badge status="EXPIRED">만료됨</Badge>}
        {!isUsed && !isExpired && <Badge status="AVAILABLE">사용 가능</Badge>}
      </div>

      {/* 쿠폰 정보 */}
      <div className="bg-gradient-to-br from-secondary to-yellow-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-dark mb-2">{coupon.name}</h2>
        <p className="text-3xl font-bold text-primary mb-4">
          {formatDiscountType(coupon.type, coupon.discount)}
        </p>
        <p className="text-sm text-gray-600">
          유효기간: {formatDate(coupon.expiresAt)}까지
        </p>
      </div>

      {/* QR 코드 */}
      {qrUrl && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 flex flex-col items-center">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48 mb-4" />
          <p className="text-xs text-gray-500 text-center">
            키오스크에서 QR 코드를 스캔하거나<br />
            아래 코드를 입력해주세요
          </p>
        </div>
      )}

      {/* 바코드 형식 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="text-xs text-gray-500 mb-2">쿠폰 코드</p>
        <p className="text-3xl font-bold tracking-widest text-dark font-mono">
          {coupon.code}
        </p>
      </div>

      {/* 비활성 상태 메시지 */}
      {isUsed && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-700">이미 사용된 쿠폰입니다</p>
        </div>
      )}

      {isExpired && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-700">만료된 쿠폰입니다</p>
        </div>
      )}
    </div>
  );
};
