import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';

/**
 * 옷 사진 수정 — 시안 대기(디자이너). 지금은 라우트만 잡아둔 빈 화면.
 * 진입: 사진 확인 화면(/closet/register/tags)의 "수정하기".
 */
const ClosetPhotoEditPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showBack onBack={() => navigate(-1)} />
      </div>
    </PageLayout>
  );
};

export default ClosetPhotoEditPage;
