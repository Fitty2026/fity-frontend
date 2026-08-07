/**
 * OCR이 지원하는 쇼핑몰 — 플랫폼 선택 화면과 영수증 구매처 드롭다운이 같이 쓴다.
 * 순서는 플랫폼 선택 휠의 배치(위에서 아래) 기준.
 */
export const SHOPPING_MALLS = [
  { code: 'ABLY', label: '에이블리' },
  { code: 'MUSINSA', label: '무신사' },
  { code: 'ZIGZAG', label: '지그재그' },
] as const;

export type ShoppingMallCode = (typeof SHOPPING_MALLS)[number]['code'];

/**
 * 구매처 원문을 지원 쇼핑몰 코드로 맞춘다.
 * 지점명이 붙거나('무신사 스탠다드 강남점') 한글·영문이 섞여 와도 한 코드로 모인다.
 * 어디에도 안 걸리면 빈 값 — 지원하지 않는 쇼핑몰이라 사용자가 드롭다운에서 고른다.
 */
export const toShoppingMallCode = (text: string): ShoppingMallCode | '' => {
  const normalized = text.replace(/\s/g, '').toUpperCase();
  const matched = SHOPPING_MALLS.find(
    (mall) => normalized.includes(mall.code) || normalized.includes(mall.label),
  );
  return matched?.code ?? '';
};

/** 코드 → 표시용 이름. 모르는 코드면 빈 값 */
export const shoppingMallLabel = (code: string) =>
  SHOPPING_MALLS.find((mall) => mall.code === code)?.label ?? '';
