import { useNavigate } from 'react-router-dom';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import useOnboardingStore from '@/store/onboardingStore';

const UploadIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutral-800"
    aria-hidden
  >
    <path d="M12 15V4" />
    <path d="M8 8l4-4 4 4" />
    <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

const AlbumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9" r="1.5" />
    <path d="M21 16l-5-5-9 9" />
  </svg>
);

/** 체형 이미지 업로드 방식 분기 — 카메라 촬영 / 앨범 선택 */
const BodyMethodPage = () => {
  const navigate = useNavigate();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <OnboardingLayout progress={0.33} onSkip={handleSkip}>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-5 pb-48">
          <UploadIcon />
          <p className="text-center text-lg font-semibold leading-relaxed">
            체형 이미지를
            <br />
            업로드할 방식을 선택해주세요
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/onboarding/body/photo')}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm"
          >
            <CameraIcon />
            카메라로 촬영
          </button>
          <button
            type="button"
            onClick={() => navigate('/onboarding/body/upload')}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm"
          >
            <AlbumIcon />
            앨범에서 선택
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default BodyMethodPage;
