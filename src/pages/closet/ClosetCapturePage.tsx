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

/** 보라 스캔 라인 — 49×5 #9D98F0, 뒤쪽 blur 2 (Figma) */
const ScanLine = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute -mt-1 h-[5px] w-[49px] rounded-full bg-[#9D98F0]"
    style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
  />
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

/** 추가 촬영 버튼용 카메라 — 24×24, stroke #1F2124 */
const CaptureMoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M6.827 6.17521C6.64699 6.46012 6.40682 6.70219 6.12334 6.88444C5.83985 7.06669 5.51993 7.18471 5.186 7.23021C4.806 7.28421 4.429 7.34221 4.052 7.40521C2.999 7.58021 2.25 8.50721 2.25 9.57421V18.0002C2.25 18.5969 2.48705 19.1692 2.90901 19.5912C3.33097 20.0132 3.90326 20.2502 4.5 20.2502H19.5C20.0967 20.2502 20.669 20.0132 21.091 19.5912C21.5129 19.1692 21.75 18.5969 21.75 18.0002V9.57421C21.75 8.50721 21 7.58021 19.948 7.40521C19.5707 7.34234 19.1927 7.28401 18.814 7.23021C18.4802 7.18457 18.1605 7.06649 17.8772 6.88424C17.5939 6.702 17.3539 6.46 17.174 6.17521L16.352 4.85921C16.1674 4.5593 15.9132 4.3083 15.611 4.12744C15.3089 3.94658 14.9675 3.8412 14.616 3.82021C12.8733 3.7266 11.1267 3.7266 9.384 3.82021C9.03245 3.8412 8.69114 3.94658 8.38896 4.12744C8.08678 4.3083 7.83262 4.5593 7.648 4.85921L6.827 6.17521Z"
      stroke="#1F2124"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 12.75C16.5 13.9435 16.0259 15.0881 15.182 15.932C14.3381 16.7759 13.1935 17.25 12 17.25C10.8065 17.25 9.66193 16.7759 8.81802 15.932C7.97411 15.0881 7.5 13.9435 7.5 12.75C7.5 11.5565 7.97411 10.4119 8.81802 9.56802C9.66193 8.72411 10.8065 8.25 12 8.25C13.1935 8.25 14.3381 8.72411 15.182 9.56802C16.0259 10.4119 16.5 11.5565 16.5 12.75ZM18.75 10.5H18.758V10.508H18.75V10.5Z"
      stroke="#1F2124"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 업로드 가능한 영수증 최대 장수 (OCR API 스펙) */
const MAX_RECEIPTS = 5;

/** 최대 장수 안내 아이콘 — 16×16, stroke #CED1D5 */
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M7.5 7.5L7.52733 7.48667C7.61282 7.44396 7.70875 7.42664 7.80378 7.43677C7.8988 7.4469 7.98893 7.48404 8.0635 7.54381C8.13806 7.60357 8.19394 7.68345 8.22451 7.77399C8.25508 7.86453 8.25907 7.96193 8.236 8.05467L7.764 9.94533C7.74076 10.0381 7.74463 10.1356 7.77513 10.2263C7.80563 10.3169 7.86149 10.3969 7.93609 10.4568C8.01069 10.5166 8.10089 10.5538 8.196 10.564C8.2911 10.5741 8.38712 10.5568 8.47267 10.514L8.5 10.5M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.0241 13.2417 10.2961 13.5433C9.56815 13.8448 8.78793 14 8 14C7.21207 14 6.43185 13.8448 5.7039 13.5433C4.97595 13.2417 4.31451 12.7998 3.75736 12.2426C3.20021 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.5913 2 11.1174 2.63214 12.2426 3.75736C13.3679 4.88258 14 6.4087 14 8ZM8 5.5H8.00533V5.50533H8V5.5Z"
      stroke="#CED1D5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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
        예상 소요시간은 약 7~9초예요
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
  // 찍어둔 프레임 — 인식 요청 전까지 메모리에만 들고 있는다 (서버 전송 후 폐기)
  const shots = useRef<Blob[]>([]);
  // 카운터는 즉시 올린다. Blob 변환(toBlob)이 비동기라 배열 길이로 세면 표시가 늦다
  const [captured, setCaptured] = useState(0);
  // 인식 완료 후 '영수증을 더 추가하시겠어요?' 단계
  const [asking, setAsking] = useState(false);

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
   * 셔터 — 현재 프레임을 잡아 보관하고 더 찍을지 묻는다.
   * 인식은 여기서 하지 않는다. 모아서 '다음'을 누를 때 한 번에 요청한다.
   */
  const handleShutter = () => {
    const video = videoRef.current;
    video?.pause();
    setCaptured((count) => count + 1);
    setAsking(true);

    if (!video?.videoWidth) return; // 프리뷰가 아직 안 붙었으면 장수만 올린다

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) shots.current.push(blob);
    }, 'image/jpeg', 0.92);
  };

  /** 추가로 사진 촬영하기 — 프리뷰를 다시 돌리고 촬영 대기 상태로 */
  const handleCaptureMore = () => {
    setAsking(false);
    videoRef.current?.play();
  };

  /** 다음 — 모아둔 프레임을 한 번에 인식 요청한다 */
  const handleRecognize = () => {
    // TODO: shots.current를 FormData(receiptImages)로 실어 OCR 요청 → 작업 상태 폴링
    setAsking(false);
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

        {/* 프리뷰 위 딤 — 촬영 0.4 / 추가 여부 묻는 단계 0.8 (Figma) */}
        <div className={`pointer-events-none absolute inset-0 ${asking ? 'bg-black/80' : 'bg-black/40'}`} />

        {/* 상단 컨트롤 — 좌우 24, 상태바 아래 15 (Figma 812 기준) */}
        <div className="absolute inset-x-0 top-[calc(14px+env(safe-area-inset-top,0px))] flex items-center justify-between px-6">
          <button type="button" onClick={() => navigate(-1)} aria-label="닫기" className="cursor-pointer">
            <CloseIcon />
          </button>
          {/* 플래시 — on 상태 시안·토치 제어 스펙 미수급이라 아이콘만 */}
          <button type="button" aria-label="플래시" className="cursor-pointer">
            <FlashOffIcon />
          </button>
        </div>

        {/* 스캔 프레임 — 브래킷 110×110이 화면 정중앙 (Figma: 상하좌우 351/132). 인식 완료 후에는 숨긴다 */}
        {!readDone && !asking && (
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

        {/* 안내 문구·셔터 — 인식 중·추가 여부 단계에서는 숨긴다 */}
        {!reading && !asking && (
          <>
            {/* 안내 문구 — 375×60, 프레임 아래 4 (Title/T3) */}
            <p className="absolute inset-x-0 top-[calc(50%+84px)] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F6F7F8]">
              영수증의 결제 정보가
              <br />잘 나오도록 찍어주세요
            </p>

            {/* 최대 장수 안내 — 327×20, 문구 아래 4, 아이콘↔문구 8 (Figma top 550) */}
            <div className="absolute inset-x-0 top-[calc(50%+148px)] flex items-center justify-center gap-2">
              <InfoIcon />
              {/* Caption/C3 — 12px Medium */}
              <span className="text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#CED1D5]">
                최대 {MAX_RECEIPTS}장까지 업로드 가능해요
              </span>
            </div>

            {/* 셔터 — 72×72, 하단 중앙 */}
            <div className="absolute inset-x-0 bottom-[calc(40px+env(safe-area-inset-bottom,0px))] flex justify-center">
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
        {reading && !asking && (
          <>
            <div className="absolute inset-0 z-10 bg-black/40" />
            {readDone ? <ReadingDoneOverlay /> : <ReadingOverlay />}
          </>
        )}

        {/* 영수증 더 추가할지 묻는 단계 */}
        {asking && (
          <>
            {/* 타이틀 — 375×30 (Title/T3), 진행 바 없는 화면이라 top 159 기준 (상태바 50 제외 109) */}
            <p className="absolute inset-x-0 top-[calc(109px+env(safe-area-inset-top,0px))] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F6F7F8]">
              {captured >= MAX_RECEIPTS ? '영수증을 모두 촬영했어요' : '영수증을 더 추가하시겠어요?'}
            </p>

            {/* 진행 카운터 — 27×27, 타이틀 아래 8 (Figma top 197). 18px SemiBold */}
            <p className="absolute inset-x-0 top-[calc(147px+env(safe-area-inset-top,0px))] text-center text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F6F7F8]">
              <span className="text-[#9D98F0]">{captured}</span>/{MAX_RECEIPTS}
            </p>

            {/* 하단 버튼 — 327×58, 사이 8. 5장을 다 채우면 '다음'만 남긴다 */}
            <div className="absolute inset-x-0 bottom-[calc(40px+env(safe-area-inset-bottom,0px))] flex flex-col gap-2 px-6">
              {captured < MAX_RECEIPTS && (
                <button
                  type="button"
                  onClick={handleCaptureMore}
                  className="flex h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-[32px] bg-[#F6F7F8] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
                >
                  <CaptureMoreIcon />
                  추가로 사진 촬영하기
                </button>
              )}
              <button
                type="button"
                onClick={handleRecognize}
                className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ClosetCapturePage;
