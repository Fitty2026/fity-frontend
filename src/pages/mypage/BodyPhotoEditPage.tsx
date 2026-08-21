import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import mannequinBack from '@/assets/images/body/back.png';
import mannequinFront from '@/assets/images/body/front.png';
import mannequinSide from '@/assets/images/body/side.png';
import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import CameraCapture from '@/features/onboarding/components/CameraCapture';
import PhotoAddSheet from '@/features/onboarding/components/PhotoAddSheet';
import PhotoSlotGrid from '@/features/onboarding/components/PhotoSlotGrid';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'select' | 'confirm';
type SheetTarget = 'add' | number | null;

const MAX_PHOTOS = 3;

const shuffle = (photos: string[]) => {
  const result = [...photos];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
};

const PhotoCarousel = ({ photos }: { photos: string[] }) => (
  <Swiper className="h-full w-full" slidesPerView="auto" centeredSlides spaceBetween={16}>
    {photos.map((photo, index) => (
      <SwiperSlide key={`${photo}-${index}`} className="!w-[188px]">
        <div className="mx-auto flex aspect-[47/90] w-full items-center justify-center overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5">
          <img
            src={photo}
            alt={`체형 사진 ${index + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

const BodyPhotoEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bodyPhotoUrls = useOnboardingStore((state) => state.bodyPhotoUrls);
  const setBodyPhotoUrls = useOnboardingStore((state) => state.setBodyPhotoUrls);
  const addBodyPhotoUrl = useOnboardingStore((state) => state.addBodyPhotoUrl);
  const replaceBodyPhotoUrl = useOnboardingStore((state) => state.replaceBodyPhotoUrl);
  const [phase, setPhase] = useState<Phase>('select');
  const [sheetTarget, setSheetTarget] = useState<SheetTarget>(null);
  const [cameraOpen, setCameraOpen] = useState(
    () => (location.state as { openCamera?: boolean } | null)?.openCamera === true,
  );

  const count = bodyPhotoUrls.length;
  const hasPhotos = count > 0;
  const isReady = count === MAX_PHOTOS;
  const shuffledPhotos = useMemo(() => shuffle(bodyPhotoUrls), [bodyPhotoUrls]);

  const handleMultipleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_PHOTOS);
    event.target.value = '';
    if (files.length === 0) return;
    setBodyPhotoUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const applyPhoto = (url: string) => {
    if (typeof sheetTarget === 'number') replaceBodyPhotoUrl(sheetTarget, url);
    else addBodyPhotoUrl(url);
  };

  const closeCamera = () => {
    setCameraOpen(false);
    setSheetTarget(null);
  };

  const handleCapture = (url: string) => {
    applyPhoto(url);
    closeCamera();
  };

  return (
    <MyPageScaffold
      title="체형 수정"
      contentClassName="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      footer={
        phase === 'select' && hasPhotos ? (
          <MyPageButton disabled={!isReady} onClick={() => setPhase('confirm')}>
            다음
          </MyPageButton>
        ) : phase === 'confirm' ? (
          <MyPageButton onClick={() => navigate('/mypage/profile/body', { replace: true })}>
            선택 완료
          </MyPageButton>
        ) : undefined
      }
    >
      <div className="flex min-h-full flex-col px-6 pb-8 pt-10">
        {phase === 'select' && !hasPhotos ? (
          <>
            <h2 className="text-center text-lg font-semibold leading-relaxed">
              체형이 잘 보이는
              <br />
              정면, 측면, 후면 사진을 업로드 해주세요
            </h2>
            <div className="mt-8 flex min-h-[360px] flex-1 items-center overflow-hidden -mx-6">
              <PhotoCarousel photos={[mannequinSide, mannequinFront, mannequinBack]} />
            </div>
            <p className="mt-4 text-center text-xs text-neutral-400">
              사진은 분석 후 즉시 삭제되며, 안전하게 보호돼요
            </p>
            <label className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-black text-sm font-medium text-white">
              사진 업로드
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleMultipleFiles}
              />
            </label>
          </>
        ) : null}

        {phase === 'select' && hasPhotos ? (
          <>
            <h2 className="text-center text-lg font-semibold">총 3장의 사진이 필요해요</h2>
            <p className="mt-1 text-center text-sm text-neutral-400">
              3장을 모두 등록해야 다음으로 넘어갈 수 있어요
            </p>
            <p className="mt-4 text-center text-base font-semibold text-violet-500">
              {count}/{MAX_PHOTOS}
            </p>
            <div className="mt-8">
              <PhotoSlotGrid
                photos={bodyPhotoUrls}
                max={MAX_PHOTOS}
                onAdd={() => setSheetTarget('add')}
                onReplace={(index) => setSheetTarget(index)}
              />
            </div>
            {!isReady ? (
              <p className="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-600">
                아직 {MAX_PHOTOS - count}장이 부족해요
              </p>
            ) : null}
          </>
        ) : null}

        {phase === 'confirm' ? (
          <>
            <h2 className="text-center text-lg font-semibold">업로드한 사진이 다음과 같나요?</h2>
            <div className="mt-8 flex min-h-[380px] flex-1 items-center overflow-hidden -mx-6">
              <PhotoCarousel photos={shuffledPhotos} />
            </div>
          </>
        ) : null}
      </div>

      <PhotoAddSheet
        isOpen={sheetTarget !== null && !cameraOpen}
        onClose={() => setSheetTarget(null)}
        onSelect={applyPhoto}
        onCamera={() => setCameraOpen(true)}
      />
      {cameraOpen ? <CameraCapture onClose={closeCamera} onCapture={handleCapture} /> : null}
    </MyPageScaffold>
  );
};

export default BodyPhotoEditPage;
