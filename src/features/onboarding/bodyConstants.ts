import natural from '@/assets/images/body/natural.png';
import straight from '@/assets/images/body/straight.png';
import wave from '@/assets/images/body/wave.png';
import type { BodyType } from '@/store/onboardingStore';

export interface BodyTypeOption {
  type: BodyType;
  label: string;
  imageSrc: string;
  description: string;
}

/** 체형 타입 선택지 - 라벨·설명은 Figma 시안 문구 그대로 */
export const BODY_TYPES: BodyTypeOption[] = [
  {
    type: 'straight',
    label: '스트레이트 타입',
    imageSrc: straight,
    description:
      '전체적으로 몸에\n입체감이 있고 탄탄한 편이에요.\n\n무게 중심이 위쪽에 있어서\n목이 조금 짧아 보일 수 있고\n가슴의 위치가 높아요.\n\n살이 찌면 주로 상체와 몸통\n중심으로 붙는 경향이 있어요.',
  },
  {
    type: 'wave',
    label: '웨이브 타입',
    imageSrc: wave,
    description:
      '두께감이 얇고 가녀린 느낌을 줘요.\n\n무게 중심이 아래쪽에 있어서 허리가 길고\n골반 위쪽은 다소 밋밋하지만\n골반 자체의 곡선이 부드럽게 살아있어요.\n\n살이 찌면 하체(허벅지, 엉덩이)\n위주로 붙는 편이에요.',
  },
  {
    type: 'natural',
    label: '내추럴 타입',
    imageSrc: natural,
    description:
      '입체감이나 살집보다는\n뼈대와 관절이 도드라지는 체형이에요.\n\n어깨 골격이 발달했거나\n무릎 뼈, 쇄골 등이 굵고 뚜렷하게 보여요.\n\n전체적으로 프레임이 탄탄해서\n중성적이거나 시크한분위기를 풍겨요.',
  },
];
