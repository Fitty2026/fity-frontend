import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { StudioHeader, StudioBottomNav } from '@/features/styling/components';

/** 캘린더 아이콘 — 상황 추천 카드 (21.25×23.89, 흰색) */
const CalendarIcon = () => (
  <svg width="21.25" height="23.89" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.2596 23.8941C1.62819 23.8941 1.09374 23.6754 0.656244 23.2379C0.218748 22.8004 0 22.266 0 21.6346V4.90384C0 4.27243 0.218748 3.73798 0.656244 3.30049C1.09374 2.86299 1.62819 2.64424 2.2596 2.64424H3.9904V0H5.91344V2.64424H15.3846V0H17.2595V2.64424H18.9903C19.6217 2.64424 20.1562 2.86299 20.5937 3.30049C21.0312 3.73798 21.2499 4.27243 21.2499 4.90384V21.6346C21.2499 22.266 21.0312 22.8004 20.5937 23.2379C20.1562 23.6754 19.6217 23.8941 18.9903 23.8941H2.2596ZM2.2596 22.0192H18.9903C19.0865 22.0192 19.1746 21.9791 19.2548 21.899C19.3349 21.8189 19.375 21.7307 19.375 21.6346V9.90384H1.87495V21.6346C1.87495 21.7307 1.91502 21.8189 1.99516 21.899C2.07529 21.9791 2.16344 22.0192 2.2596 22.0192ZM1.87495 8.02888H19.375V4.90384C19.375 4.80768 19.3349 4.71953 19.2548 4.6394C19.1746 4.55926 19.0865 4.5192 18.9903 4.5192H2.2596C2.16344 4.5192 2.07529 4.55926 1.99516 4.6394C1.91502 4.71953 1.87495 4.80768 1.87495 4.90384V8.02888ZM1.87495 8.02888V4.90384C1.87495 4.80768 1.87495 4.71953 1.87495 4.6394C1.87495 4.55926 1.87495 4.5192 1.87495 4.5192C1.87495 4.5192 1.87495 4.55926 1.87495 4.6394C1.87495 4.71953 1.87495 4.80768 1.87495 4.90384V8.02888Z" fill="white" />
  </svg>
);

/** 연필 아이콘 — 직접 코디 카드 (17×17, #1A1C1C) */
const PencilIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.49996 15.5H2.76149L12.9981 5.26339L11.7365 4.00186L1.49996 14.2384V15.5ZM0 16.9999V13.6154L13.1904 0.430759C13.3416 0.293415 13.5086 0.187286 13.6913 0.112372C13.874 0.0374573 14.0656 0 14.2661 0C14.4666 0 14.6608 0.0355759 14.8488 0.106728C15.0367 0.177879 15.2032 0.291018 15.348 0.446143L16.5692 1.68267C16.7243 1.82754 16.8349 1.99423 16.9009 2.18275C16.9669 2.37127 16.9999 2.55979 16.9999 2.74831C16.9999 2.9494 16.9656 3.1413 16.8969 3.32402C16.8282 3.50674 16.719 3.67371 16.5692 3.82493L3.38455 16.9999H0ZM15.5096 2.74611L14.2538 1.49035L15.5096 2.74611ZM12.3562 4.64369L11.7365 4.00186L12.9981 5.26339L12.3562 4.64369Z" fill="#1A1C1C" />
  </svg>
);

/** 오른쪽 화살표 — 직접 코디 카드 (6.71×11.31, #A1A1AA) */
const ChevronRight = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.6 5.65382L0 1.05382L1.05382 0L6.70764 5.65382L1.05382 11.3076L0 10.2538L4.6 5.65382Z" fill="#A1A1AA" />
  </svg>
);

/**
 * 코디 방식 선택 (Styling Method Selection)
 * - 상황으로 추천받기(추천) / 직접 코디하기 두 방식 선택
 * ※ 정확한 px(카드 radius·padding·아이콘 박스·폰트)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const StylingMethodPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        <StudioHeader title="스튜디오" starCount={100} onBack={() => navigate(-1)} />

        {/* 스크롤 영역 */}
        {/* 좌우 여백 20, 헤더→카드1 간격 40 */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 pt-10 pb-6 flex flex-col gap-4">
          {/* 카드 1 — 상황으로 추천받기 (선택 강조). Figma: radius16 / border1 #000 / padding16 / shadow 0 1 2 #000/5% */}
          <button
            type="button"
            onClick={() => navigate('/styling/date')}
            className="relative w-full text-left rounded-2xl border! border-black! bg-white! p-4! shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          >
            {/* 추천 뱃지 (우상단): hug 46×23, radius full, padding 4/12, bg #000 */}
            <span className="absolute top-4 right-4 inline-flex items-center justify-center py-1 px-3 rounded-full bg-black text-white text-[10px] font-medium leading-[15px] tracking-[1px]">
              추천
            </span>
            {/* 아이콘 박스: 48×48, radius8, bg #000 */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black">
              <CalendarIcon />
            </div>
            {/* Figma: Pretendard 500 / 16 / lh24 / #1A1C1C */}
            <p className="mt-4 text-base font-medium leading-6 text-[#1A1C1C]">상황으로 추천받기</p>
            {/* Figma: Pretendard 500 / 16 / lh24 / #4C4546 */}
            <p className="mt-2 text-base font-medium leading-6 text-[#4C4546]">
              날씨, 약속, 장소에 맞는 코디 추천
            </p>
          </button>

          {/* 카드 2 — 직접 코디하기 */}
          <button
            type="button"
            onClick={() => navigate('/styling/items')}
            className="flex items-center gap-4 w-full text-left rounded-2xl border border-[#E5E5E5] bg-white p-4"
          >
            {/* 아이콘 박스: 48×48, radius8, bg #E8E8E8 */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#E8E8E8] shrink-0">
              <PencilIcon />
            </div>
            <div className="flex-1">
              {/* Figma: Pretendard 500 / 18 / lh27 / #1A1C1C */}
              <p className="text-lg font-medium leading-[27px] text-[#1A1C1C]">직접 코디하기</p>
              {/* Figma: Pretendard 500 / 16 / lh24 / #4C4546 */}
              <p className="mt-1 text-base font-medium leading-6 text-[#4C4546]">자유롭게 스타일링</p>
            </div>
            <ChevronRight />
          </button>
        </div>

        <StudioBottomNav activePath="/styling" />
      </div>
    </PageLayout>
  );
};

export default StylingMethodPage;
