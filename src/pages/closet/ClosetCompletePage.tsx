import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import completeBgBlob from '@/assets/images/closet/complete-bg-blob.png';

/**
 * 디지털 옷장 온보딩 완료 — "Fitty를 이용할 준비가 다 됐어요" + blob + 시작하기.
 */
const ClosetCompletePage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        {/* 진행바 — 꽉 참 */}
        <OnboardingTopBar progress={1} />

        <div className="relative flex-1 min-h-0 overflow-hidden">
          {/* 배경 blob — Figma CSS: 857.32², top −36.13, left −300.13, rotate 102.97° (콘텐츠 영역 기준) */}
          <img
            src={completeBgBlob}
            alt=""
            className="pointer-events-none select-none absolute max-w-none"
            style={{
              width: '857.32px',
              height: '857.32px',
              top: '-56.13px',
              left: '-180.13px',
              transform: 'rotate(252.97deg)',
            }}
            draggable={false}
          />

          {/* 타이틀 — 로딩바 아래 152 (Figma Top 259) */}
          <p className="absolute top-[152px] left-1/2 -translate-x-1/2 w-full px-6 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            Fitty를 이용할 준비가 다 됐어요
          </p>
        </div>

        {/* 시작하기 — 바닥 40, bg #1F2124 → 내 옷장 홈 */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet')}
            className="w-full h-[58px] rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8] cursor-pointer"
          >
            시작하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetCompletePage;
