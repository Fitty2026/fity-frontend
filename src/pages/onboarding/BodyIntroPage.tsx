import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';

const INTRO_DURATION_MS = 2500;

/**
 * 체형 온보딩 진입 인트로 — 블롭 안내 후 곧바로 촬영 가이드로 이동.
 * (체형 3택 선택 플로우는 제거됨 — AI 분석 결과의 bodyType을 그대로 사용한다)
 */
const BodyIntroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(
      () => navigate('/onboarding/body/method', { replace: true }),
      INTRO_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <OnboardingLayout progress={0.33}>
      <BlobIntro message="이번엔 체형을 알아볼게요" size="lg" />
    </OnboardingLayout>
  );
};

export default BodyIntroPage;
