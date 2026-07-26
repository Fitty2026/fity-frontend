/** 코디 생성(스튜디오) 플로우 공통 타입 */

/** 홈 — 최근 코디 카드 */
export interface RecentOutfit {
  id: string;
  image: string;
  /** 예: '2026.06.27' */
  date: string;
  /** 예: ['러블리', '데이트'] — '#' 제외 */
  tags: string[];
  title: string;
}

/** 상황 선택 옵션 (데이트, 출근, 학교, 여행 …) */
export interface SituationOption {
  id: string;
  label: string;
  image: string;
}

/** 기준 아이템 선택 — 옷 썸네일 */
export interface StylingItemThumb {
  id: number;
  image: string;
  category: string;
}
