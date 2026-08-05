import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import OnboardingTopBar from './OnboardingTopBar';
import receiptGuide from '@/assets/images/closet/receipt-guide.png';

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

/** 촬영·업로드 공통 주의사항 — 시안 3줄 */
const NOTICES = [
  '영수증 전체가 보이도록 해주세요',
  '영수증이 구겨지지 않게 해주세요',
  '밝은 곳에서 영수증을 업로드해주세요',
];

interface ReceiptGuideScreenProps {
  /** 타이틀 두 번째 줄 (첫 줄은 '결제 정보가 잘 보이도록' 고정) */
  titleSecondLine: string;
  /** 예시 이미지 alt */
  imageAlt: string;
  /** 예시 이미지 아래 보조 안내 (없으면 미노출) */
  hint?: ReactNode;
  /** CTA 좌측 아이콘 */
  ctaIcon: ReactNode;
  /** CTA 라벨 */
  ctaLabel: string;
  onCta: () => void;
  /** 상단 바 아래에 얹을 요소 (토스트 등) */
  overlay?: ReactNode;
  /** CTA 옆에 함께 렌더할 요소 (숨긴 file input 등) */
  extra?: ReactNode;
}

/**
 * 영수증 가이드 화면 — 촬영·업로드가 구조가 같아 공통으로 쓴다.
 * 상단 바(건너뛰기·진행 바) + 타이틀 + 예시 이미지 + 주의사항 + CTA.
 */
const ReceiptGuideScreen = ({
  titleSecondLine,
  imageAlt,
  hint,
  ctaIcon,
  ctaLabel,
  onCta,
  overlay,
  extra,
}: ReceiptGuideScreenProps) => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        {overlay}

        {/* 타이틀 — 진행 바 아래 52px, Title/T3 (다른 등록 화면과 동일) */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          결제 정보가 잘 보이도록
          <br />
          {titleSecondLine}
        </h1>

        {/* 예시 이미지 — 188×250, radius 4, 타이틀 아래 40 (Figma) */}
        <div className="mt-10 flex justify-center">
          <div className="relative h-[250px] w-[188px]">
            <img src={receiptGuide} alt={imageAlt} className="h-full w-full rounded-[4px] object-cover" />
            {/* 결제 정보 강조 — 1px dashed #9D98F0. 위치·크기는 눈으로 맞춘 값 (시안 91×37) */}
            <span
              aria-hidden
              className="absolute h-[27px] w-[76px] rounded-[4px] border border-dashed border-[#9D98F0]"
              style={{ left: 32, top: 61 }}
            />
          </div>
        </div>

        {hint}

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
          {extra}
          <button
            type="button"
            onClick={onCta}
            className="flex h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            {ctaIcon}
            {ctaLabel}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReceiptGuideScreen;
