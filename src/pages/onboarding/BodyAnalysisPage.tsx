import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeBody } from '@/features/onboarding/api/bodyAnalysisApi';
import HangerIcon from '@/features/onboarding/components/HangerIcon';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import useOnboardingStore from '@/store/onboardingStore';

/** 분석 완료 화면을 보여준 뒤 결과로 넘어가기까지의 시간 */
const DONE_DISPLAY_MS = 1500;

const BodyAnalysisPage = () => {
  const navigate = useNavigate();
  const setAnalysisResult = useOnboardingStore((s) => s.setAnalysisResult);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    analyzeBody().then((result) => {
      if (cancelled) return;
      setAnalysisResult(result);
      setDone(true);
      doneTimer = setTimeout(
        () => navigate('/onboarding/body/result', { replace: true }),
        DONE_DISPLAY_MS,
      );
    });

    return () => {
      cancelled = true;
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [navigate, setAnalysisResult]);

  return (
    <OnboardingLayout progress={0.9}>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-24">
        <p className="text-base font-medium">
          {done ? '체형이 분석되었어요' : 'AI가 체형을 분석하고 있어요'}
        </p>
        <HangerIcon state={done ? 'done' : 'loading'} />
      </div>
    </OnboardingLayout>
  );
};

export default BodyAnalysisPage;
