'use client';

import { useState } from 'react';
import Image from 'next/image';
import { unsplashImages } from '@/lib/utils/unsplashImages';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * 이미지 로드 실패시 폴백을 제공하는 최적화된 이미지 컴포넌트
 */
export function OptimizedImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
  sizes = '',
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const imageSrc = error ? unsplashImages.fallback : src;

  const handleError = () => {
    if (!error) {
      setError(true);
    }
  };

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    priority,
    onError: handleError,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={500}
      height={500}
    />
  );
}
