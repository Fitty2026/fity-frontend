import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { BODY_TYPES } from '@/features/onboarding/bodyConstants';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { toBodyResultView } from '@/features/onboarding/bodyProfileView';
import useSaveBodyProfile from '@/features/onboarding/hooks/useSaveBodyProfile';
import { ApiError, getErrorMessage } from '@/lib/apiError';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'measurements' | 'final';

const BodyResultPage = () => {
  const navigate = useNavigate();
  const nickname = useAuthStore((s) => s.user?.name) ?? '회원';
  const result = useOnboardingStore((s) => s.analysisResult);
  const bodyPhotoUrls = useOnboardingStore((s) => s.bodyPhotoUrls);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const { mutate: saveBodyProfile, isPending, error } = useSaveBodyProfile();
  const [phase, setPhase] = useState<Phase>('measurements');

  // 분석 결과 없이 직접 진입하면 체형 단계 처음으로
  useEffect(() => {
    if (!result) navigate('/onboarding/body', { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const view = toBodyResultView(result);
  // 3택 선택 플로우가 없어져 분석 결과 유형(예: STANDARD_STRAIGHT)에서 일러스트를 고른다
  const analyzedType = result.bodyTypeResult.bodyType.toLowerCase();
  const typeIllustration =
    BODY_TYPES.find((option) => analyzedType.includes(option.type))?.imageSrc ??
    BODY_TYPES[0].imageSrc;

  const handleRetry = () => navigate('/onboarding/body/photo');

  const finishOnboarding = () => {
    completeOnboarding();
    // 체형 분석 완료 → 디지털 옷장 온보딩으로 이어짐
    navigate('/closet/intro', { replace: true });
  };

  const handleFinish = () => {
    // PROFILE-03 저장 성공 시 온보딩 완료. 이미 등록된 경우(409)도 완료로 진행
    saveBodyProfile(
      {
        analysisId: result.analysisId,
        measurements: result.measurements,
        bodyTypeResult: result.bodyTypeResult,
      },
      {
        onSuccess: finishOnboarding,
        onError: (err) => {
          // 명세서 표기가 PROFILE409_1/PROFILE409_01로 혼용돼 접두사로 매칭한다
          if (err instanceof ApiError && err.code.startsWith('PROFILE409')) finishOnboarding();
        },
      },
    );
  };

  return (
    <OnboardingLayout progress={0.57}>
      {phase === 'measurements' ? (
        <div className="flex flex-1 flex-col px-4 pb-8 pt-10">
          <h2 className="text-center text-lg font-semibold">분석이 완료되었어요</h2>

          {/* 사진 + 좌우 치수 라벨 */}
          <div className="mt-8 flex flex-1 items-center justify-center gap-3">
            <div className="flex flex-col gap-6">
              {view.measurements
                .filter((m) => m.side === 'left')
                .map((m) => (
                  <div key={m.label} className="text-right">
                    <p className="text-xs text-neutral-500">{m.label}</p>
                    <p className="text-xs text-neutral-400">{m.value}</p>
                  </div>
                ))}
            </div>

            <div className="h-[360px] w-[170px] shrink-0 overflow-hidden rounded-3xl bg-neutral-200">
              {bodyPhotoUrls[0] && (
                <img
                  src={bodyPhotoUrls[0]}
                  alt="분석한 체형 사진"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-10">
              {view.measurements
                .filter((m) => m.side === 'right')
                .map((m) => (
                  <div key={m.label}>
                    <p className="text-xs text-neutral-500">{m.label}</p>
                    <p className="text-xs text-neutral-400">{m.value}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 px-2">
            <button
              type="button"
              onClick={handleRetry}
              className="h-12 w-full rounded-full bg-neutral-100 text-sm font-medium"
            >
              다시 분석하기
            </button>
            <Button label="다음" shape="pill" fullWidth onClick={() => setPhase('final')} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
          <h2 className="text-center text-lg font-semibold leading-relaxed">
            {nickname}님의 체형은
            <br />
            {view.typeName} 체형이에요
          </h2>

          {/* 유형 카드 */}
          <div className="mt-6 flex gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <img src={typeIllustration} alt="체형 일러스트" className="w-full object-contain" />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-xs text-neutral-400">체형 유형</p>
              <p className="text-base font-bold">{view.typeName}</p>
              <p className="text-xs leading-relaxed text-neutral-500">{view.typeDescription}</p>
              <p className="mt-2 text-[11px] text-neutral-400">
                이 유형과 같은 체형의 연예인
                <br />
                <span className="text-neutral-500">{view.celebrities.join(', ')}</span>
              </p>
            </div>
          </div>

          {/* 체형 특징 */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold">체형 특징</h3>
            <div className="mt-3 flex flex-col gap-3">
              {view.traits.map((trait) => (
                <div key={trait.label} className="flex items-center gap-3 text-xs">
                  <span className="w-16 shrink-0 text-neutral-500">{trait.label}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-violet-400"
                      style={{ width: `${trait.percent}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-neutral-600">{trait.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <button
              type="button"
              onClick={handleRetry}
              className="h-12 w-full rounded-full bg-neutral-100 text-sm font-medium"
            >
              다시 분석하기
            </button>
            {error && (
              <p className="text-center text-sm text-red-500">{getErrorMessage(error)}</p>
            )}
            <Button
              label={isPending ? '저장 중...' : '분석 결과 저장하고 시작하기'}
              shape="pill"
              fullWidth
              disabled={isPending}
              onClick={handleFinish}
            />
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default BodyResultPage;
