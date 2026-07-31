import style1 from '@/assets/images/style-1.png';
import style2 from '@/assets/images/style-2.png';
import style3 from '@/assets/images/style-3.png';
import style4 from '@/assets/images/style-4.png';
import style5 from '@/assets/images/style-5.png';
import style6 from '@/assets/images/style-6.png';
import type { StyleTag } from '@/types';

export interface StyleTile {
  id: string;
  imageSrc: string;
  tag: StyleTag;
  /** 서버 스타일 태그 ID (USER-01 styleTagIds) */
  tagId: number;
}

/** 취향 선택 카드에 쓰는 스타일 타일 - 기존 스타일 이미지·태그 재사용 */
export const STYLE_TILES: StyleTile[] = [
  { id: 'tile-1', imageSrc: style1, tag: '포멀', tagId: 1 },
  { id: 'tile-2', imageSrc: style2, tag: '페미닌', tagId: 2 },
  { id: 'tile-3', imageSrc: style3, tag: '미니멀', tagId: 3 },
  { id: 'tile-4', imageSrc: style4, tag: '캐주얼', tagId: 4 },
  { id: 'tile-5', imageSrc: style5, tag: '빈티지', tagId: 5 },
  { id: 'tile-6', imageSrc: style6, tag: '스트리트', tagId: 6 },
];
