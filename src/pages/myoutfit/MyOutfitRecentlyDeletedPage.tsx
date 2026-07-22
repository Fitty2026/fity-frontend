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
      <div className="mx-[24px] mt-[24px] grid grid-cols-2 gap-[15px]">
        {mockOutfits.map((outfit) => (
          <MyOutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>
    </PageLayout>
  );
};

export default MyOutfitRecentlyDeletedPage;
