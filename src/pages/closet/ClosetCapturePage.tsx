import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import captureMock from '@/assets/images/closet/capture-mock.png';

/** 닫기 X — 32×32, stroke #F6F7F8 */
const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24L24 8M8 8L24 24" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 플래시 — 32×32, stroke #F6F7F8. off는 사선으로 가로지른 형태 */
const FlashIcon = ({ on }: { on: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {on ? (
      <path d="M19 3L8 17H15L13 29L24 15H17L19 3Z" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M15.216 20.8733L13 29L17.9933 23.6507M12.3427 18H5L8.54533 14.2013M11.276 11.276L19 3L16 14H27L20.724 20.724M11.276 11.276L4 4M11.276 11.276L20.724 20.724M20.724 20.724L28 28" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

/** 셔터 — 72×72, white (링 + 안쪽 원) */
const ShutterIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35.9987" cy="35.9997" r="27.6667" fill="white" />
    <path d="M72 36C72 55.8823 55.8823 72 36 72C16.1177 72 0 55.8823 0 36C0 16.1177 16.1177 0 36 0C55.8823 0 72 16.1177 72 36ZM4.48105 36C4.48105 53.4074 18.5926 67.519 36 67.519C53.4074 67.519 67.519 53.4074 67.519 36C67.519 18.5926 53.4074 4.48105 36 4.48105C18.5926 4.48105 4.48105 18.5926 4.48105 36Z" fill="white" />
  </svg>
);

// Scanner Container (Figma, 375×812 기준) — 327×401, top 206(상태바 50 + 156) / left 24,
// radius 16, border 6px dashed(91,91) #1F2124, inner alignment. 바깥 딤 #000000 72%.
// 앱 컨테이너는 최대 430px까지 넓어지므로 고정 px 대신 아래 비율로 기본 위치를 잡는다.
const SIDE_MARGIN = 24; // 좌우 여백 (시안과 동일)
const ASPECT = 401 / 327; // 프레임 세로/가로 비
const TOP_RATIO = 156 / (156 + 205); // 남는 세로 공간 중 위쪽이 차지하는 비율 (시안 156 : 205)
const SHUTTER_ZONE = 132; // 셔터(72) + 하단 여백(40) + 간격(20) — 프레임이 셔터를 침범하지 않게
const TOP_MIN = 60; // 닫기/플래시 아이콘(상단 14 + 32) 아래로 내려가도록
const BORDER = 6;
const RADIUS = 16;
const DASH = 91;
const MIN_SIZE = 120;
/** 코너 리사이즈 손잡이 크기 (히트 영역) */
const HANDLE = 40;

type Corner = 'tl' | 'tr' | 'bl' | 'br';
type Rect = { top: number; left: number; width: number; height: number };

/**
 * 구매내역 캡처 — 가이드 프레임 안에 구매내역 화면을 맞춰 촬영.
 * 상단 닫기/플래시, 중앙 스캐너 프레임(안쪽은 그대로·바깥은 72% 딤), 하단 셔터.
 * 프레임은 드래그로 이동, 네 모서리로 크기 조절 — 조절 가능 여부는 디자이너 확인 대기(임시).
 * (카메라 연동 전 — 프리뷰는 목업 이미지)
 */
const ClosetCapturePage = () => {
  const navigate = useNavigate();
  const [flashOn, setFlashOn] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  // 드래그 시작 시점의 포인터 위치 + 프레임 상태 (이동/리사이즈 공용)
  const drag = useRef<{ x: number; y: number; rect: Rect; corner?: Corner } | null>(null);

  // 기본 위치 — 화면 크기에서 계산 (좌우 24 여백, 시안 비율 유지, 위쪽 156 : 아래쪽 205)
  useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const { width: sw, height: sh } = el.getBoundingClientRect();
    const width = sw - SIDE_MARGIN * 2;
    const height = Math.min(width * ASPECT, sh - SHUTTER_ZONE - TOP_MIN);
    // 남는 세로 공간을 시안 비율로 나눠 위치. 단 셔터 영역은 침범하지 않는다.
    const top = Math.min((sh - height) * TOP_RATIO, sh - SHUTTER_ZONE - height);
    setRect({ left: SIDE_MARGIN, top: Math.max(TOP_MIN, top), width, height });
  }, []);

  const startDrag = (e: React.PointerEvent, corner?: Corner) => {
    if (!rect) return;
    e.stopPropagation();
    drag.current = { x: e.clientX, y: e.clientY, rect, corner };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const { x, y, rect: start, corner } = drag.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    const bounds = screenRef.current?.getBoundingClientRect();

    if (!corner) {
      // 이동 — 화면 밖으로 나가지 않게 가둔다
      const maxLeft = bounds ? bounds.width - start.width : start.left;
      const maxTop = bounds ? bounds.height - start.height : start.top;
      setRect({
        ...start,
        left: Math.min(Math.max(0, start.left + dx), Math.max(0, maxLeft)),
        top: Math.min(Math.max(0, start.top + dy), Math.max(0, maxTop)),
      });
      return;
    }

    // 잡은 모서리만 움직이고 반대편은 고정
    const right = start.left + start.width;
    const bottom = start.top + start.height;
    const left = corner[1] === 'l' ? Math.min(Math.max(0, start.left + dx), right - MIN_SIZE) : start.left;
    const top = corner[0] === 't' ? Math.min(Math.max(0, start.top + dy), bottom - MIN_SIZE) : start.top;
    const maxWidth = bounds ? bounds.width - left : Infinity;
    const maxHeight = bounds ? bounds.height - top : Infinity;
    const width = corner[1] === 'l' ? right - left : Math.min(maxWidth, Math.max(MIN_SIZE, start.width + dx));
    const height = corner[0] === 't' ? bottom - top : Math.min(maxHeight, Math.max(MIN_SIZE, start.height + dy));
    setRect({ top, left, width, height });
  };

  const endDrag = () => {
    drag.current = null;
  };

  const cornerStyle = (corner: Corner): React.CSSProperties => ({
    width: HANDLE,
    height: HANDLE,
    [corner[0] === 't' ? 'top' : 'bottom']: -HANDLE / 2,
    [corner[1] === 'l' ? 'left' : 'right']: -HANDLE / 2,
    cursor: corner === 'tl' || corner === 'br' ? 'nwse-resize' : 'nesw-resize',
  });

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div ref={screenRef} className="relative flex flex-col flex-1 min-h-0 bg-[#4B4B4B]">
        {/* 목업 프리뷰 — 카메라 연동 전 임시 배경 */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${captureMock})` }}
        />

        {/* 스캐너 프레임 — 안쪽은 그대로 두고 바깥만 어둡게. 드래그 이동 + 모서리 리사이즈 */}
        {rect && (
        <div
          className="absolute touch-none cursor-move"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
          onPointerDown={(e) => startDrag(e)}
          onPointerMove={onDragMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* 바깥 딤 */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{ borderRadius: RADIUS, boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)' }}
          />

          {/* 테두리 — 6px 대시(91,91), 안쪽 정렬이라 stroke 절반만큼 안으로 넣는다 */}
          <svg className="pointer-events-none absolute inset-0" width="100%" height="100%">
            <rect
              x={BORDER / 2}
              y={BORDER / 2}
              width={Math.max(0, rect.width - BORDER)}
              height={Math.max(0, rect.height - BORDER)}
              rx={RADIUS - BORDER / 2}
              fill="none"
              stroke="#1F2124"
              strokeWidth={BORDER}
              strokeDasharray={`${DASH} ${DASH}`}
            />
          </svg>

          {/* 모서리 손잡이 — 크기 조절 (임시) */}
          {(['tl', 'tr', 'bl', 'br'] as Corner[]).map((corner) => (
            <span
              key={corner}
              className="absolute touch-none"
              style={cornerStyle(corner)}
              onPointerDown={(e) => startDrag(e, corner)}
              onPointerMove={onDragMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          ))}
        </div>
        )}

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

        {/* 플래시 — 상태바 아래 14px, 우 24px */}
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

        {/* 셔터 — 하단 40px, 가로 중앙. 촬영 후 인식 로딩으로 */}
        <button
          type="button"
          onClick={() => navigate('/closet/register/recognizing')}
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

export default ClosetCapturePage;
