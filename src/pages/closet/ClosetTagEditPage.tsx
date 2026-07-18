import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import mockItem from '@/assets/images/closet/tag-mock.png';
import mockLeft from '@/assets/images/closet/tag-mock2.png';
import mockRight from '@/assets/images/closet/tag-mock3.png';

/** 완료 체크 배지 48×48 — 원 #F6F7F8 + 체크 #1F2124 */
const CheckBadge = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1461_116178)">
      <circle cx="24" cy="24" r="24" fill="#F6F7F8" />
      <path d="M13 25L21.8 33L35 15" stroke="#1F2124" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_1461_116178">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/**
 * 태그 확인 및 수정 — "옷이 추가되었어요" + 추가된 옷 캐러셀 + 옷장 보러가기/코디 시작하기.
 */
const ClosetTagEditPage = () => {
  const navigate = useNavigate();
  // 진입 1초 후 체크 배지 표시
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* 로딩바 300/375, fill #9D98F0 */}
        <OnboardingTopBar progress={300 / 375} />

        {/* 안내 문구 — 로딩바 아래 52px, 20 SemiBold #1F2124 */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          옷이 추가되었어요
        </h1>

        {/* 체크 배지 — 타이틀 아래 24px, 중앙 (로딩바→106). 진입 1초 후 표시 (공간은 유지) */}
        <div className="mt-6 flex h-12 justify-center">
          {showCheck && <CheckBadge />}
        </div>

        {/* 캐러셀 — 중앙 155×200 + 양옆(기울임). 배지 아래 58px (로딩바→212) */}
        <div className="relative mt-[58px] h-[200px]">
          {/* 왼쪽 옷 — 126×152 (목업2), border1 #E6E8EA. 중앙 카드 기준: 세로 +67, 가로 간격 16.23, rot −13° */}
          <img
            src={mockLeft}
            alt=""
            className="absolute h-[152px] w-[126px] rounded-2xl border border-[#E6E8EA] object-cover"
            style={{ left: 'calc(50% - 172.21px)', top: '155.22px', transform: 'translate(-50%, -50%) rotate(-13deg)' }}
          />
          {/* 오른쪽 옷 — 126×152 (목업3), border1 #E6E8EA. 중앙 카드 기준: 세로 +67, 가로 간격 24, rot +11.04° */}
          <img
            src={mockRight}
            alt=""
            className="absolute h-[152px] w-[126px] rounded-2xl border border-[#E6E8EA] object-cover"
            style={{ left: 'calc(50% + 177.89px)', top: '153.66px', transform: 'translate(-50%, -50%) rotate(11.04deg)' }}
          />
          {/* 중앙 옷 — 155×200, radius16, border1 #E6E8EA */}
          <img
            src={mockItem}
            alt=""
            className="absolute left-1/2 top-0 -translate-x-1/2 h-[200px] w-[155px] rounded-2xl border border-[#E6E8EA] object-cover"
          />
        </div>

        {/* 버튼 — 화면 바닥 고정, 바닥 여백 40 (간격 8) */}
        <div className="mt-auto flex flex-col gap-2 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet')}
            className="w-full h-[58px] rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124] cursor-pointer"
          >
            옷장 보러가기
          </button>
          {/* 코디 시작하기 — 코디 생성 시작 화면(타 파트)으로 이동 */}
          <button
            type="button"
            onClick={() => navigate('/styling')}
            className="w-full h-[58px] rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124] cursor-pointer"
          >
            코디 시작하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetTagEditPage;
