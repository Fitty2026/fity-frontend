import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import AnalyzeFailView from '@/features/onboarding/components/AnalyzeFailView';
import CompleteView from '@/features/onboarding/components/CompleteView';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import PhotoCarousel from '@/features/onboarding/components/PhotoCarousel';
import { startBodyAnalysis } from '@/features/onboarding/bodyAnalysis';
import useOnboardingStore from '@/store/onboardingStore';

/** 촬영 3연속(정면→측면→후면) → 확인 → 완료 */
type Phase = 'camera' | 'confirm' | 'done';

const SHOT_LABELS = ['정면', '측면', '후면'] as const;
const SHOT_COUNT = SHOT_LABELS.length;

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
  const analysisStatus = useOnboardingStore((s) => s.analysisStatus);
  const setAnalysisStatus = useOnboardingStore((s) => s.setAnalysisStatus);
  const [phase, setPhase] = useState<Phase>('camera');
  /** 이번 세션에서 촬영한 사진 (정면→측면→후면 순서) */
  const [shots, setShots] = useState<string[]>([]);
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

  /** 3장이 모이면 스토어에 저장하고 확인 화면으로 */
  const addShot = (url: string) => {
    const next = [...shots, url];
    setShots(next);
    if (next.length >= SHOT_COUNT) {
      setBodyPhotoUrls(next);
      setPhase('confirm');
    }
  };

  /** 확인 → 완료 화면으로 넘어가며 분석을 미리 시작한다 (정면/측면/후면 순서) */
  const handleConfirm = () => {
    setPhase('done');
    void startBodyAnalysis(shots);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    // 프리뷰는 object-cover로 중앙 크롭되어 보이므로,
    // 화면에 보이는 영역만 원본 프레임에서 잘라내 그대로 저장한다
    const { videoWidth, videoHeight } = video;
    const displayRatio = video.clientWidth / video.clientHeight;
    const videoRatio = videoWidth / videoHeight;

    let sx = 0;
    let sy = 0;
    let sw = videoWidth;
    let sh = videoHeight;
    if (videoRatio > displayRatio) {
      // 원본이 더 넓음 → 좌우를 잘라냄
      sw = Math.round(videoHeight * displayRatio);
      sx = Math.round((videoWidth - sw) / 2);
    } else {
      // 원본이 더 높음 → 상하를 잘라냄
      sh = Math.round(videoWidth / displayRatio);
      sy = Math.round((videoHeight - sh) / 2);
    }

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    canvas.getContext('2d')?.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob(
      (blob) => {
        if (blob) addShot(URL.createObjectURL(blob));
      },
      'image/jpeg',
      0.9,
    );
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
                앨범에서 사진을 선택해주세요.
              </p>
              <button
                type="button"
                onClick={() => navigate('/onboarding/body/upload', { replace: true })}
                className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium"
              >
                앨범에서 선택
              </button>
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
              {/* 현재 촬영 차례 - 정면(1/3) → 측면(2/3) → 후면(3/3) */}
              <p className="absolute top-5 left-1/2 -translate-x-1/2 text-sm font-medium text-white drop-shadow">
                {SHOT_LABELS[shots.length]} 촬영 ({shots.length + 1}/{SHOT_COUNT})
              </p>
            </>
          )}

          {/* 닫기 */}
          <button
            type="button"
            aria-label="촬영 닫기"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 text-2xl text-white"
          >
            ✕
          </button>

          {!cameraError && (
            <div className="absolute bottom-8 left-0 flex w-full items-center justify-center">
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
    <OnboardingLayout progress={0.57}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        {phase === 'confirm' && (
          <>
            <h2 className="px-6 text-center text-lg font-semibold">촬영한 사진이 다음과 같나요?</h2>
            <div className="mt-6 overflow-hidden">
              <PhotoCarousel imageSrcs={shots} fit="cover" />
            </div>
            <p className="mt-3 flex items-center justify-center gap-1 px-6 text-center text-xs text-neutral-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              사진은 분석 후 즉시 삭제되며, 안전하게 보호돼요
            </p>
            <div className="mt-auto px-6 pt-6">
              <Button label="다음" shape="pill" fullWidth onClick={handleConfirm} />
            </div>
          </>
        )}

        {/* 완료 — 분석은 백그라운드 진행. 전신 인식 실패면 완료 화면 없이 바로 에러 안내로 전환 */}
        {phase === 'done' &&
          (analysisStatus === 'error' ? (
            <AnalyzeFailView
              photos={shots}
              mode="camera"
              onRetry={() => {
                setAnalysisStatus('idle');
                setShots([]);
                setPhase('camera');
              }}
            />
          ) : (
            <CompleteView
              message="촬영이 완료되었어요"
              onNext={() => navigate('/onboarding/body/analysis', { state: { from: 'camera' } })}
            />
          ))}
      </div>
    </OnboardingLayout>
  );
};

export default BodyCameraPage;
