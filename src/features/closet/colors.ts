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
