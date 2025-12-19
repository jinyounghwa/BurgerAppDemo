/**
 * Unsplash 이미지 URL 맵핑
 * 메뉴와 페이지별로 고품질 이미지 제공
 * q=80&auto=format으로 최적화된 이미지 제공
 */

// Unsplash 쿼리 파라미터 - 안정성 높음
const UNSPLASH_PARAMS = '?q=80&auto=format&fit=crop';

export const unsplashImages = {
  // 메뉴 이미지 - 더 인기있는 사진 ID 사용
  menus: {
    'menu-1': `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=500&h=500`, // 와퍼
    'menu-2': `https://images.unsplash.com/photo-1550547660-d9450f859349${UNSPLASH_PARAMS}&w=500&h=500`, // 치즈버거
    'menu-3': `https://images.unsplash.com/photo-1514306688683-266518c53d28${UNSPLASH_PARAMS}&w=500&h=500`, // 불고기버거
    'menu-4': `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=500&h=500`, // 새우버거 (와퍼로 대체)
    'menu-5': `https://images.unsplash.com/photo-1579871494635-8a0b3e151986${UNSPLASH_PARAMS}&w=500&h=500`, // 감자튀김
    'menu-6': `https://images.unsplash.com/photo-1626131969676-82d8e4d4ddc2${UNSPLASH_PARAMS}&w=500&h=500`, // 너겟
    'menu-7': `https://images.unsplash.com/photo-1554866585-c1b0bfbbf84b${UNSPLASH_PARAMS}&w=500&h=500`, // 콜라
    'menu-8': `https://images.unsplash.com/photo-1457979050069-066d2873d1ad${UNSPLASH_PARAMS}&w=500&h=500`, // 스프라이트
    'menu-9': `https://images.unsplash.com/photo-1512621776951-a57141f2eefd${UNSPLASH_PARAMS}&w=500&h=500`, // 세트
  },

  // 페이지 배너 이미지
  pages: {
    home: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=1200&h=400`,
    customer: `https://images.unsplash.com/photo-1556740738-b6a63e27c4df${UNSPLASH_PARAMS}&w=1200&h=400`,
    kiosk: `https://images.unsplash.com/photo-1550547660-d9450f859349${UNSPLASH_PARAMS}&w=1200&h=400`,
    kitchen: `https://images.unsplash.com/photo-1556910103-2b02f5c0de15${UNSPLASH_PARAMS}&w=1200&h=400`,
    display: `https://images.unsplash.com/photo-1613874975657-8210998c7d1e${UNSPLASH_PARAMS}&w=1200&h=400`,
    admin: `https://images.unsplash.com/photo-1633356122544-f134324ef6db${UNSPLASH_PARAMS}&w=1200&h=400`,
    stores: `https://images.unsplash.com/photo-1524661135-423995f22d0b${UNSPLASH_PARAMS}&w=1200&h=400`,
  },

  // 카테고리 배경 이미지
  categories: {
    BURGER: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=800&h=400`,
    SIDE: `https://images.unsplash.com/photo-1579871494635-8a0b3e151986${UNSPLASH_PARAMS}&w=800&h=400`,
    DRINK: `https://images.unsplash.com/photo-1457979050069-066d2873d1ad${UNSPLASH_PARAMS}&w=800&h=400`,
    SET: `https://images.unsplash.com/photo-1512621776951-a57141f2eefd${UNSPLASH_PARAMS}&w=800&h=400`,
  },

  // 브랜드 이미지
  brand: {
    logo: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=200&h=200`,
    banner: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=1920&h=600`,
  },

  // 기본 폴백 이미지 (이미지 로드 실패시 사용)
  fallback: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd${UNSPLASH_PARAMS}&w=400&h=400`,
};

/**
 * 메뉴 ID로 이미지 URL 가져오기
 */
export function getMenuImageUrl(menuId: string): string {
  const url = unsplashImages.menus[menuId as keyof typeof unsplashImages.menus];
  return url || unsplashImages.menus['menu-1']; // 기본값
}

/**
 * 카테고리로 배경 이미지 가져오기
 */
export function getCategoryImageUrl(category: string): string {
  const url = unsplashImages.categories[category as keyof typeof unsplashImages.categories];
  return url || unsplashImages.categories.BURGER; // 기본값
}

/**
 * 페이지별 배너 이미지 가져오기
 */
export function getPageBannerUrl(page: string): string {
  const url = unsplashImages.pages[page as keyof typeof unsplashImages.pages];
  return url || unsplashImages.pages.home; // 기본값
}
