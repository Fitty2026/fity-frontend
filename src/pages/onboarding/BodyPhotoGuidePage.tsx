import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mannequinBack from '@/assets/images/body/back.png';
import mannequinFront from '@/assets/images/body/front.png';
import mannequinSide from '@/assets/images/body/side.png';
import mannequin from '@/assets/images/body/mannequin.png';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoCarousel from '@/features/onboarding/components/PhotoCarousel';
import PhotoFrameCard from '@/features/onboarding/components/PhotoFrameCard';
import useOnboardingStore from '@/store/onboardingStore';

/** 촬영 가이드 3스텝 — 눈높이 고정 → 복장/배경 → 정면·측면·후면 안내 */
type Step = 'fix' | 'bright' | 'rotate';

const BodyPhotoGuidePage = () => {
  const navigate = useNavigate();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const [step, setStep] = useState<Step>('fix');

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <OnboardingLayout progress={0.57} onSkip={handleSkip}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        {step !== 'rotate' ? (
          <>
            <h2 className="px-6 text-center text-lg font-semibold leading-relaxed">
              {step === 'fix' ? (
                <>
                  카메라를 눈높이에 고정하고
                  <br />
                  전신을 촬영해주세요
                </>
              ) : (
                <>
                  몸이 잘 드러나는 옷을 입고
                  <br />
                  밝은 배경에서 촬영해주세요
                </>
              )}
            </h2>
            <div className="mt-6 flex justify-center px-6">
              <PhotoFrameCard imageSrc={mannequin} variant="plain" alt="전신 촬영 가이드" />
            </div>
            <div className="mt-auto px-6 pt-6">
              <Button
                label="다음"
                shape="pill"
                fullWidth
                onClick={() => setStep(step === 'fix' ? 'bright' : 'rotate')}
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="px-6 text-center text-lg font-semibold">정면, 측면, 후면을 촬영해주세요</h2>
            <div className="mt-6 overflow-hidden">
              <PhotoCarousel
                imageSrcs={[mannequinSide, mannequinFront, mannequinBack]}
                initialSlide={1}
              />
            </div>
            <p className="mt-3 flex items-center justify-center gap-1 px-6 text-center text-xs text-neutral-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              사진은 분석 후 즉시 삭제되며, 안전하게 보호돼요
            </p>
            <div className="mt-auto px-6 pt-6">
              <button
                type="button"
                onClick={() => navigate('/onboarding/body/camera')}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                촬영하기
              </button>
            </div>
          </>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default BodyPhotoGuidePage;
