import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button';
import { BODY_TYPES } from '@/features/onboarding/bodyConstants';
import { toBodyResultView } from '@/features/onboarding/bodyProfileView';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import useSaveBodyProfile from '@/features/onboarding/hooks/useSaveBodyProfile';
import { getErrorMessage } from '@/lib/apiError';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'measurements' | 'final';

const BodyResultEditPage = () => {
  const navigate = useNavigate();
  const result = useOnboardingStore((state) => state.analysisResult);
  const bodyPhotoUrls = useOnboardingStore((state) => state.bodyPhotoUrls);
  const { mutate: saveBodyProfile, isPending, error } = useSaveBodyProfile();
  const [phase, setPhase] = useState<Phase>('measurements');

  useEffect(() => {
    if (!result) navigate('/mypage/profile/body/photos', { replace: true });
  }, [navigate, result]);

  if (!result) return null;

  const view = toBodyResultView(result);
  const analyzedType = result.bodyTypeResult.bodyType.toLowerCase();
  const typeIllustration =
    BODY_TYPES.find((option) => analyzedType.includes(option.type))?.imageSrc ??
    BODY_TYPES[0].imageSrc;

  const handleRetry = () => navigate('/mypage/profile/body/photos');
  const handleSave = () => {
    saveBodyProfile(
      {
        analysisId: result.analysisId,
        measurements: result.measurements,
        bodyTypeResult: result.bodyTypeResult,
      },
      {
        onSuccess: () => navigate('/mypage/profile', { replace: true }),
      },
    );
  };

  return (
    <OnboardingLayout progress={0.57}>
      {phase === 'measurements' ? (
        <div className="flex flex-1 flex-col px-4 pb-8 pt-10">
          <h2 className="text-center text-lg font-semibold">분석이 완료되었어요</h2>

          <div className="mt-8 flex flex-1 items-center justify-center gap-3">
            <div className="flex flex-col gap-6">
              {view.measurements
                .filter((measurement) => measurement.side === 'left')
                .map((measurement) => (
                  <div key={measurement.label} className="text-right">
                    <p className="text-xs text-neutral-500">{measurement.label}</p>
                    <p className="text-xs text-neutral-400">{measurement.value}</p>
                  </div>
                ))}
            </div>

            <div className="h-[360px] w-[170px] shrink-0 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
              {bodyPhotoUrls[0] ? (
                <img
                  src={bodyPhotoUrls[0]}
                  alt="분석한 체형 사진"
                  className="h-full w-full object-contain"
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-10">
              {view.measurements
                .filter((measurement) => measurement.side === 'right')
                .map((measurement) => (
                  <div key={measurement.label}>
                    <p className="text-xs text-neutral-500">{measurement.label}</p>
                    <p className="text-xs text-neutral-400">{measurement.value}</p>
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
            분석한 체형은
            <br />
            {view.typeName} 체형이에요
          </h2>

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
            {error ? (
              <p className="text-center text-sm text-red-500">{getErrorMessage(error)}</p>
            ) : null}
            <Button
              label={isPending ? '저장 중...' : '체형 정보 저장하기'}
              shape="pill"
              fullWidth
              disabled={isPending}
              onClick={handleSave}
            />
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default BodyResultEditPage;
