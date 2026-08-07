import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CameraCaptureProps {
  onClose: () => void;
  /** 촬영한 프레임의 objectURL 전달 */
  onCapture: (url: string) => void;
}

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

/**
 * 웹캠 촬영 오버레이 — getUserMedia로 실시간 프리뷰 후 셔터로 프레임 캡처.
 * 데스크톱(노트북 웹캠)·모바일 모두 실제 카메라 스트림 사용.
 * 열릴 때만 마운트되는 전제(부모에서 조건부 렌더) — 마운트 시 1회 카메라 시작.
 */
const CameraCapture = ({ onClose, onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        // 언마운트 후 늦게 도착한 스트림은 즉시 정리
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch(() => {
        if (active) setError('카메라를 사용할 수 없어요. 브라우저 카메라 권한을 확인해주세요.');
      });

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const handleShutter = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(URL.createObjectURL(blob));
      },
      'image/jpeg',
      0.9,
    );
  };

  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <div className="absolute inset-0 z-[60] flex flex-col bg-black">
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute left-5 z-10"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
      >
        <CloseIcon />
      </button>

      {error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-sm text-white/80">{error}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/15 px-5 py-2 text-sm text-white"
          >
            닫기
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setReady(true)}
            className="h-full w-full object-cover"
          />
          {/* 셔터 */}
          <button
            type="button"
            onClick={handleShutter}
            disabled={!ready}
            aria-label="촬영"
            className="absolute left-1/2 -translate-x-1/2 disabled:opacity-40"
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}
          >
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white/40">
              <span className="h-14 w-14 rounded-full bg-white" />
            </span>
          </button>
        </>
      )}
    </div>,
    container,
  );
};

export default CameraCapture;
