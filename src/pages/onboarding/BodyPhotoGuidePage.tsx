import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mannequin from '@/assets/images/body/mannequin.png';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoFrameCard from '@/features/onboarding/components/PhotoFrameCard';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'fix' | 'bright';

const BodyPhotoGuidePage = () => {
  const navigate = useNavigate();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const [phase, setPhase] = useState<Phase>('fix');

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <OnboardingLayout progress={0.8} onSkip={handleSkip}>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
        <h2 className="text-center text-lg font-semibold leading-relaxed">
          {phase === 'fix' ? (
            <>
              카메라를 고정하고
              <br />
              전신을 촬영해주세요
            </>
          ) : (
            '밝은 배경에서 촬영해주세요'
          )}
        </h2>

        <div className="mt-8 flex flex-1 items-start justify-center">
          <PhotoFrameCard imageSrc={mannequin} variant="plain" alt="전신 촬영 가이드" />
        </div>

        {phase === 'fix' ? (
          <Button label="다음" shape="pill" fullWidth onClick={() => setPhase('bright')} />
        ) : (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/onboarding/body/upload')}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-100 text-sm font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5-8 8" />
              </svg>
              사진 업로드
            </button>
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
        )}
      </div>
    </OnboardingLayout>
  );
};

export default BodyPhotoGuidePage;
