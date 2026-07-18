import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mannequin from '@/assets/images/body/mannequin.png';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoFrameCard from '@/features/onboarding/components/PhotoFrameCard';
import useOnboardingStore from '@/store/onboardingStore';

type Phase = 'guide' | 'camera' | 'done';

const DOT_COUNT = 20;

/** 카메라 프리뷰 위 보라 점 원형 프로그레스 */
const CameraDots = () => (
  <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
    {Array.from({ length: DOT_COUNT }, (_, i) => (
      <span
        key={i}
        className="absolute left-1/2 top-1/2"
        style={{ transform: `rotate(${(360 / DOT_COUNT) * i}deg) translateY(-100px)` }}
      >
        <span
          className="block h-3 w-3 rounded-full bg-violet-400"
          style={{ animation: `camera-dot 1.6s ease-in-out ${i * 0.08}s infinite` }}
        />
      </span>
    ))}
  </div>
);

const BodyCameraPage = () => {
  const navigate = useNavigate();
  const setBodyPhotoUrls = useOnboardingStore((s) => s.setBodyPhotoUrls);
  const [phase, setPhase] = useState<Phase>('guide');
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 카메라 phase 진입 시 스트림 시작, 이탈/언마운트 시 정리
  useEffect(() => {
    if (phase !== 'camera') return;

    let cancelled = false;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (!cancelled) setCameraError(true);
      }
    };
    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [phase]);

  const finishWithUrls = (urls: string[]) => {
    setBodyPhotoUrls(urls);
    setPhase('done');
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) finishWithUrls([URL.createObjectURL(blob)]);
      },
      'image/jpeg',
      0.9,
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    finishWithUrls(files.map((file) => URL.createObjectURL(file)));
  };

  // 카메라 화면은 레이아웃 없이 전체 화면으로 표시
  if (phase === 'camera') {
    return (
      <div className="fixed inset-0 z-50 flex justify-center bg-black">
        <div className="relative h-full w-full max-w-[430px] overflow-hidden">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p className="text-sm leading-relaxed text-white">
                카메라를 사용할 수 없어요.
                <br />
                갤러리에서 사진을 선택해주세요.
              </p>
              <label className="flex h-12 cursor-pointer items-center justify-center rounded-full bg-white px-8 text-sm font-medium">
                사진 선택
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              <CameraDots />
            </>
          )}

          {/* 닫기 */}
          <button
            type="button"
            aria-label="촬영 닫기"
            onClick={() => setPhase('guide')}
            className="absolute left-4 top-4 text-2xl text-white"
          >
            ✕
          </button>

          {!cameraError && (
            <div className="absolute bottom-8 left-0 flex w-full items-center justify-center">
              {/* 갤러리에서 선택 */}
              <label
                aria-label="갤러리에서 선택"
                className="absolute left-8 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/70 text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-5-5-8 8" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
              {/* 셔터 */}
              <button
                type="button"
                aria-label="촬영"
                onClick={handleCapture}
                className="h-16 w-16 rounded-full border-4 border-white bg-white/30"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout progress={0.8}>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
        <h2 className="text-center text-lg font-semibold">
          {phase === 'guide' ? '천천히 한 바퀴 돌아주세요' : '사진 촬영이 완료되었어요'}
        </h2>

        <div className="mt-8 flex flex-1 items-start justify-center">
          {phase === 'guide' ? (
            <PhotoFrameCard imageSrc={mannequin} alt="한 바퀴 돌기 가이드" />
          ) : (
            <PhotoFrameCard showCheck />
          )}
        </div>

        {phase === 'guide' ? (
          <button
            type="button"
            onClick={() => {
              setCameraError(false);
              setPhase('camera');
            }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            촬영하기
          </button>
        ) : (
          <Button
            label="다음"
            shape="pill"
            fullWidth
            onClick={() => navigate('/onboarding/body/analysis')}
          />
        )}
      </div>
    </OnboardingLayout>
  );
};

export default BodyCameraPage;
