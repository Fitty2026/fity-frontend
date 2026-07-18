// ============================================================
// 공통
// ============================================================
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ============================================================
// 유저 / 인증
// ============================================================
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  stylePreferences: StyleTag[];
  bodyImageUrl?: string;
  starCount: number;
  freeGenerationLeft: number; // 하루 무료 생성 잔여 횟수
}

export type SocialProvider = 'google' | 'apple' | 'kakao' | 'email';

// ============================================================
// 온보딩
// ============================================================
export type StyleTag =
  | '캐주얼'
  | '미니멀'
  | '스트리트'
  | '포멀'
  | '빈티지'
  | '스포티'
  | '페미닌'
  | '아메카지';

export interface OnboardingState {
  selectedStyles: StyleTag[];
  bodyType?: 'straight' | 'wave' | 'natural';
  bodyPhotoUrls?: string[];
}

// ============================================================
// 옷장 (Closet)
// ============================================================
export type ClothingCategory = '상의' | '하의' | '아우터' | '신발' | '가방' | '액세서리';

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  tags: string[];
  brand?: string;
  purchasedFrom?: string; // 구매 플랫폼
  createdAt: string;
}

// ============================================================
// 코디 생성 (Styling)
// ============================================================
export type StylingContext =
  | '학교'
  | '출근'
  | '데이트'
  | '여행'
  | '꾸안꾸'
  | string; // 직접 입력

export interface StylingRequest {
  context?: StylingContext;
  date?: string;           // YYYY-MM-DD
  mood?: string;
  baseItemId?: string;     // 기준 아이템 ID
}

// ============================================================
// 코디 결과 (Outfit)
// ============================================================
export interface Outfit {
  id: string;
  imageUrl: string;        // AI 합성 실사 이미지
  items: ClothingItem[];
  styleTags: string[];
  context?: StylingContext;
  memo?: string;
  createdAt: string;
  isSaved: boolean;
}

// ============================================================
// 커머스
// ============================================================
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: ClothingCategory;
  externalUrl: string;     // 외부 쇼핑몰 링크
  reason?: string;         // 추천 이유
}

// ============================================================
// 스타 시스템
// ============================================================
export interface StarHistory {
  id: string;
  type: 'earn' | 'use';
  amount: number;
  reason: string;
  createdAt: string;
}