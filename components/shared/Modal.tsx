'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          {title && (
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          )}

          {/* 컨텐츠 */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* 푸터 */}
          {footer && <div className="border-t p-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
