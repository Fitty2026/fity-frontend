import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { StudioHeader, StudioBottomCTA, SelectableImageCard } from '@/features/styling/components';
import dateImg from '@/assets/images/moods/date.jpg';
import workoutImg from '@/assets/images/moods/workout.jpg';
import workImg from '@/assets/images/moods/work.jpg';
import partyImg from '@/assets/images/moods/party.jpg';
import travelImg from '@/assets/images/moods/travel.jpg';
import homeImg from '@/assets/images/moods/home.jpg';

const MOODS = [
  { label: '데이트', img: dateImg },
  { label: '운동', img: workoutImg },
  { label: '출근', img: workImg },
  { label: '파티', img: partyImg },
  { label: '여행', img: travelImg },
  { label: '집 앞', img: homeImg },
];

/** 텍스트 입력 + 아이콘 (14×14, #565657) */
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="#565657" />
  </svg>
);

/**
 * 무드 선택 (Mood Selection, MOOD-01)
 * - 코디가 필요한 상황(장소 분위기) 선택 → 자동 반영
 * ※ 정확한 px(카드 비율·간격·폰트·입력창)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const StylingMoodPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number>(0);
  const [place, setPlace] = useState('');

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        <StudioHeader title="스튜디오" starCount={100} onBack={() => navigate(-1)} />

        {/* 스크롤 영역 */}
        {/* 좌우 20, 헤더→타이틀 갭 32, 검색창→CTA 52(pb32 + CTA pt20) */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 pt-8 pb-8">
          {/* 타이틀 + 서브 */}
          <h1 className="text-2xl font-medium leading-8 tracking-[-0.24px] text-black whitespace-pre-line">
            {'코디가 필요한\n상황을 알려주세요'}
          </h1>
          <p className="mt-2 text-sm font-medium leading-5 text-[#5E5E5E]">
            자동으로 장소의 분위기를 반영해줘요.
          </p>

          {/* 무드 그리드 (2열, 가로 16 / 세로: 이미지끼리 40 = gap16 + 라벨16 + 라벨갭8) */}
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
            {MOODS.map((mood, i) => (
              <SelectableImageCard
                key={mood.label}
                src={mood.img}
                label={mood.label}
                selected={selected === i}
                onClick={() => setSelected(i)}
                aspectRatio="1/1"
                labelPosition="below"
                imageClassName="border border-[#E2E2E2]"
              />
            ))}
          </div>

          {/* 텍스트 직접 입력 (Search Field): 44 hug, radius100, padding 11/20, fill #787880 16%.
              라벨 바텀 → 검색창 = 38 */}
          <div className="mt-[38px] flex items-center gap-[34px] py-[11px] px-5 rounded-full bg-[#787880]/16">
            {/* Figma: SF Pro Regular / 15 / lh22 / tracking -0.08px, placeholder #727272 */}
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="혹은 텍스트로 장소를 입력해주세요"
              className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-normal leading-[22px] tracking-[-0.08px] text-[#1A1C1C] placeholder:text-[#727272]"
            />
            <button
              type="button"
              aria-label="장소 추가"
              className="flex items-center justify-center w-6 h-6 shrink-0 bg-transparent!"
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* 하단 CTA */}
        <StudioBottomCTA label="다음" onClick={() => navigate('/styling/items')} />
      </div>
    </PageLayout>
  );
};

export default StylingMoodPage;
