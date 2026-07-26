import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import PageLayout from '@/features/myoutfit/components/MyOutfitPageLayout';
import MyOutfitCard from '@/features/myoutfit/components/MyOutfitCard';
import { useRecentlyDeletedOutfits } from '@/features/myoutfit/hooks/useMyOutfits';

const MyOutfitRecentlyDeletedPage = () => {
  const { data, error, isPending, refetch } = useRecentlyDeletedOutfits();

  const renderContent = () => {
    if (isPending) {
      return <LoadingScreen message="최근 삭제한 코디를 불러오는 중이에요." />;
    }

    if (error) {
      return (
        <ErrorScreen
          title="최근 삭제한 코디를 불러오지 못했어요."
          description={error.message}
          onRetry={() => void refetch()}
        />
      );
    }

    if (!data || data.outfits.length === 0) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-[24px] text-center">
          <p className="text-[18px] font-[600] text-[#1F2124]">최근 삭제한 코디가 없어요.</p>
        </div>
      );
    }

    return (
      <div className="mx-[24px] mt-[16px] grid grid-cols-2 gap-x-[15px] gap-y-[32px] pb-[32px]">
        {data.outfits.map(({ outfit, deletionDaysRemaining }) => (
          <MyOutfitCard
            key={outfit.id}
            outfit={outfit}
            deletionDaysRemaining={deletionDaysRemaining}
          />
        ))}
      </div>
    );
  };

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="최근 삭제된 코디"
      className="select-none"
    >
      <p className="mx-[24px] mt-[14px] text-right text-[10px] font-[500] leading-[165%] tracking-[-2%] text-[#5A6169]">
        삭제된 코디는 30일 후 영구 삭제됩니다
      </p>
      {renderContent()}
    </PageLayout>
  );
};

export default MyOutfitRecentlyDeletedPage;
