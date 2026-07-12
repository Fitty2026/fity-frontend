import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { UploadResultGrid, BottomCTA } from '@/features/closet/components';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/** 성공 체크 아이콘 — Figma 에셋 (34×34) */
const SuccessIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.3333 24.3333L26.0833 12.5833L23.75 10.25L14.3333 19.6667L9.58333 14.9167L7.25 17.25L14.3333 24.3333ZM16.6667 33.3333C14.3611 33.3333 12.1944 32.8958 10.1667 32.0208C8.13889 31.1458 6.375 29.9583 4.875 28.4583C3.375 26.9583 2.1875 25.1944 1.3125 23.1667C0.4375 21.1389 0 18.9722 0 16.6667C0 14.3611 0.4375 12.1944 1.3125 10.1667C2.1875 8.13889 3.375 6.375 4.875 4.875C6.375 3.375 8.13889 2.1875 10.1667 1.3125C12.1944 0.4375 14.3611 0 16.6667 0C18.9722 0 21.1389 0.4375 23.1667 1.3125C25.1944 2.1875 26.9583 3.375 28.4583 4.875C29.9583 6.375 31.1458 8.13889 32.0208 10.1667C32.8958 12.1944 33.3333 14.3611 33.3333 16.6667C33.3333 18.9722 32.8958 21.1389 32.0208 23.1667C31.1458 25.1944 29.9583 26.9583 28.4583 28.4583C26.9583 29.9583 25.1944 31.1458 23.1667 32.0208C21.1389 32.8958 18.9722 33.3333 16.6667 33.3333ZM16.6667 30C20.3889 30 23.5417 28.7083 26.125 26.125C28.7083 23.5417 30 20.3889 30 16.6667C30 12.9444 28.7083 9.79167 26.125 7.20833C23.5417 4.625 20.3889 3.33333 16.6667 3.33333C12.9444 3.33333 9.79167 4.625 7.20833 7.20833C4.625 9.79167 3.33333 12.9444 3.33333 16.6667C3.33333 20.3889 4.625 23.5417 7.20833 26.125C9.79167 28.7083 12.9444 30 16.6667 30Z" fill="black"/>
  </svg>
);

/** 등록된 아이템 (와이어프레임용 목업 — 8개, 6개 노출 후 +2) */
const ITEM_IMAGES = Array.from({ length: 8 }, () => '');

/**
 * 옷 추가 완료 (Bulk Upload Success)
 * - 등록 완료 결과 그리드 + 다음 액션
 */
const ClosetCompletePage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-white">
        {/* 헤더 (메인 배경과 경계선) */}
        <header className="flex items-center h-16 px-4 bg-white border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
        </header>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col items-center pt-12 px-5 pb-[14.63px]">
            {/* Figma: Fixed64 × Hug57.33 / radius full / 상하 padding 12 / bg #E8E8E8 */}
            <span className="flex items-center justify-center w-16 h-[57.33px] rounded-full bg-[#E8E8E8]">
              <SuccessIcon />
            </span>
            {/* 아이콘↔타이틀 gap 20 */}
            <h1 className="mt-5 text-2xl font-medium leading-8 tracking-[-0.24px] text-center text-[#1A1C1C]">
              옷이 추가됐어요
            </h1>
            <p className="mt-4 text-base font-medium leading-6 text-center text-[#5E5E5E]">
              총 8개의 아이템이 등록됐어요
            </p>

            {/* 서브텍스트↔그리드 gap 32 */}
            <UploadResultGrid images={ITEM_IMAGES} maxVisible={6} columns={3} className="w-full mt-8" />
          </div>
        </div>

        {/* 하단 CTA (Footer: padding20, bg #FFF 80% + blur12, 구분선 없음)
            gap: 코디↔옷장 16, 옷장↔더추가 32 → gap 죽이고 명시적 mt */}
        <BottomCTA className="shrink-0 border-transparent! bg-white/80! backdrop-blur-[12px] gap-0! pb-[47px]!">
          <button
            type="button"
            onClick={() => navigate('/styling')}
            className="w-full h-14 rounded-lg bg-black! text-white text-base font-medium leading-4 tracking-[1.2px]"
          >
            코디 시작하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/closet')}
            className="w-full h-14 mt-4 rounded-lg border! border-black! bg-white! text-black text-base font-medium leading-4 tracking-[1.2px]"
          >
            옷장 보러가기
          </button>
          <button
            type="button"
            onClick={() => navigate('/closet/register')}
            className="w-full mt-8 text-center text-xs font-medium leading-4 text-[#5E5E5E]"
          >
            더 추가하기
          </button>
        </BottomCTA>
      </div>
    </PageLayout>
  );
};

export default ClosetCompletePage;
