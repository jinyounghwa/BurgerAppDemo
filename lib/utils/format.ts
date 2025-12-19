/**
 * 날짜 포맷팅
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * 날짜 + 시간 포맷팅
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 가격 포맷팅 (숫자 → "8,500원")
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR') + '원';
};

/**
 * 가격 표시 (숫자만)
 */
export const formatPriceNumber = (price: number): string => {
  return price.toLocaleString('ko-KR');
};

/**
 * 상대 시간 ("3분 전", "2시간 전" 등)
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDate(dateString);
};

/**
 * 상태 텍스트 한글화
 */
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: '대기 중',
    PREPARING: '조리 중',
    READY: '준비 완료',
    COMPLETED: '픽업됨',
  };

  return statusMap[status] || status;
};

/**
 * 고객 등급 한글화
 */
export const formatGrade = (grade: string): string => {
  const gradeMap: Record<string, string> = {
    BRONZE: '브론즈',
    SILVER: '실버',
    GOLD: '골드',
    VIP: 'VIP',
  };

  return gradeMap[grade] || grade;
};

/**
 * 고객 등급 이모지
 */
export const getGradeEmoji = (grade: string): string => {
  const emojiMap: Record<string, string> = {
    BRONZE: '🥉',
    SILVER: '🥈',
    GOLD: '🥇',
    VIP: '👑',
  };

  return emojiMap[grade] || '⭐';
};

/**
 * 할인 타입 텍스트
 */
export const formatDiscountType = (
  type: string,
  amount: number
): string => {
  if (type === 'PERCENT') {
    return `${amount}% 할인`;
  }
  return formatPrice(amount) + ' 할인';
};
