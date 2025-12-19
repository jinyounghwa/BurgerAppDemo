'use client';

interface BadgeProps {
  status:
    | 'PENDING'
    | 'PREPARING'
    | 'READY'
    | 'COMPLETED'
    | 'USED'
    | 'EXPIRED'
    | 'AVAILABLE';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const statusColorMap: Record<string, string> = {
  PENDING: 'bg-red-50 text-red-600 border-red-100',
  PREPARING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  READY: 'bg-green-50 text-green-600 border-green-100',
  COMPLETED: 'bg-gray-50 text-gray-500 border-gray-100',
  USED: 'bg-gray-50 text-gray-400 border-gray-100',
  EXPIRED: 'bg-gray-50 text-gray-300 border-gray-100',
  AVAILABLE: 'bg-green-50 text-green-600 border-green-100',
};

const sizeClasses = {
  sm: 'px-2.5 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  status,
  children,
  size = 'md',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-black uppercase tracking-wider border ${sizeClasses[size]} ${statusColorMap[status]} transition-colors`}
    >
      {children}
    </span>
  );
};
