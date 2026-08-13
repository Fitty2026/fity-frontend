import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';

/** 닫기 X — 32×32, stroke #F6F7F8 */
const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24L24 8M8 8L24 24" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 갤러리 — 48×48, stroke #F6F7F8 */
const GalleryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 31.5L14.818 21.182C15.2359 20.7641 15.7319 20.4327 16.2779 20.2065C16.8239 19.9804 17.409 19.864 18 19.864C18.591 19.864 19.1761 19.9804 19.7221 20.2065C20.2681 20.4327 20.7641 20.7641 21.182 21.182L31.5 31.5M28.5 28.5L31.318 25.682C31.7359 25.2641 32.2319 24.9327 32.7779 24.7065C33.3239 24.4804 33.909 24.364 34.5 24.364C35.091 24.364 35.6761 24.4804 36.2221 24.7065C36.7681 24.9327 37.2641 25.2641 37.682 25.682L43.5 31.5M7.5 39H40.5C41.2956 39 42.0587 38.6839 42.6213 38.1213C43.1839 37.5587 43.5 36.7956 43.5 36V12C43.5 11.2044 43.1839 10.4413 42.6213 9.87868C42.0587 9.31607 41.2956 9 40.5 9H7.5C6.70435 9 5.94129 9.31607 5.37868 9.87868C4.81607 10.4413 4.5 11.2044 4.5 12V36C4.5 36.7956 4.81607 37.5587 5.37868 38.1213C5.94129 38.6839 6.70435 39 7.5 39ZM28.5 16.5H28.516V16.516H28.5V16.5ZM29.25 16.5C29.25 16.6989 29.171 16.8897 29.0303 17.0303C28.8897 17.171 28.6989 17.25 28.5 17.25C28.3011 17.25 28.1103 17.171 27.9697 17.0303C27.829 16.8897 27.75 16.6989 27.75 16.5C27.75 16.3011 27.829 16.1103 27.9697 15.9697C28.1103 15.829 28.3011 15.75 28.5 15.75C28.6989 15.75 28.8897 15.829 29.0303 15.9697C29.171 16.1103 29.25 16.3011 29.25 16.5Z" stroke="#F6F7F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 저장 — 48×48, stroke #F6F7F8 */
const SaveIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 7.5H13.824C12.8619 7.50017 11.9252 7.8087 11.1513 8.3803C10.3774 8.9519 9.80707 9.75648 9.524 10.676L4.7 26.354C4.56787 26.7822 4.50046 27.2278 4.5 27.676V36C4.5 37.1935 4.97411 38.3381 5.81802 39.182C6.66193 40.0259 7.80653 40.5 9 40.5H39C40.1935 40.5 41.3381 40.0259 42.182 39.182C43.0259 38.3381 43.5 37.1935 43.5 36V27.676C43.5 27.228 43.432 26.782 43.3 26.354L38.48 10.676C38.1969 9.75648 37.6266 8.9519 36.8527 8.3803C36.0788 7.8087 35.1421 7.50017 34.18 7.5H30M4.5 27H12.22C13.0556 27.0002 13.8746 27.2331 14.5853 27.6725C15.2961 28.1119 15.8704 28.7406 16.244 29.488L16.756 30.512C17.1298 31.2597 17.7044 31.8886 18.4155 32.328C19.1266 32.7675 19.9461 33.0002 20.782 33H27.218C28.0539 33.0002 28.8734 32.7675 29.5845 32.328C30.2956 31.8886 30.8702 31.2597 31.244 30.512L31.756 29.488C32.1298 28.7403 32.7044 28.1114 33.4155 27.672C34.1266 27.2325 34.9461 26.9998 35.782 27H43.5M24 6V22.5M30 16.5L24 22.5L18 16.5" stroke="#F6F7F8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
 * 상단 닫기/플래시, 중앙 프리뷰, 하단 갤러리/셔터/저장.
 */
const ClosetPhotoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flashOn, setFlashOn] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 다른 화면이 옷 사진을 찍으러 보낸 경우 — 돌아갈 주소와 그때 들고 갈 값을 함께 받는다
  const caller = location.state as
    | { returnTo?: string; returnState?: Record<string, unknown> }
    | null;

  /**
   * 촬영/갤러리 선택 후 이동.
   * 부른 화면이 있으면 사진만 얹어 그리로 되돌리고(편집 중이던 값은 returnState로 보존),
   * 없으면 기존 등록 완료 경로를 탄다.
   */
  const goNext = (photo: string) => {
    if (caller?.returnTo) {
      navigate(caller.returnTo, {
        replace: true,
        state: { ...caller.returnState, photo },
      });
      return;
    }
    navigate('/closet/register/added');
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
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // 권한 거부 / 카메라 없음 / http 환경(보안 컨텍스트 아님) → 온 곳으로 되돌린다
        if (!cancelled) navigate(-1);
      }
    };

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [navigate]);

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

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) goNext(URL.createObjectURL(file));
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
          onClick={() => setFlashOn((v) => !v)}
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

        {/* 갤러리 — 좌 24, 하단 40. 파일 선택 후 분석으로 */}
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePickFile} />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="absolute left-6 cursor-pointer"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}
          aria-label="갤러리"
        >
          <GalleryIcon />
        </button>

        {/* 저장 — 우 24, 하단 40 (갤러리와 대칭). 동작 정의 대기 → 임시로 다음 화면 진행 */}
        <button
          type="button"
          onClick={handleShoot}
          className="absolute right-6 cursor-pointer"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}
          aria-label="저장"
        >
          <SaveIcon />
        </button>
      </div>
    </PageLayout>
  );
};

export default ClosetPhotoPage;
