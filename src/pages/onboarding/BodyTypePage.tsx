import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { BODY_TYPES, type BodyTypeOption } from '@/features/onboarding/bodyConstants';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2500;

const BodyTypePage = () => {
  const navigate = useNavigate();
  const setBodyType = useOnboardingStore((s) => s.setBodyType);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const [showIntro, setShowIntro] = useState(true);
  const [selected, setSelected] = useState<BodyTypeOption | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  const handleSelect = (option: BodyTypeOption) => {
    setSelected(option);
    setShowDescription(true);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setBodyType(selected.type);
    navigate('/onboarding/body/photo');
  };

  return (
    <OnboardingLayout progress={0.7} onSkip={showIntro ? undefined : handleSkip}>
      {showIntro ? (
        <BlobIntro message="이번엔 체형을 알아볼게요" size="lg" />
      ) : (
        <div className="relative flex flex-1 flex-col px-6 pb-8 pt-10">
          <h2 className="text-center text-lg font-semibold">체형을 선택해주세요</h2>

          {/* 타입 3택 */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {BODY_TYPES.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex flex-col items-center gap-2 rounded-xl p-2 transition-colors ${
                  selected?.type === option.type ? 'bg-violet-50' : ''
                }`}
              >
                <img src={option.imageSrc} alt={option.label} className="w-full object-contain" />
                <span className="text-xs text-neutral-600">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button
              label="확인"
              shape="pill"
              fullWidth
              disabled={!selected}
              onClick={handleConfirm}
            />
          </div>

          {/* 선택 타입 설명 오버레이 */}
          {showDescription && selected && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 px-6"
              onClick={() => setShowDescription(false)}
            >
              <div
                className="w-full rounded-2xl bg-neutral-50 px-6 py-8 text-center shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-base font-semibold">{selected.label}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {selected.description}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </OnboardingLayout>
  );
};

export default BodyTypePage;
