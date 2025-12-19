# BurgerAppDemo 🍔

> 고객앱부터 키오스크, 주방, 알림판, 관리자까지 완전한 버거 주문 생태계 데모 시스템

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 프로젝트 개요

BurgerAppDemo는 실제 버거킹 앱과 유사한 전체 주문 생태계를 모바일웹으로 구현한 데모 시스템입니다.
고객 앱부터 키오스크, 주방, 알림판, 관리자까지 전체 플로우를 체험할 수 있습니다.

## ✨ 주요 기능

### 1. 고객용 모바일앱 (`/customer`)
- 📱 쿠폰함 (QR 코드 생성)
- 💎 포인트 적립/사용 내역
- 📦 주문 내역 조회
- 🏪 매장 찾기 및 위치 기반 정보

### 2. 키오스크 (`/kiosk`)
- 🍔 메뉴 카테고리별 탐색
- ⚙️ 메뉴 커스터마이징 (옵션 선택)
- 🛒 장바구니 관리
- 🎟️ 쿠폰 스캔/입력
- 💳 결제 시뮬레이션 (카드/현금/간편결제)

### 3. 주방 디스플레이 (`/kitchen`)
- 📋 실시간 주문 수신
- 👨‍🍳 조리 상태 관리 (대기 → 조리중 → 완료)
- ⏱️ 주문 우선순위 표시
- 🔔 완료 알림

### 4. 고객 알림판 (`/display`)
- 📺 대형 화면용 주문 호출 시스템
- 🔊 음성/효과음 알림
- ⏳ 평균 대기시간 표시
- ✨ 주문 완료 애니메이션

### 5. 관리자 대시보드 (`/admin`)
- 📊 실시간 통계 및 매출 분석
- 🎟️ 쿠폰 생성/관리
- 🍔 메뉴 관리 (가격, 재고)
- 📝 주문 현황 모니터링
- 👥 고객 관리

### 6. 전체 플로우 뷰 (`/flow`)
- 🔄 전체 시스템 상태 시각화
- 📊 실시간 데이터 흐름 애니메이션
- ⚙️ 시스템 성능 지표
- 🎯 각 페이지로 빠른 이동

## 🛠️ 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Storage**: LocalStorage (브라우저 저장소)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/) API
- **Build**: Static Site Generation (SSG)
- **Deploy**: [Netlify](https://www.netlify.com/)

## 📋 시스템 구조

```
BurgerAppDemo/
├── 0. 시스템 소개 (/)
├── 1. 고객앱 (/customer)
│   ├── 쿠폰함 (/customer/coupons)
│   ├── 포인트 내역 (/customer/points)
│   ├── 주문 내역 (/customer/orders)
│   └── 매장 찾기 (/customer/stores)
├── 2. 키오스크 (/kiosk)
│   ├── 메뉴 선택 (/kiosk)
│   ├── 옵션 선택 (/kiosk/menu/[id])
│   ├── 장바구니 (/kiosk/cart)
│   ├── 결제 (/kiosk/payment)
│   └── 주문 완료 (/kiosk/complete)
├── 3. 주방 디스플레이 (/kitchen)
├── 4. 고객 알림판 (/display)
├── 5. 관리자 대시보드 (/admin)
└── 6. 전체 플로우 뷰 (/flow)
```

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/jinyounghwa/BurgerAppDemo.git   
cd BurgerAppDemo

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# http://localhost:3000 에서 확인
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm start
```

## 📊 데이터 관리

### LocalStorage 구조

```typescript
{
  "orders": [],          // 전체 주문 목록
  "customers": [],       // 고객 정보
  "coupons": [],         // 쿠폰 목록
  "menus": [],           // 메뉴 목록
  "pointHistory": []     // 포인트 내역
}
```

### 실시간 동기화

- **폴링**: 2초 주기로 localStorage 변경 감지
- **Storage 이벤트**: 다른 탭에서의 변경 감지
- **Zustand Store**: 전역 상태 관리

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#d62300` (버거킹 빨강)
- **Secondary**: `#f5ebdc` (베이지)
- **Accent**: `#fdbd10` (노랑)
- **Dark**: `#502314` (갈색)

### 반응형 디자인
- **모바일 우선**: min-width 375px
- **태블릿**: 768px 이상
- **데스크톱**: 1024px 이상

## 📱 주요 페이지 시나리오

### 시나리오 1: 쿠폰을 사용한 주문

1. **고객앱**에서 쿠폰 확인 및 QR 코드 생성
2. **키오스크**에서 메뉴 선택 및 커스터마이징
3. **결제 페이지**에서 쿠폰 코드 입력 → 할인 적용
4. 결제 수단 선택 → 주문 완료
5. **주방**에서 새 주문 수신 → 조리 시작
6. 조리 완료 → **알림판**에 주문 번호 표시
7. **관리자**에서 실시간 통계 확인

### 시나리오 2: 관리자 모니터링

1. 대시보드에서 실시간 매출 및 주문 현황 확인
2. 새로운 쿠폰 생성
3. 메뉴 재고 업데이트
4. 진행 중인 주문 상태 모니터링

## 🔄 데이터 흐름

```
고객앱 (쿠폰 확인)
  ↓ (쿠폰 코드)
키오스크 (메뉴 선택)
  ↓ (주문 생성)
LocalStorage 저장 + Zustand 업데이트
  ↓ (폴링)
주방 (주문 수신) → 주방 (조리 시작)
  ↓ (상태 변경)
주방 (완료 처리)
  ↓ (폴링)
알림판 (주문 호출)
  ↓ (폴링)
고객앱 (주문 상태 업데이트)
```

## 🛠️ 개발 가이드

### 파일 구조

```
src/
├── app/              # Next.js App Router
├── components/       # React 컴포넌트
├── lib/
│   ├── stores/      # Zustand 스토어
│   ├── hooks/       # 커스텀 훅
│   └── utils/       # 유틸리티 함수
├── types/           # TypeScript 타입
└── public/          # 정적 파일
```

### 주요 커스텀 훅

- `useStorageSync`: localStorage 실시간 동기화
- `useOrderStore`: 주문 상태 관리
- `useCustomerStore`: 고객 정보 관리

### 환경 변수

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📈 성능 최적화

- **Static Export**: 빠른 로딩 및 낮은 서버 비용
- **Image Optimization**: Unsplash 이미지 최적화
- **Code Splitting**: 동적 import로 번들 크기 최소화
- **Caching**: LocalStorage 캐싱 및 CDN 활용

## 🚀 배포

### Netlify 배포

1. GitHub에 리포지토리 푸시
2. Netlify 대시보드에서 "New site from Git" 선택
3. 빌드 설정:
   ```
   Build command: npm run build
   Publish directory: out
   ```
4. 배포 완료!

```bash
# 또는 Netlify CLI로 직접 배포
npm run build
netlify deploy --prod
```


## 💡 주의사항

현재는 데모 버전으로 다음 사항들이 적용됩니다:

- ✅ LocalStorage 기반 데이터 관리 (브라우저 저장)
- ✅ Mock 데이터 및 시뮬레이션
- ✅ 실제 결제 처리 없음
- ✅ 실시간 동기화는 폴링 기반
- ⚠️ 프로덕션 사용 불가 (보안 미적용)

## 🤝 기여

이 프로젝트는 교육 및 프로토타입 목적으로 제작되었습니다.
개선 사항이나 버그 리포트는 이슈를 통해 제출해주세요.

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능

## 📞 연락처

문의사항이 있으시면 이슈를 통해 문의해주세요.

---

**제작일**: 2025년 12월 19일
**버전**: 1.0.0
**작성자**: 진영화-회사구함(timotolkie@gmail.com)

> 🍔 BurgerAppDemo로 완전한 주문 생태계를 경험해보세요!
