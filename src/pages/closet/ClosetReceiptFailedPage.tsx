import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';

/** 인식 실패 — 48×48 경고, stroke #000 */
const WarnIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M24.0001 17.9999V25.4999M5.39413 32.2519C3.66213 35.2519 5.82813 38.9999 9.29013 38.9999H38.7101C42.1701 38.9999 44.3361 35.2519 42.6061 32.2519L27.8981 6.75586C26.1661 3.75586 21.8341 3.75586 20.1021 6.75586L5.39413 32.2519ZM24.0001 31.4999H24.0141V31.5159H24.0001V31.4999Z"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 영수증 인식 실패 — 올린 영수증을 한 건도 읽지 못했을 때.
 * 경고 아이콘 + 문구 + 직접 입력 링크만 두고 다른 행동은 두지 않는다.
 */
const ClosetReceiptFailedPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showBack onBack={() => navigate(-1)} />

        {/* 경고 아이콘 48×48 — 진행 바 아래 80, 가로 중앙 (Figma top 187) */}
        <div className="mt-20 flex justify-center">
          <WarnIcon />
        </div>

        {/* 문구 블록 375×56, 아이콘 아래 24, 줄 간격 4 */}
        <div className="mt-6 flex flex-col items-center gap-1">
          {/* Title/T3 */}
          <p className="w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            인식에 실패했어요
          </p>
          <button
            type="button"
            onClick={() => navigate('/closet/register/manual')}
            className="w-full cursor-pointer text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169] underline"
          >
            직접 입력하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptFailedPage;
