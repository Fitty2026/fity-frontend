import type { ClothingItem } from '../../types';
import topImg from '../../assets/images/items/top.jpg';
import top2Img from '../../assets/images/items/top2.jpg';
import pantsImg from '../../assets/images/items/pants.jpg';
import outerImg from '../../assets/images/items/outer.jpg';
import shoesImg from '../../assets/images/items/shoes.jpg';
import tagMock1 from '../../assets/images/closet/tag-mock.png';
import tagMock2 from '../../assets/images/closet/tag-mock2.png';
import tagMock3 from '../../assets/images/closet/tag-mock3.png';

export const mockClosetItems: ClothingItem[] = [
  {
    id: 'item-001',
    imageUrl: topImg,
    category: '상의',
    tags: ['베이직', '화이트', '반팔', '면'],
    brand: '유니클로',
    purchasedFrom: '무신사',
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'item-002',
    imageUrl: pantsImg,
    category: '하의',
    tags: ['슬림', '블랙', '데님', '진'],
    brand: '리바이스',
    purchasedFrom: '무신사',
    createdAt: '2026-03-12T00:00:00Z',
  },
  {
    id: 'item-003',
    imageUrl: outerImg,
    category: '아우터',
    tags: ['블랙', '레더', '자켓', '라이더'],
    brand: '코스',
    purchasedFrom: '29CM',
    createdAt: '2026-03-15T00:00:00Z',
  },
  {
    id: 'item-004',
    imageUrl: shoesImg,
    category: '신발',
    tags: ['화이트', '스니커즈', '캐주얼'],
    brand: '나이키',
    purchasedFrom: '에이블리',
    createdAt: '2026-03-18T00:00:00Z',
  },
  {
    id: 'item-005',
    imageUrl: top2Img,
    category: '액세서리',
    tags: ['목도리', '그레이', '니트'],
    brand: '무신사 스탠다드',
    purchasedFrom: '무신사',
    createdAt: '2026-03-20T00:00:00Z',
  },
  {
    id: 'item-006',
    imageUrl: tagMock1,
    category: '상의',
    tags: ['스트라이프', '슬리브리스', '나시'],
    brand: '지오다노',
    purchasedFrom: '지그재그',
    createdAt: '2026-03-22T00:00:00Z',
  },
  {
    id: 'item-007',
    imageUrl: tagMock2,
    category: '상의',
    tags: ['스트라이프', '긴팔', '티셔츠'],
    brand: '유니클로',
    purchasedFrom: '무신사',
    createdAt: '2026-04-02T00:00:00Z',
  },
  {
    id: 'item-008',
    imageUrl: tagMock3,
    category: '하의',
    tags: ['와이드', '베이지', '슬랙스'],
    brand: '코스',
    purchasedFrom: '29CM',
    createdAt: '2026-04-05T00:00:00Z',
  },
  {
    id: 'item-009',
    imageUrl: pantsImg,
    category: '하의',
    tags: ['연청', '데님', '스트레이트'],
    brand: '리바이스',
    purchasedFrom: '무신사',
    createdAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'item-010',
    imageUrl: shoesImg,
    category: '신발',
    tags: ['블랙', '로퍼', '포멀'],
    brand: '닥터마틴',
    purchasedFrom: '29CM',
    createdAt: '2026-04-12T00:00:00Z',
  },
  {
    id: 'item-011',
    imageUrl: tagMock3,
    category: '하의',
    tags: ['화이트', '카고', '팬츠'],
    brand: '무신사 스탠다드',
    purchasedFrom: '무신사',
    createdAt: '2026-04-15T00:00:00Z',
  },
];
