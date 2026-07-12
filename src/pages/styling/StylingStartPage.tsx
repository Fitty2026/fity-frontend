import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { StudioBottomNav } from '@/features/styling/components';

/** 별 아이콘 — 보유 스타 카운트 (헤더 우측, 16×15) */
const StarIcon = () => (
  <svg width="16" height="15" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00003 1L11.472 5.93691L17 6.73344L13 10.5741L13.944 16L9.00003 13.4369L4.05603 16L5.00003 10.5741L1.00003 6.73344L6.52803 5.93691L9.00003 1Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 프로필 아이콘 — 헤더 우측 (20×20, #1C1B1F) */
const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.85 15.1C4.7 14.45 5.65 13.9375 6.7 13.5625C7.75 13.1875 8.85 13 10 13C11.15 13 12.25 13.1875 13.3 13.5625C14.35 13.9375 15.3 14.45 16.15 15.1C16.7333 14.4167 17.1875 13.6417 17.5125 12.775C17.8375 11.9083 18 10.9833 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 10.9833 2.1625 11.9083 2.4875 12.775C2.8125 13.6417 3.26667 14.4167 3.85 15.1ZM7.5125 9.9875C6.8375 9.3125 6.5 8.48333 6.5 7.5C6.5 6.51667 6.8375 5.6875 7.5125 5.0125C8.1875 4.3375 9.01667 4 10 4C10.9833 4 11.8125 4.3375 12.4875 5.0125C13.1625 5.6875 13.5 6.51667 13.5 7.5C13.5 8.48333 13.1625 9.3125 12.4875 9.9875C11.8125 10.6625 10.9833 11 10 11C9.01667 11 8.1875 10.6625 7.5125 9.9875ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM12.5 17.6125C13.2833 17.3542 14 16.9833 14.65 16.5C14 16.0167 13.2833 15.6458 12.5 15.3875C11.7167 15.1292 10.8833 15 10 15C9.11667 15 8.28333 15.1292 7.5 15.3875C6.71667 15.6458 6 16.0167 5.35 16.5C6 16.9833 6.71667 17.3542 7.5 17.6125C8.28333 17.8708 9.11667 18 10 18C10.8833 18 11.7167 17.8708 12.5 17.6125ZM11.075 8.575C11.3583 8.29167 11.5 7.93333 11.5 7.5C11.5 7.06667 11.3583 6.70833 11.075 6.425C10.7917 6.14167 10.4333 6 10 6C9.56667 6 9.20833 6.14167 8.925 6.425C8.64167 6.70833 8.5 7.06667 8.5 7.5C8.5 7.93333 8.64167 8.29167 8.925 8.575C9.20833 8.85833 9.56667 9 10 9C10.4333 9 10.7917 8.85833 11.075 8.575Z" fill="#1C1B1F" />
  </svg>
);

/** 반짝임 아이콘 — 히어로 카드 (28×28, 흰색) */
const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 10L20.9375 6.5625L17.5 5L20.9375 3.4375L22.5 0L24.0625 3.4375L27.5 5L24.0625 6.5625L22.5 10ZM22.5 27.5L20.9375 24.0625L17.5 22.5L20.9375 20.9375L22.5 17.5L24.0625 20.9375L27.5 22.5L24.0625 24.0625L22.5 27.5ZM10 23.75L6.875 16.875L0 13.75L6.875 10.625L10 3.75L13.125 10.625L20 13.75L13.125 16.875L10 23.75Z" fill="white" />
  </svg>
);

/** 하트 아이콘 — 최근 코디 카드 (12×11, #1A1C1C) */
const HeartIcon = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.83333 10.7042L4.9875 9.94583C4.00556 9.06111 3.19375 8.29792 2.55208 7.65625C1.91042 7.01458 1.4 6.43854 1.02083 5.92812C0.641667 5.41771 0.376736 4.94861 0.226042 4.52083C0.0753472 4.09306 0 3.65556 0 3.20833C0 2.29444 0.30625 1.53125 0.91875 0.91875C1.53125 0.30625 2.29444 0 3.20833 0C3.71389 0 4.19514 0.106944 4.65208 0.320833C5.10903 0.534722 5.50278 0.836111 5.83333 1.225C6.16389 0.836111 6.55764 0.534722 7.01458 0.320833C7.47153 0.106944 7.95278 0 8.45833 0C9.37222 0 10.1354 0.30625 10.7479 0.91875C11.3604 1.53125 11.6667 2.29444 11.6667 3.20833C11.6667 3.65556 11.5913 4.09306 11.4406 4.52083C11.2899 4.94861 11.025 5.41771 10.6458 5.92812C10.2667 6.43854 9.75625 7.01458 9.11458 7.65625C8.47292 8.29792 7.66111 9.06111 6.67917 9.94583L5.83333 10.7042Z" fill="#1A1C1C" />
  </svg>
);

/** 최근 코디 목업 (와이어프레임 — 이미지 없이 회색 박스) */
const RECENT = [
  { id: 1, label: '모던 출근 룩' },
  { id: 2, label: '주말 데이트 룩' },
];

/**
 * 스타일링 진입 홈 (Styling Entry Hub, STY-01)
 * - "코디 추천 받기" 히어로 → 방식 선택으로 진입 + 최근 코디 리스트
 */
const StylingStartPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        {/* 헤더 (390×64) — FITTY 로고(left 20) / ☆카운트 / 프로필(right ~22) */}
        <header className="flex items-center justify-between h-16 pl-5 pr-[22px] bg-white">
          {/* Figma: Epilogue 900 / 18px / lh28 / tracking -0.9px / #000 */}
          <span className="font-['Epilogue'] font-[900] text-[18px] leading-[28px] tracking-[-0.9px] text-black">
            FITTY
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <StarIcon />
              {/* Figma: Pretendard 500 / 14px / lh20 / #5E5E5E */}
              <span className="text-[14px] font-medium leading-5 text-[#5E5E5E]">100</span>
            </div>
            <button type="button" aria-label="프로필" className="bg-transparent! p-0!">
              <ProfileIcon />
            </button>
          </div>
        </header>

        {/* 스크롤 영역 (헤더↔타이틀 간격 32) */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 pt-8 pb-6">
          {/* 타이틀 — Figma: Pretendard 500 / 24px / lh32 / tracking -0.24px / #000 */}
          <h1 className="text-[24px] font-medium leading-8 tracking-[-0.24px] text-black">오늘 뭐 입지?</h1>
          <p className="mt-2 text-sm font-medium leading-5 text-[#5E5E5E]">
            내 옷으로 코디를 만들어보세요
          </p>

          {/* 히어로 카드 — 코디 추천 받기 (Figma: radius12 / border1 #000/5% / pad T32 R24 B24 L24 / shadow) */}
          <button
            type="button"
            onClick={() => navigate('/styling/method')}
            className="mt-6 w-full text-left rounded-xl bg-black! border! border-black/5! pt-8! pr-6! pb-6! pl-6! shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          >
            {/* 아이콘 박스: 48 고정폭 × hug, radius8, bg #FFF/10%, 상하 padding 6 */}
            <div className="flex items-center justify-center w-12 rounded-lg bg-white/10 py-[6px]">
              <SparkleIcon />
            </div>
            {/* Figma: Pretendard 500 / 20 / lh28 / #FFF */}
            <p className="mt-8 text-xl font-medium leading-7 text-white">코디 추천 받기</p>
            {/* Figma: Pretendard 500 / 14 / lh20 / #FFF 70% */}
            <p className="mt-2 text-sm font-medium leading-5 text-white/70">
              상황에 맞는 코디를 자동으로 추천해드려요
            </p>
          </button>

          {/* 최근 코디 보기 */}
          <div className="mt-12 flex items-center justify-between">
            {/* Figma: Pretendard 500 / 20 / lh28 / #000 */}
            <h2 className="text-xl font-medium leading-7 text-black">최근 코디 보기</h2>
            <button
              type="button"
              /* Figma: Pretendard 500 / 12 / lh16 / #5E5E5E */
              className="bg-transparent! p-0! text-xs font-medium leading-4 text-[#5E5E5E]"
            >
              전체보기
            </button>
          </div>

          {/* Figma: Grid 2열 / row·column gap 16 / 컨테이너 350×211(hug) */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {RECENT.map((item) => (
              <div key={item.id} className="flex flex-col">
                {/* Figma: 167×167 정사각 / radius12 / bg #E8E8E8 / border 1px #CFC4C5 30% */}
                <div className="relative w-full aspect-square rounded-xl bg-[#E8E8E8] border border-[#CFC4C5]/30 overflow-hidden">
                  {/* 좋아요: top8/right8, radius full, padding6, bg #FFF/80%, blur8 */}
                  <span className="absolute top-2 right-2 flex items-center justify-center p-[6px] rounded-full bg-white/80 backdrop-blur-[8px]">
                    <HeartIcon />
                  </span>
                </div>
                {/* Figma: Pretendard 500 / 12 / lh16 / tracking 0.6px / #1A1C1C, 이미지↔라벨 간격 8 */}
                <p className="mt-2 text-xs font-medium leading-4 tracking-[0.6px] text-[#1A1C1C]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 탭바 (390×80) — 스튜디오 active */}
        <StudioBottomNav activePath="/styling" />
      </div>
    </PageLayout>
  );
};

export default StylingStartPage;
