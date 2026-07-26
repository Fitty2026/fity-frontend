import PageLayout from '@/components/layout/PageeLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import MyOutfitCard from '@/features/myoutfit/components/MyOutfitCard';
import useMyOutfits from '@/features/myoutfit/hooks/useMyOutfits';

const MyOutfitListPage = () => {
  const { data, error, isPending, refetch } = useMyOutfits();

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

    if (!data || data.outfits.length === 0) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-[24px] text-center">
          <p className="text-[18px] font-[600] text-[#1F2124]">저장한 코디가 없어요.</p>
          <p className="mt-[8px] text-[14px] font-[500] text-[#6F7881]">
            마음에 드는 코디를 저장하면 이곳에서 다시 볼 수 있어요.
          </p>
        </div>
      );
    }

    return (
      <div className="mx-[24px] mt-[24px] grid grid-cols-2 gap-[15px] pb-[32px]">
        {data.outfits.map((outfit) => (
          <MyOutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>
    );
  };

  return (
    <PageLayout
      showBottomNav={true}
      showHeader={true}
      showBack={true}
      title="룩북"
    >
      {renderContent()}
    </PageLayout>
  );
};

export default MyOutfitListPage;
