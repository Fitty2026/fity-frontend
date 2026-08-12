import type { CSSProperties } from 'react';

/**
 * 옷 색상 선택지 — 쇼핑몰마다 다른 색상명을 한 기준으로 모으려고 목록에서 고르게 한다.
 * 배열 순서가 드롭다운 배치(3열, 왼→오 위→아래). 멀티는 대표색이 없어 hex를 비운다.
 */
export const COLOR_OPTIONS = [
  { code: 'BLACK', label: '블랙', hex: '#000000' },
  { code: 'WHITE', label: '화이트', hex: '#FFFFFF' },
  { code: 'GRAY', label: '그레이', hex: '#CED1D5' },
  { code: 'BEIGE', label: '베이지', hex: '#E3DACD' },
  { code: 'NAVY', label: '네이비', hex: '#052D78' },
  { code: 'BROWN', label: '브라운', hex: '#795A45' },
  { code: 'BLUE', label: '블루', hex: '#0876DD' },
  { code: 'RED', label: '레드', hex: '#C74440' },
  { code: 'GREEN', label: '그린', hex: '#4F7654' },
  { code: 'PINK', label: '핑크', hex: '#F4CAE4' },
  { code: 'YELLOW', label: '옐로우', hex: '#F2CF4A' },
  { code: 'MULTI', label: '멀티', hex: '' },
];

/**
 * 영수증 원문 색상명 → 팔레트 12색.
 * 쇼핑몰마다 '딥 인디고', '오트밀' 처럼 제각각이라 대표색으로 모은다.
 * 키워드는 포함 검사라 '딥 인디고 블루' 같은 조합도 걸린다.
 */
const COLOR_KEYWORDS: Record<string, string[]> = {
  BLACK: ['블랙', '검정', '검은', 'black', 'bk'],
  WHITE: ['화이트', '흰', '아이보리', '크림', '오프화이트', '오트밀', 'white', 'ivory'],
  GRAY: ['그레이', '회색', '차콜', '멜란지', 'gray', 'grey', 'charcoal'],
  BEIGE: ['베이지', '카멜', '샌드', '탄', 'beige', 'camel'],
  NAVY: ['네이비', '인디고', '곤색', '남색', 'navy', 'indigo'],
  BROWN: ['브라운', '갈색', '초코', '모카', 'brown'],
  BLUE: ['블루', '파랑', '스카이', '데님', 'blue', 'denim'],
  RED: ['레드', '빨강', '버건디', '와인', 'red', 'burgundy'],
  GREEN: ['그린', '초록', '카키', '올리브', 'green', 'khaki', 'olive'],
  PINK: ['핑크', '분홍', '로즈', 'pink'],
  YELLOW: ['옐로우', '노랑', '머스타드', '레몬', 'yellow', 'mustard'],
  MULTI: ['멀티', '믹스', '패턴', 'multi'],
};

/** #RRGGBB → [r,g,b]. 못 읽으면 null */
const toRgb = (hex: string): [number, number, number] | null => {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

/** 팔레트에서 가장 가까운 색 (단순 RGB 거리 — 정밀도보다 예측 가능성) */
const nearestByHex = (hex: string) => {
  const rgb = toRgb(hex);
  if (!rgb) return undefined;
  let best: (typeof COLOR_OPTIONS)[number] | undefined;
  let bestDistance = Infinity;
  COLOR_OPTIONS.forEach((option) => {
    const target = toRgb(option.hex);
    if (!target) return; // 멀티는 대표색이 없어 건너뛴다
    const distance =
      (rgb[0] - target[0]) ** 2 + (rgb[1] - target[1]) ** 2 + (rgb[2] - target[2]) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = option;
    }
  });
  return best;
};

/**
 * 인식된 색상 원문을 팔레트 색으로 맞춘다.
 * 이름으로 먼저 찾고, 못 찾으면 hex로 가장 가까운 색을 고른다.
 * 둘 다 없으면 빈 값 — 사용자가 드롭다운에서 직접 고른다.
 */
export const matchColorOption = (text?: string, hex?: string | null) => {
  const normalized = (text ?? '').replace(/\s/g, '').toLowerCase();

  if (normalized) {
    const code = Object.keys(COLOR_KEYWORDS).find((key) =>
      COLOR_KEYWORDS[key].some((word) => normalized.includes(word.toLowerCase())),
    );
    const matched = COLOR_OPTIONS.find((option) => option.code === code);
    if (matched) return { label: matched.label, hex: matched.hex };
  }

  if (hex) {
    const matched = nearestByHex(hex);
    if (matched) return { label: matched.label, hex: matched.hex };
  }

  return { label: '', hex: '' };
};

/** 드롭다운 열 수 — 가운데 열에만 좌우 테두리가 들어간다 (Figma) */
export const COLOR_COLUMNS = 3;

/** 아직 고르지 않았을 때 칩 색 */
export const UNKNOWN_COLOR = '#E6E8EA';

/**
 * 멀티 칩 — 단색이 없어 팔레트를 한 바퀴 두른다.
 * ※ 원본 에셋 미수급(내보낸 SVG에 채움이 빠져 있었음) — 임시 근사.
 */
const MULTI_CHIP =
  'conic-gradient(from 90deg, #C74440, #F2CF4A, #4F7654, #0876DD, #052D78, #F4CAE4, #C74440)';

/** 색상 칩 배경 — 안 고른 상태 / 멀티 / 단색 세 갈래 */
export const colorChipStyle = ({ label, hex }: { label: string; hex: string }): CSSProperties => {
  if (!label) return { backgroundColor: UNKNOWN_COLOR };
  return hex ? { backgroundColor: hex } : { backgroundImage: MULTI_CHIP };
};
