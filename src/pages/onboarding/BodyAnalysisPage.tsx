import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import HangerIcon from '@/features/onboarding/components/HangerIcon';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import useAnalyzeBody from '@/features/onboarding/hooks/useAnalyzeBody';
import { getErrorMessage } from '@/lib/apiError';
import useOnboardingStore from '@/store/onboardingStore';

/** 분석 완료 화면을 보여준 뒤 결과로 넘어가기까지의 시간 */
const DONE_DISPLAY_MS = 1500;

const BodyAnalysisPage = () => {
  const navigate = useNavigate();
  const bodyPhotoUrls = useOnboardingStore((s) => s.bodyPhotoUrls);
  const setAnalysisResult = useOnboardingStore((s) => s.setAnalysisResult);
  const { mutate: analyze, error } = useAnalyzeBody();
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 사진 3장이 없으면 업로드 화면으로 되돌림
    if (bodyPhotoUrls.length < 3) {
      navigate('/onboarding/body/upload', { replace: true });
      return;
    }

    let cancelled = false;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    // objectURL(blob:)을 실제 Blob으로 복원해 multipart 전송 (정면/측면/후면 순서 매핑)
    Promise.all(bodyPhotoUrls.slice(0, 3).map((url) => fetch(url).then((res) => res.blob())))
      .then(([front, side, back]) => {
        if (cancelled) return;
        analyze(
          { front, side, back },
          {
            onSuccess: (result) => {
              setAnalysisResult(result);
              setDone(true);
              doneTimer = setTimeout(
                () => navigate('/onboarding/body/result', { replace: true }),
                DONE_DISPLAY_MS,
              );
            },
          },
        );
      })
      .catch(() => {
        // 사진을 Blob으로 읽지 못한 경우 — 업로드부터 다시
        if (!cancelled) navigate('/onboarding/body/upload', { replace: true });
      });

    return () => {
      cancelled = true;
      if (doneTimer) clearTimeout(doneTimer);
    };
    // 진입 시 1회만 분석 요청
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 분석 실패 — 다시 촬영/업로드로 안내
  if (error) {
    return (
      <OnboardingLayout progress={0.9}>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 pb-24 text-center">
          <p className="text-sm text-neutral-500">{getErrorMessage(error)}</p>
          <Button
            label="다시 시도하기"
            shape="pill"
            fullWidth
            onClick={() => navigate('/onboarding/body/upload', { replace: true })}
          />
        </div>
      </OnboardingLayout>
    );
  }

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
