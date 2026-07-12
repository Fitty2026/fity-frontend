import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import useOnboardingStore from '@/store/onboardingStore';

const PhotoUploadPage = () => {
  const navigate = useNavigate();
  const bodyImageUrl = useOnboardingStore((s) => s.bodyImageUrl);
  const setBodyImage = useOnboardingStore((s) => s.setBodyImage);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 이전 미리보기 objectURL 해제 후 교체 (누수 방지)
    const prevUrl = useOnboardingStore.getState().bodyImageUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    setBodyImage(file, URL.createObjectURL(file));
    // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 리셋
    e.target.value = '';
  };

  const skipOnboarding = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <PageLayout
      title="체형 사진 등록하기"
      showBack
      onBack={() => navigate('/onboarding')}
      showBottomNav={false}
    >
      <div className="flex flex-col gap-5 px-6 py-6">
        {/* 업로드 박스 */}
        <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-300">
          {bodyImageUrl ? (
            <img
              src={bodyImageUrl}
              alt="선택한 체형 사진"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="text-neutral-500"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="mt-5 font-semibold">전신 사진을 업로드해주세요</p>
              <p className="mt-2 text-sm text-neutral-500">
                AI가 체형을 분석해 나에게 맞는 아바타를 만들어드려요
              </p>
            </div>
          )}
        </div>

        {/* 숨긴 파일 입력 - 모바일에서 촬영/갤러리 구분 */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex gap-3">
          <Button
            label="사진 촬영하기"
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => cameraInputRef.current?.click()}
          />
          <Button
            label="갤러리에서 선택"
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => galleryInputRef.current?.click()}
          />
        </div>

        {/* 촬영 가이드 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="font-semibold">촬영 가이드</p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-600">
            <li>전신이 보이도록 촬영해주세요</li>
            <li>몸이 잘 보이는 옷을 입어주세요</li>
            <li>밝은 배경에서 촬영해주세요</li>
          </ul>
        </div>

        {/* 안심 카드 */}
        <div className="rounded-2xl bg-neutral-100 p-5">
          <p className="font-semibold">안심하세요</p>
          <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">
            {'업로드된 사진은 체형 분석에만 사용돼요\n외부에 공유되지 않아요'}
          </p>
        </div>

        <Button
          label="분석 시작하기"
          fullWidth
          disabled={!bodyImageUrl}
          onClick={() => navigate('/onboarding/analysis')}
        />
        <button
          type="button"
          onClick={skipOnboarding}
          className="text-center text-sm text-neutral-400 underline-offset-2 hover:underline"
        >
          나중에 하기
        </button>
      </div>
    </PageLayout>
  );
};

export default PhotoUploadPage;

