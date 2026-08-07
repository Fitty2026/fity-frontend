import mockOuter from '@/assets/images/closet/tag-mock2.png';
import mockTop from '@/assets/images/closet/tag-mock.png';
import mockBottom from '@/assets/images/closet/tag-mock3.png';

/** 수정 가능한 칩 종류 — 해시태그뿐 아니라 카테고리/세부/브랜드도 고칠 수 있다 */
export type ChipKind = 'category' | 'subCategory' | 'brand' | 'tag';

/** 칩 식별자 — 같은 이름의 칩이 여러 벌에 있어도 하나만 선택되도록 아이템별로 구분한다 */
export const chipKey = (itemId: number, kind: ChipKind, index = 0) => `${itemId}:${kind}:${index}`;

/** OCR이 인식해 AI가 생성한 옷 한 벌 — 확인/수정 화면에서 다룬다 */
export interface OcrItem {
  id: number;
  image: string;
  /** 카테고리 / 세부 카테고리 */
  category: string;
  subCategory: string;
  brand: string;
  /** '#' 포함 문자열 */
  tags: string[];
  /** 색상 스와치 hex */
  colors: string[];
}

// TODO(API): OCR 작업 결과(상품 목록)와 연동 — 현재 시안 기준 목업
export const OCR_ITEMS: OcrItem[] = [
  {
    id: 1,
    image: mockOuter,
    category: '아우터',
    subCategory: '반팔셔츠',
    brand: 'ZARA',
    tags: ['#캐주얼', '#데일리'],
    colors: ['#FFFFFF'],
  },
  {
    id: 2,
    image: mockTop,
    category: '상의',
    subCategory: '나시',
    brand: 'ZARA',
    tags: ['#Y2K', '#데일리'],
    colors: ['#4E555C', '#FFFFFF'],
  },
  {
    id: 3,
    image: mockBottom,
    category: '하의',
    subCategory: '카고팬츠',
    brand: 'MUSINSA',
    tags: ['#캐주얼', '#스트릿'],
    colors: ['#E5E1D5'],
  },
];
