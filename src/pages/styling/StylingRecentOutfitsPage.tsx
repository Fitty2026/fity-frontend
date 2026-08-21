import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { StudioHeader, RecentOutfitCard } from '@/features/styling/components';
import usePuzzleBalance from '@/features/puzzle/hooks/usePuzzleBalance';
import useMyOutfits from '@/features/myoutfit/hooks/useMyOutfits';

/**
 * 최근 코디 전체보기 (홈 '전체보기' → /styling/recent)
 * - 헤더(뒤로가기 + '최근 코디' + 보유 개수) / 코디 카드 2열 그리드
 * - 하단 네비 없음(시안). 스크롤 끝에 닿으면 다음 페이지를 이어 불러온다
 */
const StylingRecentOutfitsPage = () => {
  const navigate = useNavigate();
  const puzzleBalance = usePuzzleBalance();
  const { data, error, isPending, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyOutfits();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const outfits = [...(data?.outfits ?? [])].sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) void fetchNextPage();
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="h-screen overflow-hidden bg-neutral-100 flex justify-center" style={{ height: '100dvh' }}>
      <div className="relative w-full max-w-[430px] h-full bg-white flex flex-col">
        <StudioHeader title="최근 코디" onBack={() => navigate(-1)} count={puzzleBalance} />

        {/* 스크롤 콘텐츠 — 좌우 24, 헤더↔첫 카드 24 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {isPending &&
              Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="aspect-[156/247] animate-pulse rounded-lg bg-[#E6E8EA]" />
              ))}
            {!isPending &&
              outfits.map((outfit) => (
                <RecentOutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onClick={() => navigate(`/myoutfit/${outfit.id}`)}
                />
              ))}
            <div ref={loadMoreRef} className="col-span-2 h-px" aria-hidden="true" />
          </div>

          {isFetchingNextPage && (
            <p className="mt-4 text-center text-[13px] font-medium text-[#6F7881]">
              코디를 더 불러오는 중이에요.
            </p>
          )}
          {!isPending && error && (
            <div className="mt-4 text-center">
              <p className="text-[13px] font-medium text-[#6F7881]">코디를 불러오지 못했어요.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-2 text-[13px] font-semibold text-[#1F2124] underline"
              >
                다시 시도
              </button>
            </div>
          )}
          {!isPending && !error && outfits.length === 0 && (
            <p className="mt-4 text-center text-[13px] font-medium text-[#6F7881]">
              최근 저장한 코디가 없어요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StylingRecentOutfitsPage;
