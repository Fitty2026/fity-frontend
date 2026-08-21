import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mannequinBack from '@/assets/images/body/back.png';
import mannequinFront from '@/assets/images/body/front.png';
import mannequinSide from '@/assets/images/body/side.png';
import Button from '@/components/ui/Button';
import CameraCapture from '@/features/onboarding/components/CameraCapture';
import CompleteView from '@/features/onboarding/components/CompleteView';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoAddSheet from '@/features/onboarding/components/PhotoAddSheet';
import PhotoCarousel from '@/features/onboarding/components/PhotoCarousel';
import PhotoSlotGrid from '@/features/onboarding/components/PhotoSlotGrid';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'select' | 'done';

const MAX_PHOTOS = 3;
const SLOT_LABELS = ['정면', '측면', '후면'];

const BodyUploadPage = () => {
  const navigate = useNavigate();
  const bodyPhotoUrls = useOnboardingStore((s) => s.bodyPhotoUrls);
  const setBodyPhotoUrls = useOnboardingStore((s) => s.setBodyPhotoUrls);
  const replaceBodyPhotoUrl = useOnboardingStore((s) => s.replaceBodyPhotoUrl);
  const removeBodyPhotoUrl = useOnboardingStore((s) => s.removeBodyPhotoUrl);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const [phase, setPhase] = useState<Phase>('select');
  /** 사진을 추가할 슬롯 index (null=바텀시트 닫힘) */
  const [sheetTarget, setSheetTarget] = useState<number | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // 슬롯 고정형(빈 슬롯 '') — 채워진 장수 기준으로 계산한다
  const count = bodyPhotoUrls.filter(Boolean).length;
  const hasPhotos = count > 0;
  const isReady = count === MAX_PHOTOS;
  /** 아직 비어있는 슬롯의 라벨들 */
  const missingLabels = SLOT_LABELS.filter((_, i) => !bodyPhotoUrls[i]);

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

  const closeAll = () => {
    setCameraOpen(false);
    setSheetTarget(null);
  };

  /** 시트/카메라에서 고른 사진을 대상 슬롯에 채운다 */
  const applyPhoto = (url: string) => {
    if (sheetTarget !== null) replaceBodyPhotoUrl(sheetTarget, url);
    closeAll();
  };

  return (
    <OnboardingLayout progress={0.57} onSkip={phase === 'done' ? undefined : handleSkip}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        {/* 가이드 — 사진 0장 */}
        {phase === 'select' && !hasPhotos && (
          <>
            <h2 className="break-keep px-6 text-center text-lg font-semibold leading-relaxed">
              체형이 잘 보이는
              <br />
              정면, 측면, 후면 사진을 업로드 해주세요
            </h2>
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
            <h2 className="px-6 text-center text-lg font-semibold leading-relaxed">
              정면, 측면, 후면
              <br />총 3장의 사진이 필요해요
            </h2>
            <p className="mt-1 px-6 text-center text-xs text-neutral-400">
              3장을 모두 등록해야 다음으로 넘어갈 수 있어요
            </p>
            <p className="mt-4 text-center text-base font-semibold">
              <span className="text-violet-500">{count}</span>
              <span className="text-neutral-400">/{MAX_PHOTOS}</span>
            </p>

            <div className="mt-6 px-6">
              <PhotoSlotGrid
                photos={bodyPhotoUrls}
                max={MAX_PHOTOS}
                labels={SLOT_LABELS}
                onAdd={setSheetTarget}
                onRemove={removeBodyPhotoUrl}
              />
            </div>

            <div className="mt-auto flex flex-col gap-3 px-6 pt-8">
              {!isReady && (
                <div className="flex flex-col gap-0.5 rounded-xl bg-amber-50 px-4 py-3">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <circle cx="12" cy="12" r="10" fill="#F5B22B" />
                      <path d="M12 7v6M12 16.5h.01" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    아직 <span className="text-violet-500">{missingLabels.join(', ')}</span> 사진이
                    부족해요
                  </p>
                  <p className="pl-[22px] text-xs text-amber-500">
                    정면, 측면, 후면 총 3장의 사진을 모두 등록해야 해요
                  </p>
                </div>
              )}
              <Button
                label="확인"
                shape="pill"
                fullWidth
                disabled={!isReady}
                onClick={() => setPhase('done')}
              />
            </div>
          </>
        )}

        {/* 완료 */}
        {phase === 'done' && (
          <CompleteView
            message="사진이 업로드되었어요"
            onNext={() => navigate('/onboarding/body/analysis')}
          />
        )}
      </div>

      <PhotoAddSheet
        isOpen={sheetTarget !== null && !cameraOpen}
        onClose={() => setSheetTarget(null)}
        onSelect={applyPhoto}
        onCamera={() => setCameraOpen(true)}
      />

      {cameraOpen && <CameraCapture onClose={closeAll} onCapture={applyPhoto} />}
    </OnboardingLayout>
  );
};

export default BodyUploadPage;
