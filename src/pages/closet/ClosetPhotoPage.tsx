import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';

/** 닫기 X — 32×32, stroke #F6F7F8 */
const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24L24 8M8 8L24 24" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 셔터 — 72×72, white (링 + 안쪽 원) */
const ShutterIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35.9987" cy="35.9997" r="27.6667" fill="white" />
    <path d="M72 36C72 55.8823 55.8823 72 36 72C16.1177 72 0 55.8823 0 36C0 16.1177 16.1177 0 36 0C55.8823 0 72 16.1177 72 36ZM4.48105 36C4.48105 53.4074 18.5926 67.519 36 67.519C53.4074 67.519 67.519 53.4074 67.519 36C67.519 18.5926 53.4074 4.48105 36 4.48105C18.5926 4.48105 4.48105 18.5926 4.48105 36Z" fill="white" />
  </svg>
);

/** 플래시 — 32×32, stroke #F6F7F8. off는 사선으로 가로지른 형태 */
const FlashIcon = ({ on }: { on: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1461_117649)">
      {on ? (
        <path d="M19 3L8 17H15L13 29L24 15H17L19 3Z" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M15.216 20.8733L13 29L17.9933 23.6507M12.3427 18H5L8.54533 14.2013M11.276 11.276L19 3L16 14H27L20.724 20.724M11.276 11.276L4 4M11.276 11.276L20.724 20.724M20.724 20.724L28 28" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </g>
    <defs>
      <clipPath id="clip0_1461_117649">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/**
 * 옷 사진 직접 등록 — 카메라 촬영 화면.
 * 상단 닫기/플래시, 중앙 프리뷰, 하단 셔터.
 */
const ClosetPhotoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flashOn, setFlashOn] = useState(false);
  // 토치를 켜고 끄려면 프리뷰가 물고 있는 비디오 트랙이 필요하다
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 다른 화면이 옷 사진을 찍으러 보낸 경우 — 돌아갈 주소와 그때 들고 갈 값을 함께 받는다
  const caller = location.state as
    | { returnTo?: string; returnState?: Record<string, unknown> }
    | null;

  /**
   * 촬영/갤러리 선택 후 이동.
   * 부른 화면이 있으면 사진만 얹어 그리로 되돌리고(편집 중이던 값은 returnState로 보존),
   * 없으면 태그 확인 화면으로 이어진다.
   */
  const goNext = (photo: string) => {
    if (caller?.returnTo) {
      navigate(caller.returnTo, {
        replace: true,
        state: { ...caller.returnState, photo },
      });
      return;
    }
    // 직접 등록으로 들어온 경우 — 찍은 사진을 들고 태그 확인으로
    navigate('/closet/register/tags', { state: { photos: [photo] } });
  };

  // 후면 카메라 프리뷰 — 언마운트 시 트랙을 반드시 정리한다(영수증 촬영 화면과 같은 방식)
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        // 언마운트 후 응답이 오면 스트림만 정리하고 붙이지 않는다
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        trackRef.current = stream.getVideoTracks()[0] ?? null;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // 권한 거부 / 카메라 없음 / http 환경(보안 컨텍스트 아님) → 온 곳으로 되돌린다
        if (!cancelled) navigate(-1);
      }
    };

    start();

    return () => {
      cancelled = true;
      trackRef.current = null;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [navigate]);

  /**
   * 플래시 — 카메라 트랙의 토치를 켜고 끈다.
   * torch는 기기·브라우저를 타는 기능이라(데스크톱 웹캠 등) 지원하지 않으면 표시만 바뀐다.
   */
  const toggleFlash = async () => {
    const next = !flashOn;
    setFlashOn(next);
    const track = trackRef.current;
    if (!track) return;
    const capabilities = track.getCapabilities?.() as { torch?: boolean } | undefined;
    if (!capabilities?.torch) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
    } catch {
      // 적용에 실패하면 켜진 것으로 두지 않는다
      setFlashOn(false);
    }
  };

  /** 셔터 — 현재 프레임을 잡아 사진으로 넘긴다 */
  const handleShoot = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return; // 프리뷰가 아직 안 붙었으면 아무 것도 하지 않는다

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) goNext(URL.createObjectURL(blob));
      },
      'image/jpeg',
      0.92,
    );
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 overflow-hidden bg-black">
        {/* 카메라 프리뷰 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* 닫기 X — 상태바 아래 14px, 좌 24px */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-6 cursor-pointer"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
          aria-label="닫기"
        >
          <CloseIcon />
        </button>

        {/* 플래시 — 상태바 아래 14px, 우 24px. 켜짐/꺼짐 토글 */}
        <button
          type="button"
          onClick={toggleFlash}
          className="absolute right-6 cursor-pointer"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
          aria-label={flashOn ? '플래시 끄기' : '플래시 켜기'}
          aria-pressed={flashOn}
        >
          <FlashIcon on={flashOn} />
        </button>

        {/* 셔터 — 하단 40px, 가로 중앙 */}
        <button
          type="button"
          onClick={handleShoot}
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}
          aria-label="촬영"
        >
          <ShutterIcon />
        </button>
      </div>
    </PageLayout>
  );
};

export default ClosetPhotoPage;
