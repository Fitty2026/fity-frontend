/**
 * 옷 사진을 올린 뒤 AI가 붙여 주는 태그 — 확인/수정 화면에서 다룬다.
 * ※ 태그 생성 API 대기 중이라 값은 아직 목업이다. 사진만 실제로 올린 것을 쓴다.
 */

/** 수정 가능한 칩 종류 — 해시태그뿐 아니라 카테고리/세부/브랜드도 고칠 수 있다 */
export type ChipKind = 'category' | 'subCategory' | 'brand' | 'tag';

/** 칩 식별자 — 같은 이름의 칩이 여러 벌에 있어도 하나만 선택되도록 아이템별로 구분한다 */
export const chipKey = (itemId: number, kind: ChipKind, index = 0) => `${itemId}:${kind}:${index}`;

/** 인식해 AI가 생성한 옷 한 벌 */
export interface OcrItem {
  id: number;
  image: string;
  /** 카테고리 / 세부 카테고리 */
  category: string;
  subCategory: string;
  brand: string;
  tags: string[];
  /** 색상 스와치 hex */
  colors: string[];
}

// TODO(API): 태그 생성 결과와 연동 — 현재 시안 기준 목업
const MOCK_TAGS: Omit<OcrItem, 'id' | 'image'>[] = [
  { category: '아우터', subCategory: '반팔셔츠', brand: 'ZARA', tags: ['캐주얼', '데일리'], colors: ['#FFFFFF'] },
  { category: '상의', subCategory: '나시', brand: 'ZARA', tags: ['Y2K', '데일리'], colors: ['#4E555C', '#FFFFFF'] },
  { category: '하의', subCategory: '카고팬츠', brand: 'MUSINSA', tags: ['캐주얼', '스트릿'], colors: ['#E5E1D5'] },
];

/** 올린 사진들을 확인/수정 화면이 다루는 형태로 — 태그는 API 나올 때까지 목업을 돌려 쓴다 */
export const itemsForPhotos = (photos: string[]): OcrItem[] =>
  photos.map((image, index) => ({
    id: index + 1,
    image,
    ...MOCK_TAGS[index % MOCK_TAGS.length],
  }));
