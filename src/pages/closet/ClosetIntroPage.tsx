import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import BlobIntro from '@/features/onboarding/components/BlobIntro';

/** 온보딩 인트로 3화면과 같은 노출 시간 (임시: 추후 백엔드 준비 완료 응답으로 대체) */
const INTRO_DURATION_MS = 2500;

/**
 * 개인화 온보딩 → 디지털 옷장 온보딩 진입 전환 화면.
 * "거의 다 왔어요" + 유리질 블롭. 온보딩 인트로 세 화면과 같은 블롭을 쓴다
 * (동의 sm 108 / 취향 md 200 / 체형 lg 250 → 마지막인 여기는 xl 300).
 */
const ClosetIntroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/closet/register'), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* 진행률 = 채움 241 / track 375 (Figma) */}
        <OnboardingTopBar progress={241 / 375} />
        <BlobIntro message="거의 다 왔어요" size="xl" />
      </div>
    </PageLayout>
  );
};

export default ClosetIntroPage;
