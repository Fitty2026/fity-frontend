import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import receiptGuide from '@/assets/images/closet/receipt-guide.png';

/** 카메라 — 24×24, stroke white (촬영하기 버튼 좌측) */
const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M6.827 6.17521C6.64699 6.46012 6.40682 6.70219 6.12334 6.88444C5.83985 7.06669 5.51993 7.18471 5.186 7.23021C4.806 7.28421 4.429 7.34221 4.052 7.40521C2.999 7.58021 2.25 8.50721 2.25 9.57421V18.0002C2.25 18.5969 2.48705 19.1692 2.90901 19.5912C3.33097 20.0132 3.90326 20.2502 4.5 20.2502H19.5C20.0967 20.2502 20.669 20.0132 21.091 19.5912C21.5129 19.1692 21.75 18.5969 21.75 18.0002V9.57421C21.75 8.50721 21 7.58021 19.948 7.40521C19.5707 7.34234 19.1927 7.28401 18.814 7.23021C18.4802 7.18457 18.1605 7.06649 17.8772 6.88424C17.5939 6.702 17.3539 6.46 17.174 6.17521L16.352 4.85921C16.1674 4.5593 15.9132 4.3083 15.611 4.12744C15.3089 3.94658 14.9675 3.8412 14.616 3.82021C12.8733 3.7266 11.1267 3.7266 9.384 3.82021C9.03245 3.8412 8.69114 3.94658 8.38896 4.12744C8.08678 4.3083 7.83262 4.5593 7.648 4.85921L6.827 6.17521Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 12.75C16.5 13.9435 16.0259 15.0881 15.182 15.932C14.3381 16.7759 13.1935 17.25 12 17.25C10.8065 17.25 9.66193 16.7759 8.81802 15.932C7.97411 15.0881 7.5 13.9435 7.5 12.75C7.5 11.5565 7.97411 10.4119 8.81802 9.56802C9.66193 8.72411 10.8065 8.25 12 8.25C13.1935 8.25 14.3381 8.72411 15.182 9.56802C16.0259 10.4119 16.5 11.5565 16.5 12.75ZM18.75 10.5H18.758V10.508H18.75V10.5Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 주의 안내 아이콘 — 24×24, fill #959BA7 / stroke #F6F7F8 */
const NoticeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442Z"
      fill="#959BA7"
    />
    <path
      d="M12 9V12.75M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12ZM12 15.75H12.008V15.758H12V15.75Z"
      stroke="#F6F7F8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 카메라 권한 안내 토스트 노출 시간 — 임시값 (문구·형태 디자이너 확인 대기) */
const TOAST_MS = 3000;

/** 촬영 주의사항 — 시안 3줄 */
const NOTICES = [
  '영수증 전체가 보이도록 해주세요',
  '영수증이 구겨지지 않게 해주세요',
  '밝은 곳에서 영수증을 업로드해주세요',
];

/**
 * OCR 카메라 가이드 — 영수증을 어떻게 촬영해야 하는지 안내.
 * 상단 바(건너뛰기·진행 바) + 타이틀 + 예시 이미지 + 주의사항 + 촬영 CTA.
 */
const ClosetCaptureGuidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 촬영 화면에서 카메라 권한이 막혀 되돌아온 경우
  const [showDeniedToast, setShowDeniedToast] = useState(
    Boolean((location.state as { cameraDenied?: boolean } | null)?.cameraDenied),
  );

  useEffect(() => {
    if (!showDeniedToast) return;
    const timer = setTimeout(() => setShowDeniedToast(false), TOAST_MS);
    return () => clearTimeout(timer);
  }, [showDeniedToast]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        {/* 카메라 권한 거부 안내 — 임시 토스트 (시안 미수급) */}
        {showDeniedToast && (
          <div
            role="status"
            className="absolute inset-x-6 bottom-[120px] z-10 rounded-lg bg-black/80 px-4 py-3 text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-white"
          >
            카메라 권한이 거부되어 촬영할 수 없어요
            <br />
            브라우저 설정에서 카메라를 허용해주세요
          </div>
        )}

        {/* 타이틀 — 진행 바 아래 52px, Title/T3 (다른 등록 화면과 동일) */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          결제 정보가 잘 보이도록
          <br />
          다음과 같이 영수증을 촬영해주세요
        </h1>

        {/* 예시 이미지 — 188×250, radius 4, 타이틀 아래 40 (Figma) */}
        <div className="mt-10 flex justify-center">
          <img
            src={receiptGuide}
            alt="영수증 촬영 예시"
            className="h-[250px] w-[188px] rounded-[4px] object-cover"
          />
        </div>

        <div className="flex-1 min-h-0" />

        {/* 주의사항 — 327×98 Hug, bg #F6F7F8 r8, padding 16/24, 아이콘↔문구 gap 4 (Figma) */}
        <div className="px-6">
          <div className="flex items-start gap-[4px] rounded-lg bg-[#F6F7F8] px-6 py-4">
            <span className="shrink-0">
              <NoticeIcon />
            </span>
            {/* Body/B6 — 14px SemiBold, LH 160%, LS -2% */}
            <ul className="text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
              {NOTICES.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 CTA — 327×58 (px 24), 하단 40px */}
        <div className="w-full px-6 pt-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet/register/capture')}
            className="flex h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            <CameraIcon />
            촬영하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetCaptureGuidePage;
