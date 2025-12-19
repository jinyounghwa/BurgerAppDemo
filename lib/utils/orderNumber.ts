/**
 * 순차적 주문번호 생성
 * 형식: 4자리 숫자 (1001부터 시작)
 */
export const generateOrderNumber = (): string => {
  if (typeof window === 'undefined') {
    return '1001';
  }

  try {
    const ordersData = localStorage.getItem('orders');
    const orders = ordersData ? JSON.parse(ordersData) : [];

    if (orders.length === 0) {
      return '1001';
    }

    // 마지막 주문번호 + 1
    const lastOrder = orders[orders.length - 1];
    const lastNumber = parseInt(lastOrder.orderNumber);
    const newNumber = lastNumber + 1;

    return newNumber.toString().padStart(4, '0');
  } catch (error) {
    console.error('Failed to generate order number:', error);
    return '1001';
  }
};
