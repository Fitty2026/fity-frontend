import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import { SHOPPING_MALLS } from '@/features/closet/shoppingMalls';
import ablyLogo from '@/assets/images/closet/platform-ably-logo.jpg';
import musinsaLogo from '@/assets/images/closet/platform-musinsa-logo.jpg';
import zigzagLogo from '@/assets/images/closet/platform-zigzag-logo.jpg';

/** 쇼핑몰 로고 — 휠 박스를 채운다 */
const LOGOS: Record<string, string> = {
  ABLY: ablyLogo,
  MUSINSA: musinsaLogo,
  ZIGZAG: zigzagLogo,
};

/** 고르지 않은 박스는 로고 위에 이만큼 색을 눌러 둔다 (Figma #00000029) */
const DIM = 'rgba(0, 0, 0, 0.16)';

/** 고르기 전 로고는 이만큼만 남긴다 (Figma: 로고 fill-opacity 0.1) */
const LOGO_OPACITY = 0.1;

/** CSS 배경은 레이어별 불투명도를 못 줘서 흰 막으로 대신한다 (0.1×로고 + 0.9×흰색과 결과가 같다) */
const LOGO_VEIL = `rgba(255, 255, 255, ${1 - LOGO_OPACITY})`;
import useClosetStore from '@/store/closetStore';

// 휠 배치 — 박스 3개 좌표에서 역산한 값 (중심 x -66.7 / 박스 중심 반지름 236.7)
const CX = -66.7; // 원 중심 x (화면 밖 좌측)
const BOX_R = 236.7; // 박스 중심 반지름
const CENTER_BOX_R = BOX_R; // 중앙 박스도 같은 원 위
// 점 반지름 = 중앙 박스 왼쪽 모서리 - 간격 16 - 점 반지름 8
const DOT_R = 176.7;
const R = DOT_R; // arc 라인은 점 위를 지난다
const BOX = 48; // 일반 박스 한 변
const CENTER_BOX = 72; // 중앙(선택 위치) 박스 한 변
const LABEL_GAP = 8; // 박스 바깥 ~ 이름 간격
const SENS = 0.3; // 드래그 px당 회전(deg)

// OCR이 지원하는 쇼핑몰 3곳. 배열 순서가 위에서 아래 배치
const NAMES = SHOPPING_MALLS.map((mall) => mall.code);
const CENTER = Math.floor(NAMES.length / 2); // 처음 3시(선택 위치)에 오는 항목
const SPACING = 43.5; // 슬롯 간 각도
const PERIOD = SPACING * NAMES.length; // 무한 루프 주기
const VISIBLE = 70; // 이 각도 이내만 렌더 (주기 절반보다 커야 드래그 중 튀지 않음)

const pos = (radius: number, angleDeg: number) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: radius * Math.sin(a) };
};

/**
 * 슬롯 박스 — 48 rounded rect, 각도만큼 기울임.
 * 로고를 깔고 그 위에 딤과 슬롯별 그라데이션을 얹는다. 고른 쇼핑몰(dark)은 아무것도 안 얹어 로고가 그대로 보인다.
 */
const SlotBox = ({
  angle,
  kind,
  gid,
  logo,
}: {
  angle: number;
  kind: 'gray' | 'top' | 'bottom' | 'dark';
  gid: string;
  logo: string;
}) => {
  const picked = kind === 'dark';
  const spin = `rotate(${angle} 48 48)`;

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        {/* 로고와 덮개를 같은 둥근 사각형으로 자른다 (회전은 g에 걸려 클립도 같이 돈다) */}
        <clipPath id={`clip-${gid}`}>
          <rect x="24" y="24" width="48" height="48" rx="8" />
        </clipPath>
        {(kind === 'top' || kind === 'bottom') && (
          // 로고가 비쳐야 해서 시안대로 50% 투명 (Figma: rgba(255,255,255,0.5) → rgba(178,184,189,0.5))
          <linearGradient id={gid} x1="48" y1="14" x2="48" y2="82" gradientUnits="userSpaceOnUse">
            {kind === 'top' ? (
              <>
                <stop stopColor="white" stopOpacity="0.5" />
                <stop offset="1" stopColor="#B2B8BD" stopOpacity="0.5" />
              </>
            ) : (
              <>
                <stop stopColor="#B2B8BD" stopOpacity="0.5" />
                <stop offset="1" stopColor="white" stopOpacity="0.5" />
              </>
            )}
          </linearGradient>
        )}
      </defs>

      <g transform={spin} clipPath={`url(#clip-${gid})`}>
        <image
          href={logo}
          x="24"
          y="24"
          width="48"
          height="48"
          preserveAspectRatio="xMidYMid slice"
          opacity={picked ? 1 : LOGO_OPACITY}
        />
        {!picked && (
          <>
            <rect x="24" y="24" width="48" height="48" fill="#000000" fillOpacity="0.16" />
            <rect
              x="24"
              y="24"
              width="48"
              height="48"
              fill={kind === 'gray' ? '#B2B8BD' : `url(#${gid})`}
              fillOpacity={kind === 'gray' ? 0.5 : 1}
            />
          </>
        )}
      </g>

      {/* 흰 배경 로고도 테두리가 보이게 (Figma) */}
      <rect
        x="24"
        y="24"
        width="48"
        height="48"
        rx="8"
        transform={spin}
        fill="none"
        stroke="#E6E8EA"
      />
    </svg>
  );
};

/**
 * 쇼핑몰 플랫폼 선택 — 무한 회전 휠.
 * 세로 드래그로 회전. 슬롯(위치)별 박스: 중앙=검정 크게+이름 / 2·4번=회색 / 1·5번=그라데이션.
 * 로고는 루프(빈틈 없이 채움). 고르지 않은 박스는 로고 위에 딤을 얹어 색을 뺀다.
 */
const ClosetPlatformPage = () => {
  const navigate = useNavigate();
  const setSelectedPlatforms = useClosetStore((state) => state.setSelectedPlatforms);
  // 인식 실패분을 다시 시도할 때 앨범으로 돌려보내야 한다
  const setReceiptMethod = useClosetStore((state) => state.setReceiptMethod);
  const [rotation, setRotation] = useState(0);
  // 선택된 쇼핑몰 하나. 중앙(3시)에 온 쇼핑몰 클릭 시 토글 (단일 선택)
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const drag = useRef<{ startY: number; startRot: number } | null>(null);
  const moved = useRef(false); // 드래그로 움직였는지 (움직였으면 클릭 토글 무시)

  // 무한 루프: 각 로고 각도를 [-주기/2, 주기/2]로 wrap → 로고당 딱 1개, 중복 없음
  type Item = { key: string; name: string; angle: number };
  const items: Item[] = [];
  NAMES.forEach((name, i) => {
    const base = (i - CENTER) * SPACING + rotation;
    const angle = base - PERIOD * Math.round(base / PERIOD);
    if (Math.abs(angle) <= VISIBLE) items.push({ key: name, name, angle });
  });
  const selected = items.reduce(
    (best, it) => (Math.abs(it.angle) < Math.abs(best.angle) ? it : best),
    { key: '', name: NAMES[CENTER], angle: 999 } as Item,
  );

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, startRot: rotation };
    moved.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // 중앙 쇼핑몰 선택 토글 (드래그 후 발생한 클릭은 무시)
  const toggleSelect = () => {
    if (moved.current) return;
    setSelectedName((prev) => (prev === selected.name ? null : selected.name));
  };
  const centerSelected = selectedName === selected.name;
  const nextActive = selectedName !== null;
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    if (Math.abs(e.clientY - drag.current.startY) > 4) moved.current = true;
    setRotation(drag.current.startRot + (e.clientY - drag.current.startY) * SENS);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setRotation((r) => r - selected.angle); // 선택 로고 3시로 스냅
  };

  // 중앙(선택 위치) 요소 좌표 — 박스는 다른 슬롯과 같은 반지름, 점은 점 반지름
  const selBox = pos(CENTER_BOX_R, selected.angle);
  const selDot = pos(DOT_R, selected.angle);
  const selLabel = pos(CENTER_BOX_R + CENTER_BOX / 2 + LABEL_GAP, selected.angle);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
        <div className="relative z-20">
          <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />
        </div>

        <p className="relative z-20 mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          영수증을 발급받을
          <br />
          쇼핑몰을 선택해 주세요
        </p>

        {/* 휠 영역 */}
        <div
          className="relative z-0 flex-1 min-h-0 touch-none cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* arc 라인 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-[#CED1D5]"
            style={{ left: `${CX - R}px`, width: R * 2, height: R * 2 }}
          />

          {/* 로고 (점 + 박스). 선택은 아래 큰 오버레이가 대신 */}
          {items.map((it) => {
            if (it.key === selected.key) return null;
            const isSel = selectedName === it.name; // 선택된 쇼핑몰 → 검정 표시
            const slot = Math.round(it.angle / SPACING);
            // 3개뿐이라 중앙 외에는 전부 위·아래 끝 → 그라데이션 처리
            const edge = Math.abs(slot) >= 1;
            const kind: 'gray' | 'top' | 'bottom' | 'dark' = isSel
              ? 'dark'
              : edge
                ? slot < 0
                  ? 'top'
                  : 'bottom'
                : 'gray';
            const dotColor = isSel ? '#1F2124' : edge ? '#CED1D5' : '#959BA7';
            const dot = pos(DOT_R, it.angle);
            const box = pos(BOX_R, it.angle);
            const label = pos(BOX_R + BOX / 2 + LABEL_GAP, it.angle);
            const labelStyle = isSel
              ? { color: '#1F2124' }
              : edge
                ? {
                    // 텍스트 세로 기준: 위 slot 흰→회 / 아래 slot 회→흰
                    backgroundImage: `linear-gradient(to bottom, ${slot < 0 ? '#FFFFFF, #B2B8BD' : '#B2B8BD, #FFFFFF'})`,
                    WebkitBackgroundClip: 'text' as const,
                    backgroundClip: 'text' as const,
                    color: 'transparent',
                  }
                : { color: '#B2B8BD' };
            return (
              <div key={it.key} className="pointer-events-none">
                <span
                  className="absolute"
                  style={{ left: `${box.x}px`, top: `calc(50% + ${box.y}px)`, transform: 'translate(-50%,-50%)' }}
                >
                  <SlotBox angle={it.angle} kind={kind} gid={`grad-${it.key}`} logo={LOGOS[it.name]} />
                </span>
                {/* 이름 라벨 — 박스 바깥 8px, 왼쪽 모서리 앵커 (각도만큼 기울임) */}
                <span
                  className="absolute whitespace-nowrap text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]"
                  style={{
                    left: `${label.x}px`,
                    top: `calc(50% + ${label.y}px)`,
                    transform: `translateY(-50%) rotate(${it.angle}deg)`,
                    transformOrigin: 'left center',
                    ...labelStyle,
                  }}
                >
                  {it.name}
                </span>
                <span
                  className="absolute w-3 h-3 rounded-full"
                  style={{ left: `${dot.x}px`, top: `calc(50% + ${dot.y}px)`, transform: 'translate(-50%,-50%)', backgroundColor: dotColor }}
                />
              </div>
            );
          })}

          {/* 선택 로고 크게 (실제 위치, 업라이트) — 클릭 시 선택 토글 */}
          <div className="absolute inset-0 cursor-pointer" onClick={toggleSelect}>
            {/* 중앙 점 — 선택 시 #1F2124, 미선택 시 gray-400 */}
            <span
              className={[
                'absolute w-4 h-4 rounded-full',
                centerSelected ? 'bg-[#1F2124]' : 'bg-[#B2B8BD]',
              ].join(' ')}
              style={{ left: `${selDot.x}px`, top: `calc(50% + ${selDot.y}px)`, transform: 'translate(-50%,-50%)' }}
            />
            {/* 중앙 박스 72×72 — 로고를 채우고, 고르기 전에는 색을 눌러 둔다 */}
            <span
              className="absolute h-[72px] w-[72px] rounded-lg bg-cover bg-center"
              style={{
                left: `${selBox.x}px`,
                top: `calc(50% + ${selBox.y}px)`,
                transform: 'translate(-50%,-50%)',
                backgroundImage: centerSelected
                  ? `url(${LOGOS[selected.name]})`
                  : `linear-gradient(0deg, ${DIM}, ${DIM}), linear-gradient(0deg, ${LOGO_VEIL}, ${LOGO_VEIL}), url(${LOGOS[selected.name]})`,
              }}
            />
            <span
              className={[
                'absolute whitespace-nowrap text-[32px] font-bold leading-[1.4] tracking-[-0.02em]',
                centerSelected ? 'text-[#1F2124]' : 'text-[#B2B8BD]',
              ].join(' ')}
              style={{ left: `${selLabel.x}px`, top: `calc(50% + ${selLabel.y}px)`, transform: 'translateY(-50%)' }}
            >
              {selected.name}
            </span>
          </div>
        </div>

        {/* 하단 CTA — 투명 래퍼(본문 비쳐보이게), 버튼만 반투명 z-10 */}
        <div className="relative z-10 w-full px-6 pt-3 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          {/* 다음 — 쇼핑몰 하나라도 선택되면 활성 (bg #1F2124 + #F6F7F8) */}
          <button
            type="button"
            disabled={!nextActive}
            onClick={
              nextActive
                ? () => {
                    setSelectedPlatforms(selectedName ? [selectedName] : []);
                    // 구매내역은 방식 선택 없이 앨범 업로드로 바로 간다
                    setReceiptMethod('album');
                    navigate('/closet/register/upload-guide');
                  }
                : undefined
            }
            className={[
              'w-full h-[58px] rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
              nextActive ? 'text-[#F6F7F8] cursor-pointer' : 'text-[#959BA7] cursor-not-allowed',
            ].join(' ')}
            style={{ backgroundColor: nextActive ? '#1F2124' : '#E6E8EA' }}
          >
            다음
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetPlatformPage;
