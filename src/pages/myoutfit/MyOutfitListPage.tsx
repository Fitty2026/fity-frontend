import PageLayout from '@/components/layout/PageeLayout';
import MyOutfitCard from '@/features/myoutfit/components/MyOutfitCard';

import { mockOutfits } from '@/mocks/data/outfit';
import { useNavigate } from 'react-router-dom';

const MyOutfitListPage = () => {
 
  const navigate = useNavigate()

  return (
    <PageLayout
      showBottomNav={true}
      showHeader={true}
      showBack={true}
      title="룩북"
     
    >
      <div className="mt-[24px] mx-[24px] grid grid-cols-2 gap-[15px]">
            {mockOutfits.map((outfit) => (
              <MyOutfitCard
                key={outfit.id}
                outfit={outfit}
              />
            ))}
          </div>
    </PageLayout>
  );
};
export default MyOutfitListPage;
