import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BottomNav from '@/components/layout/BottomNav';
import PageLayout from '@/components/layout/PageLayout';
import PuzzleTopBar from '@/components/layout/PuzzleTopBar';
import MyOutfitCard from '@/features/myoutfit/components/MyOutfitCard';
import useMyOutfits from '@/features/myoutfit/hooks/useMyOutfits';

const MyOutfitListPage = () => {
  const [searchParams] = useSearchParams();
  const likedOnly = searchParams.get('liked') === 'true';
  const { data, error, isPending, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyOutfits(likedOnly);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const outfits = useMemo(() => data?.pages.flatMap((page) => page.outfits) ?? [], [data]);

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

  const renderContent = () => {
    if (isPending) {
      return <LoadingScreen message="저장한 코디를 불러오는 중이에요." />;
    }

    if (error) {
      return (
        <ErrorScreen
          title="코디를 불러오지 못했어요."
          description={error.message}
          onRetry={() => void refetch()}
        />
      );
    }

    if (outfits.length === 0) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-[24px] text-center">
          <p className="text-[18px] font-[600] text-[#1F2124]">
            {likedOnly ? '좋아요한 코디가 없어요.' : '저장한 코디가 없어요.'}
          </p>
          <p className="mt-[8px] text-[14px] font-[500] text-[#6F7881]">
            마음에 드는 코디를 저장하면 이곳에서 다시 볼 수 있어요.
          </p>
        </div>
      );
    }

    return (
      <div className="mx-[24px] mt-[24px] grid grid-cols-2 gap-[15px] pb-[32px]">
        {outfits.map((outfit) => (
          <MyOutfitCard key={outfit.id} outfit={outfit} animateUnlikeRemoval={likedOnly} />
        ))}
        <div ref={loadMoreRef} className="col-span-2 h-px" aria-hidden="true" />
        {isFetchingNextPage ? (
          <p className="col-span-2 py-[12px] text-center text-[13px] text-[#6F7881]">
            코디를 더 불러오는 중이에요.
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={false}
      className="flex min-h-0 flex-col overflow-hidden"
    >
      <PuzzleTopBar title={likedOnly ? '좋아요' : '룩북'} />
      <div className="min-h-0 flex-1 overflow-y-auto pb-[110px]">{renderContent()}</div>
      <BottomNav />
    </PageLayout>
  );
};

export default MyOutfitListPage;
