import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import { StudioHeader, SectionHeader } from '@/features/styling/components';
import usePuzzleBalance from '@/features/puzzle/hooks/usePuzzleBalance';
import MyOutfitCard from '@/features/myoutfit/components/MyOutfitCard';
import useMyOutfits from '@/features/myoutfit/hooks/useMyOutfits';
import heroBlob from '@/assets/images/styling/hero-blob.png';

/**
 * 코디 시작_홈 (스튜디오 진입 홈)
 * - 헤더(Fitty 로고 + 보유 88개) / AI 코디 추천 히어로 카드 / 최근 코디 보기 / 하단 네비
 */
const StylingStartPage = () => {
  const navigate = useNavigate();
  const puzzleBalance = usePuzzleBalance();
  const { data, error, isPending, refetch } = useMyOutfits();
  const recentOutfits = [...(data?.outfits ?? [])]
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col">
        <StudioHeader logo count={puzzleBalance} />

        {/* 스크롤 콘텐츠 — 좌우 24, 하단 네비(92)만큼 여유 */}
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-[92px]">
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
            {isPending &&
              Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-[156/247] animate-pulse rounded-lg bg-[#E6E8EA]"
                />
              ))}
            {!isPending &&
              recentOutfits.map((outfit) => (
                <MyOutfitCard key={outfit.id} outfit={outfit} />
              ))}
          </div>
          {!isPending && error && (
            <div className="mt-4 text-center">
              <p className="text-[13px] font-medium text-[#6F7881]">
                최근 코디를 불러오지 못했어요.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-2 text-[13px] font-semibold text-[#1F2124] underline"
              >
                다시 시도
              </button>
            </div>
          )}
          {!isPending && !error && recentOutfits.length === 0 && (
            <p className="mt-4 text-center text-[13px] font-medium text-[#6F7881]">
              최근 저장한 코디가 없어요.
            </p>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default StylingStartPage;
