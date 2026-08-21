import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AnalyzeFailView from '@/features/onboarding/components/AnalyzeFailView';
import HangerIcon from '@/features/onboarding/components/HangerIcon';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { startBodyAnalysis } from '@/features/onboarding/bodyAnalysis';
import useOnboardingStore from '@/store/onboardingStore';

const DONE_DISPLAY_MS = 1500;

const BodyAnalysisEditPage = () => {
  const navigate = useNavigate();
  const bodyPhotoUrls = useOnboardingStore((state) => state.bodyPhotoUrls);
  const analysisStatus = useOnboardingStore((state) => state.analysisStatus);
  const setAnalysisStatus = useOnboardingStore((state) => state.setAnalysisStatus);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (analysisStatus === 'success') {
      const doneTimer = setTimeout(() => setDone(true), DONE_DISPLAY_MS);
      const navigationTimer = setTimeout(
        () => navigate('/mypage/profile/body/result', { replace: true }),
        DONE_DISPLAY_MS * 2,
      );

      return () => {
        clearTimeout(doneTimer);
        clearTimeout(navigationTimer);
      };
    }

    if (analysisStatus === 'idle') {
      const photos = bodyPhotoUrls.filter(Boolean);
      if (photos.length < 3) {
        navigate('/mypage/profile/body/photos', { replace: true });
      } else {
        void startBodyAnalysis(photos);
      }
    }
  }, [analysisStatus, bodyPhotoUrls, navigate]);

  if (analysisStatus === 'error') {
    return (
      <OnboardingLayout progress={0.57}>
        <AnalyzeFailView
          photos={bodyPhotoUrls.filter(Boolean)}
          mode="upload"
          onRetry={() => {
            setAnalysisStatus('idle');
            navigate('/mypage/profile/body/photos', { replace: true });
          }}
        />
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout progress={0.57}>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-24">
        <p className="text-base font-medium">
          {done ? '체형이 분석되었어요' : 'AI가 체형을 분석하고 있어요'}
        </p>
        <HangerIcon state={done ? 'done' : 'loading'} />
      </div>
    </OnboardingLayout>
  );
};

export default BodyAnalysisEditPage;
