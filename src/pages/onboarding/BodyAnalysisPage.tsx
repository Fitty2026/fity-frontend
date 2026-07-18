import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import useOnboardingStore from '@/store/onboardingStore';

const ANALYSIS_DURATION_MS = 2500;

const BodyAnalysisPage = () => {
  const navigate = useNavigate();
  const bodyImageUrl = useOnboardingStore((s) => s.bodyImageUrl);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // 마운트 직후 진행 바 width 전환 트리거 (0% → 100%)
    const raf = requestAnimationFrame(() => setStarted(true));
    const timer = setTimeout(
      () => navigate('/onboarding/avatar', { replace: true }),
      ANALYSIS_DURATION_MS,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col items-center px-6 py-10">
        <div className="aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-2xl bg-neutral-200">
          {bodyImageUrl && (
            <img
              src={bodyImageUrl}
              alt=""
              className="h-full w-full object-cover opacity-60 blur-md"
            />
          )}
        </div>
        <h1 className="mt-8 text-xl font-bold">체형을 분석하고 있어요</h1>
        <p className="mt-2 text-sm text-neutral-500">비율을 계산하는 중이에요</p>
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-black transition-[width] duration-[2500ms] ease-linear"
            style={{ width: started ? '100%' : '0%' }}
          />
        </div>
        <p className="mt-8 text-sm text-neutral-400">
          잠시만 기다려주세요, 곧 결과를 보여드릴게요
        </p>
      </div>
    </PageLayout>
  );
};

export default BodyAnalysisPage;
