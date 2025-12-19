import { Coupon, Menu } from '@/types/index';

/**
 * 쿠폰 유효성 검증
 */
export const validateCoupon = (
  coupon: Coupon | undefined | null,
  customerId?: string
): { valid: boolean; error?: string } => {
  if (!coupon) {
    return { valid: false, error: '존재하지 않는 쿠폰입니다' };
  }

  // customerId가 있으면 체크
  if (customerId && coupon.customerId !== customerId) {
    return { valid: false, error: '다른 고객의 쿠폰입니다' };
  }

  if (coupon.isUsed) {
    return { valid: false, error: '이미 사용된 쿠폰입니다' };
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: '만료된 쿠폰입니다' };
  }

  return { valid: true };
};

/**
 * 포인트 사용 유효성 검증
 */
export const validatePoints = (
  amount: number,
  available: number,
  maxUsable: number
): { valid: boolean; error?: string } => {
  if (amount < 0) {
    return { valid: false, error: '유효하지 않은 포인트입니다' };
  }

  if (amount > available) {
    return { valid: false, error: '보유 포인트를 초과했습니다' };
  }

  if (amount > maxUsable) {
    return { valid: false, error: `최대 ${maxUsable}P까지 사용 가능합니다` };
  }

  return { valid: true };
};

/**
 * 메뉴 옵션 유효성 검증
 */
export const validateMenuOptions = (
  menu: Menu,
  selectedOptions: string[]
): { valid: boolean; error?: string } => {
  const requiredOptions = menu.options.filter((opt) => opt.type === 'REQUIRED');

  for (const option of requiredOptions) {
    const hasSelection = selectedOptions.some((selId) =>
      option.choices.some((choice) => choice.id === selId)
    );

    if (!hasSelection) {
      return {
        valid: false,
        error: `"${option.name}"을(를) 선택해주세요`,
      };
    }
  }

  return { valid: true };
};
