import { useNavigate } from 'react-router-dom';
import { StudioHeader, StudioBottomNav, SectionHeader, RecentOutfitCard } from '@/features/styling/components';
import type { RecentOutfit } from '@/features/styling/types';
import heroBlob from '@/assets/images/styling/hero-blob.png';
import lovelyDate from '@/assets/images/styling/recent-lovely-date.png';
import modernWork from '@/assets/images/styling/recent-modern-work.png';

/** 최근 코디 목업 */
const RECENT: RecentOutfit[] = [
  { id: 1, image: lovelyDate, date: '2026.06.27', tags: ['러블리', '데이트'], title: '러블리 데이트룩' },
  { id: 2, image: modernWork, date: '2026.06.27', tags: ['모던', '출근'], title: '모던 출근룩' },
];

/**
 * 코디 시작_홈 (스튜디오 진입 홈)
 * - 헤더(Fitty 로고 + 보유 88개) / AI 코디 추천 히어로 카드 / 최근 코디 보기 / 하단 네비
 */
const StylingStartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col">
        <StudioHeader logo count={88} />

        {/* 스크롤 콘텐츠 — 좌우 24, 하단 네비(66)만큼 여유 */}
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-28">
          {/* 히어로 카드 — AI 코디 추천 받기 (Figma: 327×236.82, radius8, pad 10/10/16/10, gap10, #312C48, shadow 0 8 16 #000 8%) */}
          <button
            type="button"
            onClick={() => navigate('/styling/method')}
            className="w-full flex flex-col items-center gap-2.5 rounded-lg bg-[#312C48] pt-2.5 px-2.5 pb-4 shadow-[0_8px_16px_0_rgba(0,0,0,0.08)]"
          >
            {/* 블롭: 115.47×112.34, rotation 25.2°, crop / 레이아웃 영역 ≈139 */}
            <span className="flex items-center justify-center h-[139px]">
              <img
                src={heroBlob}
                alt=""
                className="w-[115.47px] h-[112.34px] object-cover rotate-[-14.8deg]"
              />
            </span>
            {/* 타이틀+서브 그룹 (gap 8) */}
            <span className="flex flex-col gap-2">
              {/* 타이틀: Pretendard 700 / 20px / lh150% / -2% / #F6F7F8 */}
              <span className="text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-center text-[#F6F7F8]">
                AI 코디 추천 받기
              </span>
              {/* 서브: Pretendard 500 / 14px / lh160% / -2% / #B2B8BD */}
              <span className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-center text-[#B2B8BD]">
                상황에 맞는 코디를 자동으로 추천해드려요
              </span>
            </span>
          </button>

          {/* 최근 코디 보기 (히어로 카드↔섹션 48.18) */}
          <SectionHeader
            className="mt-[48.18px]"
            title="최근 코디 보기"
            onAction={() => navigate('/myoutfit')}
          />
          <div className="mt-4 grid grid-cols-2 gap-[15px]">
            {RECENT.map((outfit) => (
              <RecentOutfitCard
                key={outfit.id}
                outfit={outfit}
                onClick={() => navigate(`/myoutfit/${outfit.id}`)}
              />
            ))}
          </div>
        </div>

        <StudioBottomNav />
      </div>
    </div>
  );
};

export default StylingStartPage;
