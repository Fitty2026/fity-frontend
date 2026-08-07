import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import registerBgBlob from '@/assets/images/closet-register-bg-blob.png';
import useClosetStore from '@/store/closetStore';

/** 영수증 — 32×32 */
const ReceiptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M3 11H29M3 12H29M7 19H15M7 22H11M6 26H26C26.7957 26 27.5587 25.6839 28.1213 25.1213C28.6839 24.5587 29 23.7956 29 23V9C29 8.20435 28.6839 7.44129 28.1213 6.87868C27.5587 6.31607 26.7957 6 26 6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V23C3 23.7956 3.31607 24.5587 3.87868 25.1213C4.44129 25.6839 5.20435 26 6 26Z"
      stroke="black"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 직접 입력 — 32×32 */
const PencilIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M22.4827 5.983L24.732 3.73233C25.2009 3.26343 25.8369 3 26.5 3C27.1631 3 27.7991 3.26343 28.268 3.73233C28.7369 4.20123 29.0003 4.8372 29.0003 5.50033C29.0003 6.16346 28.7369 6.79943 28.268 7.26833L14.1093 21.427C13.4044 22.1315 12.5352 22.6493 11.58 22.9337L8 24.0003L9.06667 20.4203C9.35104 19.4652 9.86885 18.5959 10.5733 17.891L22.4827 5.983ZM22.4827 5.983L26 9.50033M24 18.667V25.0003C24 25.796 23.6839 26.559 23.1213 27.1216C22.5587 27.6843 21.7956 28.0003 21 28.0003H7C6.20435 28.0003 5.44129 27.6843 4.87868 27.1216C4.31607 26.559 4 25.796 4 25.0003V11.0003C4 10.2047 4.31607 9.44162 4.87868 8.87901C5.44129 8.3164 6.20435 8.00033 7 8.00033H13.3333"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 등록 방식 — 영수증으로 자동 등록 / 직접 입력 두 가지 */
const OPTIONS = [
  {
    key: 'receipt',
    label: '영수증 불러오기',
    icon: <ReceiptIcon />,
    to: '/closet/register/platform',
  },
  {
    key: 'manual',
    label: '직접 입력하기',
    icon: <PencilIcon />,
    to: '/closet/register/manual',
  },
];

/**
 * 옷장 등록 방식 선택 — 안내 문구 + 등록 방식 카드 2개.
 */
const ClosetRegisterPage = () => {
  const navigate = useNavigate();
  const startOcrFlow = useClosetStore((state) => state.startOcrFlow);

  // 등록 플로우의 시작점 — 지난 회차 영수증이 남아 장수가 계속 불어나지 않게 여기서 비운다
  useEffect(() => {
    startOcrFlow();
  }, [startOcrFlow]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
        {/* 배경 blob — Figma: 1078.79², top 0, left -451, angle 10.07°(=CSS -10.07°) */}
        <img
          src={registerBgBlob}
          alt=""
          className="pointer-events-none select-none absolute max-w-none"
          style={{
            width: '1078.79px',
            height: '1078.79px',
            top: '50px',
            left: '-351px',
            transform: 'rotate(-10.07deg)',
          }}
          draggable={false}
        />

        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div className="relative flex-1 overflow-y-auto px-6 pt-[68px]">
          {/* 문구 블록 327×120 — 진행 바 아래 68 (Figma top 175) */}
          <h1 className="text-[24px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            옷을 등록해
            <br />
            코디를 완성해보세요
          </h1>
          {/* Body/B7 — 14px Medium, Primary/600 */}
          <p className="mt-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
            보유한 옷을 추가하면
            <br />
            더 정확한 코디를 추천해드려요
          </p>

          {/* 등록 방식 카드 — 327×80, 문구 아래 200, 카드 간 11 */}
          <div className="mt-[200px] flex flex-col gap-[11px] pb-10">
            {OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => navigate(option.to)}
                // padding 24, radius 16, bg 흰색 20%, shadow 0/8/16 8%
                className="flex h-20 w-full cursor-pointer items-center gap-7 rounded-2xl bg-white/20 p-6 text-left shadow-[0_8px_16px_0_rgba(0,0,0,0.08)] backdrop-blur-md"
              >
                {/* 아이콘만 12 오른쪽으로 (라벨 위치는 그대로 유지하려고 gap을 28로) */}
                <span className="ml-3 shrink-0">{option.icon}</span>
                {/* Body/B1 — 16px Bold */}
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetRegisterPage;
