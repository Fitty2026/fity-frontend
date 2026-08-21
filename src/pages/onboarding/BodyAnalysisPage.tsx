import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnalyzeFailView from '@/features/onboarding/components/AnalyzeFailView';
import HangerIcon from '@/features/onboarding/components/HangerIcon';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { startBodyAnalysis } from '@/features/onboarding/bodyAnalysis';
import useOnboardingStore from '@/store/onboardingStore';

/** 분석 완료 연출을 보여준 뒤 결과로 넘어가기까지의 시간 */
const DONE_DISPLAY_MS = 1500;

/**
 * 옷걸이 분석 화면 — 분석은 촬영/업로드 확정 시점에 이미 시작되어 있고(startBodyAnalysis),
 * 여기서는 스토어의 analysisStatus를 구독해 로딩 연출·완료 전환만 담당한다.
 * (실패는 완료 화면에서 바로 에러로 전환되지만, 이 화면에 머무는 중 실패해도 같은 에러를 보여준다)
 */
const BodyAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 촬영/업로드 어느 분기에서 왔는지 — 실패 시 되돌아갈 화면과 문구를 가른다
  const from = (location.state as { from?: 'camera' | 'upload' } | null)?.from ?? 'upload';
  const bodyPhotoUrls = useOnboardingStore((s) => s.bodyPhotoUrls);
  const analysisStatus = useOnboardingStore((s) => s.analysisStatus);
  const setAnalysisStatus = useOnboardingStore((s) => s.setAnalysisStatus);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 분석 완료 → 옷걸이 연출을 잠깐 보여준 뒤 결과로
    if (analysisStatus === 'success') {
      const doneTimer = setTimeout(() => setDone(true), DONE_DISPLAY_MS);
      const navTimer = setTimeout(
        () => navigate('/onboarding/body/result', { replace: true }),
        DONE_DISPLAY_MS * 2,
      );
      return () => {
        clearTimeout(doneTimer);
        clearTimeout(navTimer);
      };
    }

    // 직접 진입 폴백 — 아직 분석 전이면 여기서 시작, 사진이 없으면 업로드부터
    if (analysisStatus === 'idle') {
      const photos = bodyPhotoUrls.filter(Boolean);
      if (photos.length < 3) navigate('/onboarding/body/upload', { replace: true });
      else void startBodyAnalysis(photos);
    }
  }, [analysisStatus, bodyPhotoUrls, navigate]);

  // 분석 실패 — 올린 사진을 빨간 테두리로 보여주고 재촬영/재업로드 유도
  if (analysisStatus === 'error') {
    return (
      <OnboardingLayout progress={0.57}>
        <AnalyzeFailView
          photos={bodyPhotoUrls.filter(Boolean)}
          mode={from}
          onRetry={() => {
            setAnalysisStatus('idle');
            navigate(from === 'camera' ? '/onboarding/body/camera' : '/onboarding/body/upload', {
              replace: true,
            });
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

export default BodyAnalysisPage;
