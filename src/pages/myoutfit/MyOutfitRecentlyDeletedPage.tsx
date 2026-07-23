import PageLayout from '@/components/layout/PageeLayout';
import MyOutfitCard from '@/features/myoutfit/components/MyOutfitCard';
import { mockOutfits } from '@/mocks/data/outfit';

const MyOutfitRecentlyDeletedPage = () => {
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
      <div className="mx-[24px] mt-[16px] grid grid-cols-2 gap-x-[15px] gap-y-[32px] pb-[32px]">
        {mockOutfits.map((outfit) => (
          <MyOutfitCard key={outfit.id} outfit={outfit} deletionDaysRemaining={30} />
        ))}
      </div>
    </PageLayout>
  );
};

export default MyOutfitRecentlyDeletedPage;
