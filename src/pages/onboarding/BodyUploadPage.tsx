import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import mannequinBack from '@/assets/images/body/back.png';
import mannequinFront from '@/assets/images/body/front.png';
import mannequinSide from '@/assets/images/body/side.png';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoAddSheet from '@/features/onboarding/components/PhotoAddSheet';
import PhotoSlotGrid from '@/features/onboarding/components/PhotoSlotGrid';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'select' | 'confirm' | 'done';
/** 바텀시트 대상: 'add'=새 슬롯 추가, number=해당 슬롯 교체, null=닫힘 */
type SheetTarget = 'add' | number | null;

const MAX_PHOTOS = 3;

/** Fisher-Yates 셔플 (원본 배열 불변) */
const shuffle = (arr: string[]) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

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
  const addBodyPhotoUrl = useOnboardingStore((s) => s.addBodyPhotoUrl);
  const replaceBodyPhotoUrl = useOnboardingStore((s) => s.replaceBodyPhotoUrl);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const [phase, setPhase] = useState<Phase>('select');
  const [sheetTarget, setSheetTarget] = useState<SheetTarget>(null);

  const count = bodyPhotoUrls.length;
  const hasPhotos = count > 0;
  const isReady = count === MAX_PHOTOS;
  const remaining = MAX_PHOTOS - count;

  // 확인 화면에 보여줄 랜덤 순서 (선택이 바뀔 때만 다시 섞음)
  const shuffledPhotos = useMemo(() => shuffle(bodyPhotoUrls), [bodyPhotoUrls]);

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  // 가이드 화면: 앨범 다중 선택으로 한 번에 채움 (전체 교체)
  const handleGuideSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS);
    if (files.length === 0) return;
    setBodyPhotoUrls(files.map((file) => URL.createObjectURL(file)));
    // 같은 파일을 다시 골라도 onChange가 발생하도록 초기화
    e.target.value = '';
  };

  // 바텀시트 선택: 새 슬롯 추가 또는 해당 슬롯 교체
  const handleSheetSelect = (url: string) => {
    if (typeof sheetTarget === 'number') replaceBodyPhotoUrl(sheetTarget, url);
    else addBodyPhotoUrl(url);
  };

  return (
    <OnboardingLayout progress={0.8} onSkip={phase === 'done' ? undefined : handleSkip}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        {/* 가이드 — 사진 0장 */}
        {phase === 'select' && !hasPhotos && (
          <>
            <h2 className="px-6 text-center text-lg font-semibold leading-relaxed">
              체형이 잘 보이는
              <br />
              정면, 측면, 후면 사진을 업로드 해주세요
            </h2>
            <div className="mt-8 flex flex-1 items-center overflow-hidden">
              <PhotoCarousel imageSrcs={[mannequinSide, mannequinFront, mannequinBack]} initialSlide={1} />
            </div>
            <p className="mt-4 px-6 text-center text-xs text-neutral-400">
              사진은 분석 후 즉시 삭제되며, 안전하게 보호돼요
            </p>
            <div className="mt-6 px-6">
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
                  onChange={handleGuideSelect}
                />
              </label>
            </div>
          </>
        )}

        {/* 슬롯 그리드 — 사진 1~3장 */}
        {phase === 'select' && hasPhotos && (
          <>
            <h2 className="px-6 text-center text-lg font-semibold">총 3장의 사진이 필요해요</h2>
            <p className="mt-1 px-6 text-center text-sm text-neutral-400">
              3장을 모두 등록해야 다음으로 넘어갈 수 있어요
            </p>
            <p className="mt-4 text-center text-base font-semibold text-violet-500">
              {count}/{MAX_PHOTOS}
            </p>

            <div className="mt-6 px-6">
              <PhotoSlotGrid
                photos={bodyPhotoUrls}
                max={MAX_PHOTOS}
                onAdd={() => setSheetTarget('add')}
                onReplace={(index) => setSheetTarget(index)}
              />
            </div>

            <div className="mt-auto flex flex-col gap-3 px-6 pt-8">
              {!isReady && (
                <div className="flex flex-col gap-0.5 rounded-xl bg-amber-50 px-4 py-3">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    아직 {remaining}장이 부족해요
                  </p>
                  <p className="pl-[22px] text-xs text-amber-500">
                    총 3장의 사진을 모두 등록해야 해요
                  </p>
                </div>
              )}
              <Button
                label="다음"
                shape="pill"
                fullWidth
                disabled={!isReady}
                onClick={() => setPhase('confirm')}
              />
            </div>
          </>
        )}

        {/* 확인 */}
        {phase === 'confirm' && (
          <>
            <h2 className="px-6 text-center text-lg font-semibold leading-relaxed">
              업로드한 사진이 다음과 같나요?
            </h2>
            <div className="mt-8 flex flex-1 items-center overflow-hidden">
              <PhotoCarousel imageSrcs={shuffledPhotos} />
            </div>
            <div className="mt-6 px-6">
              <Button label="확인" shape="pill" fullWidth onClick={() => setPhase('done')} />
            </div>
          </>
        )}

        {/* 완료 */}
        {phase === 'done' && (
          <>
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="text-base font-medium">사진이 업로드되었어요</p>
            </div>
            <div className="mt-6 px-6">
              <Button
                label="다음"
                shape="pill"
                fullWidth
                onClick={() => navigate('/onboarding/body/analysis')}
              />
            </div>
          </>
        )}
      </div>

      <PhotoAddSheet
        isOpen={sheetTarget !== null}
        onClose={() => setSheetTarget(null)}
        onSelect={handleSheetSelect}
      />
    </OnboardingLayout>
  );
};

export default BodyUploadPage;
