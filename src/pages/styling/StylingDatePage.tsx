import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { StudioHeader, StudioBottomCTA } from '@/features/styling/components';

/** 이전/다음 달 화살표 (#0088FF) */
const ChevronLeft = () => (
  <svg width="9" height="16" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1L1 6l5 5" stroke="#0088FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="9" height="16" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1l5 5-5 5" stroke="#0088FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** 월 선택 캐럿 (April 2025 옆, bold, #0088FF) */
const CaretRight = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1l5 5-5 5" stroke="#0088FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 요일 헤더 라벨 (표준: 일~토) */
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** April 2025 정적 그리드 (null=빈칸) */
const WEEKS: (number | null)[][] = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, null, null, null],
];

/**
 * 날짜 선택 (Styling Date Selection)
 * - 코디가 필요한 날 선택 → 자동 날씨 반영
 * ※ 정확한 px(폰트·셀 크기·색)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const StylingDatePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number>(20);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        <StudioHeader title="스튜디오" starCount={100} onBack={() => navigate(-1)} />

        {/* 스크롤 영역 */}
        {/* 헤더→타이틀 간격 40 */}
        <div className="flex-1 overflow-y-auto min-h-0 pt-10 pb-6">
          {/* 타이틀 + 서브 */}
          <div className="px-5">
            {/* Figma: Pretendard 500 / 24 / lh32 / tracking -0.24px / #000 */}
            <h1 className="text-2xl font-medium leading-8 tracking-[-0.24px] text-black whitespace-pre-line">
              {'코디가 필요할 날을\n선택해주세요'}
            </h1>
            <p className="mt-2 text-sm font-medium leading-5 text-[#5E5E5E]">
              자동으로 날씨를 반영해줘요
            </p>
          </div>

          {/* 캘린더 카드: 370×329, Top225(간격29), Left10, radius·border 없음, bg white */}
          <div className="mt-[29px] mx-[10px] bg-white p-4">
            {/* 월 헤더 (space-between: 월 그룹 좌 / 화살표 그룹 우) */}
            <div className="flex items-center justify-between">
              {/* 월 텍스트↔캐럿 갭 6, 캐럿 박스 10×18 */}
              <button type="button" className="flex items-center gap-[6px] bg-transparent!">
                {/* Figma(M3): SF Pro Semibold(590) / 17 / lh22 / tracking -0.43px / #000 */}
                <span className="text-[17px] font-semibold leading-[22px] tracking-[-0.43px] text-black">April 2025</span>
                <span className="flex items-center justify-center w-[10px] h-[18px]">
                  <CaretRight />
                </span>
              </button>
              {/* 화살표 그룹 폭 59 (박스 15×24 + 갭 29) */}
              <div className="flex items-center gap-[29px]">
                <button type="button" aria-label="이전 달" className="flex items-center justify-center w-[15px] h-6 bg-transparent!">
                  <ChevronLeft />
                </button>
                <button type="button" aria-label="다음 달" className="flex items-center justify-center w-[15px] h-6 bg-transparent!">
                  <ChevronRight />
                </button>
              </div>
            </div>

            {/* 요일 헤더 (행 height20). Figma(M3): SF Pro Semibold / 13 / lh18 / uppercase / #3C3C43 30% */}
            <div className="mt-4 grid grid-cols-7">
              {WEEKDAYS.map((d, i) => (
                <div key={i} className="text-center text-[13px] font-semibold leading-[18px] uppercase text-[#3C3C43]/30">
                  {d}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="mt-2 grid grid-cols-7 gap-y-2">
              {WEEKS.flat().map((day, i) => {
                if (day === null) return <div key={i} />;
                const isSelected = day === selected;
                const isFirst = day === 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(day)}
                    className="flex items-center justify-center h-11 bg-transparent!"
                  >
                    {/* Figma(M3 Day): 44×44. 일반=Regular/20/tracking -0.45px, 선택=Medium(510)/24/spacing0, 파랑 #0088FF */}
                    <span
                      className={[
                        'flex items-center justify-center w-11 h-11 rounded-full leading-[25px]',
                        isSelected
                          ? 'bg-[#0088FF]/12 text-[#0088FF] text-[24px] font-medium'
                          : isFirst
                            ? 'text-[#0088FF] text-[20px] font-normal tracking-[-0.45px]'
                            : 'text-black text-[20px] font-normal tracking-[-0.45px]',
                      ].join(' ')}
                    >
                      {day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <StudioBottomCTA label="다음" onClick={() => navigate('/styling/mood')} />
      </div>
    </PageLayout>
  );
};

export default StylingDatePage;
