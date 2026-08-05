import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';

/** 닫기 — 32×32, stroke #F6F7F8 */
const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M8 24L24 8M8 8L24 24"
      stroke="#F6F7F8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 플래시 off — 32×32, stroke #F6F7F8 (on 상태 시안 미수급) */
const FlashOffIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <g clipPath="url(#clip0_2480_11773)">
      <path
        d="M15.216 20.8733L13 29L17.9933 23.6507M12.3427 18H5L8.54533 14.2013M11.276 11.276L19 3L16 14H27L20.724 20.724M11.276 11.276L4 4M11.276 11.276L20.724 20.724M20.724 20.724L28 28"
        stroke="#F6F7F8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2480_11773">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/** 스캔 프레임 — 160×160, 모서리 브래킷 (110×110, Top/Left 25, border 6) */
const ScanFrame = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M50 25H40C36.0218 25 32.2064 26.5804 29.3934 29.3934C26.5804 32.2064 25 36.0218 25 40V50M110 25H120C123.978 25 127.794 26.5804 130.607 29.3934C133.42 32.2064 135 36.0218 135 40V50M135 110V120C135 123.978 133.42 127.794 130.607 130.607C127.794 133.42 123.978 135 120 135H110M50 135H40C36.0218 135 32.2064 133.42 29.3934 130.607C26.5804 127.794 25 123.978 25 120V110"
      stroke="#F6F7F8"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 스캔 라인 왕복 범위 — 영수증 글리프 상·하단(56 뷰박스 기준 y 7~49 → 중앙 ±21) */
const SCAN_TRAVEL = 21;

/** 보라 스캔 라인 — 58×9, 영수증 글리프 위아래를 왕복 */
const ScanLine = () => (
  <>
    <style>{`
      @keyframes closetScanLine {
        0%, 100% { transform: translateY(-${SCAN_TRAVEL}px); }
        50% { transform: translateY(${SCAN_TRAVEL}px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .closet-scan-line { animation: none; }
      }
    `}</style>
    <span
      className="closet-scan-line pointer-events-none absolute"
      style={{ animation: 'closetScanLine 2.4s ease-in-out infinite' }}
    >
      <svg width="58" height="9" viewBox="0 0 58 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <g filter="url(#filter0_f_2482_11806)">
          <path d="M4.5 4.5L53.5 4.5" stroke="#9D98F0" strokeWidth="5" strokeLinecap="round" />
        </g>
        <defs>
          <filter
            id="filter0_f_2482_11806"
            x="0"
            y="0"
            width="58"
            height="9"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_2482_11806" />
          </filter>
        </defs>
      </svg>
    </span>
  </>
);

/** 프레임 중앙 영수증 아이콘 — 56×56, stroke #F6F7F8 */
const ReceiptIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M18.6668 16.3333H37.3335M18.6668 25.6667H37.3335M18.6668 35H28.0002M46.6668 49V11.6667C46.6668 10.429 46.1752 9.242 45.3 8.36683C44.4248 7.49167 43.2378 7 42.0002 7H14.0002C12.7625 7 11.5755 7.49167 10.7003 8.36683C9.82516 9.242 9.3335 10.429 9.3335 11.6667V49L15.1668 44.3333L22.1668 49L28.0002 44.3333L33.8335 49L40.8335 44.3333L46.6668 49Z"
      stroke="#F6F7F8"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 인식 중 스피너 — 60×60, 트랙 #E6E8EA / 진행 #9D98F0 */
const ReadingSpinner = () => (
  <>
    <style>{`
      @keyframes closetSpin { to { transform: rotate(360deg); } }
    `}</style>
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ animation: 'closetSpin 1s linear infinite' }}
    >
      <circle cx="30" cy="30" r="26" stroke="#E6E8EA" strokeWidth="4" />
      <path d="M30 4C44.3594 4 56 15.6406 56 30" stroke="#9D98F0" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </>
);

/** 인식 완료까지 걸리는 시간 — API 연동 전 임시값 (실제 성공 최대 10초) */
const TEMP_READING_MS = 2000;

/** 완료 표시를 보여주는 시간 — 지나면 결과 확인 화면으로 이동 */
const DONE_HOLD_MS = 2000;

/** 흰 체크 → 검정 체크 전환 시간 */
const CHECK_SWAP_MS = 1000;

/**
 * 인식 완료 체크 — 48×48. filled면 검정 바탕, 아니면 흰 바탕.
 * ※ 흰 바탕 버전은 에셋 미수급이라 검정 버전의 색만 뒤집어 쓴다.
 */
const ReadingDoneIcon = ({ filled }: { filled: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <g clipPath="url(#clip0_2507_35055)">
      <circle cx="24" cy="24" r="24" fill={filled ? '#1F2124' : '#F6F7F8'} />
      <path
        d="M13 25L21.8 33L35 15"
        stroke={filled ? '#F6F7F8' : '#1F2124'}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2507_35055">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/**
 * 인식 중 오버레이 — 촬영 직후 카드(260×206) 노출.
 * ※ 카드 radius·딤 농도는 Figma 값 미수급이라 임시.
 */
const ReadingOverlay = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center">
    {/* 카드 260×206, 스피너는 상단에서 32 (Figma) */}
    <div className="flex h-[206px] w-[260px] flex-col items-center rounded-2xl bg-white pt-[32px]">
      <ReadingSpinner />
      {/* Title/T3 — 20px SemiBold, LH 150%, 블록 260×30 */}
      <p className="mt-[26px] w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
        영수증을 인식하고 있어요
      </p>
      {/* Body/B3 — 16px Medium, LH 160%, 블록 260×26 (카드 상단에서 148, 하단 여백 32) */}
      <p className="w-full text-center text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#B2B8BD]">
        잠시만 기다려주세요
      </p>
    </div>
  </div>
);

/**
 * 인식 완료 — 딤·카드 없이 체크 48×48 + 문구만 얹는다.
 * 체크 Top 191(상태바 50 제외 141), 좌우 164/163 = 가로 중앙, 체크→문구 24.
 */
const ReadingDoneOverlay = () => {
  // 흰 바탕 체크로 시작해 1초 뒤 검정 바탕으로 바뀐다
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFilled(true), CHECK_SWAP_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-x-0 top-[calc(141px+env(safe-area-inset-top,0px))] z-20 flex flex-col items-center">
      <ReadingDoneIcon filled={filled} />
      {/* Title/T3 — 블록 375×30 */}
      <p className="mt-6 w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F6F7F8]">
        인식이 완료되었어요
      </p>
    </div>
  );
};

/**
 * OCR 촬영 — 카메라 프리뷰 위에 스캔 프레임·안내 문구·셔터.
 * 배경은 후면 카메라 스트림. 권한 거부·미지원이면 예시 이미지로 대체한다.
 */
const ClosetCapturePage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reading, setReading] = useState(false);
  const [readDone, setReadDone] = useState(false);

  // OCR 연동 전 임시 — 실제로는 작업 상태 폴링으로 완료를 판단한다(성공 최대 10초).
  useEffect(() => {
    if (!reading) return;
    const timer = setTimeout(() => setReadDone(true), TEMP_READING_MS);
    return () => clearTimeout(timer);
  }, [reading]);

  // 완료 표시를 잠깐 보여준 뒤 결과 확인 화면으로
  useEffect(() => {
    if (!readDone) return;
    const timer = setTimeout(() => navigate('/closet/register/ocr-confirm'), DONE_HOLD_MS);
    return () => clearTimeout(timer);
  }, [readDone, navigate]);

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
        // 권한 거부 / 카메라 없음 / http 환경(보안 컨텍스트 아님) → 가이드로 되돌린다.
        // 히스토리를 남겨 촬영하기·뒤로가기 어느 쪽으로 오든 권한을 다시 요청한다.
        if (!cancelled) {
          navigate('/closet/register/capture-guide', { state: { cameraDenied: true } });
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [navigate]);

  /**
   * 셔터 — 프리뷰를 정지시키고 인식 중 오버레이를 띄운다.
   * 찍은 이미지 업로드·다음 화면 이동은 OCR API 연동 시 붙인다.
   */
  const handleShutter = () => {
    videoRef.current?.pause();
    setReading(true);
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex-1 min-h-0 overflow-hidden bg-black">
        {/* 카메라 프리뷰 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* 상단 컨트롤 — 좌우 24, 상태바 아래 15 (Figma 812 기준) */}
        <div className="absolute inset-x-0 top-[calc(15px+env(safe-area-inset-top,0px))] flex items-center justify-between px-6">
          <button type="button" onClick={() => navigate(-1)} aria-label="닫기" className="cursor-pointer">
            <CloseIcon />
          </button>
          {/* 플래시 — on 상태 시안·토치 제어 스펙 미수급이라 아이콘만 */}
          <button type="button" aria-label="플래시" className="cursor-pointer">
            <FlashOffIcon />
          </button>
        </div>

        {/* 스캔 프레임 — 브래킷 110×110이 화면 정중앙 (Figma: 상하좌우 351/132). 인식 완료 후에는 숨긴다 */}
        {!readDone && (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
            <div className="relative flex h-[160px] w-[160px] items-center justify-center">
              <ScanFrame />
              <span className="absolute">
                <ReceiptIcon />
              </span>
              <ScanLine />
            </div>
          </div>
        )}

        {/* 안내 문구·셔터 — 인식 중에는 숨긴다 */}
        {!reading && (
          <>
            {/* 안내 문구 — 375×60, 프레임 아래 4 (Title/T3) */}
            <p className="absolute inset-x-0 top-[calc(50%+84px)] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F6F7F8]">
              영수증의 결제 정보가
              <br />잘 나오도록 찍어주세요
            </p>

            {/* 셔터 — 72×72, 하단 중앙 */}
            <div className="absolute inset-x-0 bottom-[calc(25px+env(safe-area-inset-bottom,0px))] flex justify-center">
              <button
                type="button"
                onClick={handleShutter}
                aria-label="촬영"
                className="h-[72px] w-[72px] cursor-pointer rounded-full border-[3px] border-white bg-white/20 p-[5px]"
              >
                <span className="block h-full w-full rounded-full bg-white" />
              </button>
            </div>
          </>
        )}

        {/* 딤 — 인식 중·완료 공통 (Figma: #000000 40%) */}
        {reading && (
          <>
            <div className="absolute inset-0 z-10 bg-black/40" />
            {readDone ? <ReadingDoneOverlay /> : <ReadingOverlay />}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ClosetCapturePage;
