import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar, TransitionBlobScreen } from '@/features/closet/components';
import closetIntroBlob from '@/assets/images/closet-intro-blob.png';

/**
 * 개인화 온보딩 → 디지털 옷장 온보딩 진입 전환 화면.
 * "거의 다 왔어요" + 무지개빛 blob. 2초 후 옷장 등록 방식 선택으로 자동 이동.
 * (임시: 백엔드 연결 전까지 setTimeout, 이후 준비 완료 응답으로 대체)
 */
const ClosetIntroPage = () => {
  const navigate = useNavigate();

  // 2초 후 옷장 등록 방식 선택으로 자동 이동 (임시: 추후 백엔드 준비 완료 응답으로 대체)
  useEffect(() => {
    const timer = setTimeout(() => navigate('/closet/register'), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* 진행률 = 채움 52 / track 375 (Figma) */}
        <OnboardingTopBar progress={52 / 375} />
        <TransitionBlobScreen message="거의 다 왔어요" image={closetIntroBlob} />
      </div>
    </PageLayout>
  );
};

export default ClosetIntroPage;
