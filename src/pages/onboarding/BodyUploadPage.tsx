import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import mannequinBack from '@/assets/images/body/back.png';
import mannequinFront from '@/assets/images/body/front.png';
import mannequinSide from '@/assets/images/body/side.png';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoFrameCard from '@/features/onboarding/components/PhotoFrameCard';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'select' | 'done' | 'confirm';

const MAX_PHOTOS = 3;

/** 정면/측면/후면 안내용 캐러셀 */
const PhotoCarousel = ({
  imageSrcs,
  initialSlide = 0,
}: {
  imageSrcs: string[];
  initialSlide?: number;
}) => (
  <Swiper
    className="h-full w-full"
    slidesPerView="auto"
    centeredSlides
    spaceBetween={16}
    initialSlide={initialSlide}
  >
    {imageSrcs.map((src, i) => (
      <SwiperSlide key={`${src}-${i}`} className="!w-[62%]">
        <div className="mx-auto flex h-full max-h-[380px] items-center justify-center overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6">
          <img src={src} alt={`체형 사진 ${i + 1}`} className="h-full w-full object-contain" />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

const BodyUploadPage = () => {
  const navigate = useNavigate();
  const bodyPhotoUrls = useOnboardingStore((s) => s.bodyPhotoUrls);
  const setBodyPhotoUrls = useOnboardingStore((s) => s.setBodyPhotoUrls);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const [phase, setPhase] = useState<Phase>('select');

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS);
    if (files.length === 0) return;
    setBodyPhotoUrls(files.map((file) => URL.createObjectURL(file)));
    setPhase('done');
  };

  return (
    <OnboardingLayout progress={0.8} onSkip={phase === 'done' ? undefined : handleSkip}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        <h2 className="px-6 text-center text-lg font-semibold leading-relaxed">
          {phase === 'select' && (
            <>
              체형이 잘 보이는
              <br />
              정면, 측면, 후면 사진을 업로드 해주세요
            </>
          )}
          {phase === 'done' && '사진이 업로드되었어요'}
          {phase === 'confirm' && '업로드한 사진이 다음과 같나요?'}
        </h2>

        <div className="mt-8 flex flex-1 items-center overflow-hidden">
          {phase === 'select' && (
            // 측면·정면·후면 순서, 처음에 정면이 중앙에 오도록
            <PhotoCarousel imageSrcs={[mannequinSide, mannequinFront, mannequinBack]} initialSlide={1} />
          )}
          {phase === 'done' && (
            <div className="flex w-full justify-center">
              <PhotoFrameCard imageSrc={bodyPhotoUrls[0]} alt="업로드한 체형 사진" fit="cover" showCheck />
            </div>
          )}
          {phase === 'confirm' && <PhotoCarousel imageSrcs={bodyPhotoUrls} />}
        </div>

        <div className="mt-6 px-6">
          {phase === 'select' && (
            <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5-8 8" />
              </svg>
              사진 업로드
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          )}
          {phase === 'done' && (
            <Button label="다음" shape="pill" fullWidth onClick={() => setPhase('confirm')} />
          )}
          {phase === 'confirm' && (
            <Button
              label="확인"
              shape="pill"
              fullWidth
              onClick={() => navigate('/onboarding/body/analysis')}
            />
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default BodyUploadPage;
