import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

const CX = -134; // 원 중심 x (화면 밖 좌측). 선택점(3시) = CX + R
const R = 244; // arc 라인 반지름
const DOT_R = 248; // 점 반지름
const BOX_R = 286; // 박스 중심 반지름
const LABEL_R = BOX_R + 24 + 8; // 라벨 왼쪽 모서리 = 박스 바깥(반지름+반) + 8px 간격
const SENS = 0.3; // 드래그 px당 회전(deg)

const NAMES = ['ABLY', 'ZIGZAG', 'MUSINSA', '29CM', 'W-CONCEPT'];
const SPACING = 21.7; // 슬롯 간 각도
const PERIOD = SPACING * NAMES.length; // 무한 루프 주기
const VISIBLE = 58; // 이 각도 이내만 렌더

const pos = (radius: number, angleDeg: number) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: radius * Math.sin(a) };
};

/** 슬롯 박스 — 48 rounded rect, 각도만큼 기울임, 채움은 슬롯 종류별 */
const SlotBox = ({
  angle,
  kind,
  gid,
}: {
  angle: number;
  kind: 'gray' | 'top' | 'bottom' | 'dark';
  gid: string;
}) => (
  <svg width="96" height="96" viewBox="0 0 96 96" style={{ overflow: 'visible', display: 'block' }}>
    <rect
      x="24"
      y="24"
      width="48"
      height="48"
      rx="8"
      transform={`rotate(${angle} 48 48)`}
      fill={kind === 'gray' ? '#B2B8BD' : kind === 'dark' ? '#1F2124' : `url(#${gid})`}
    />
    {kind !== 'gray' && kind !== 'dark' && (
      <defs>
        <linearGradient id={gid} x1="48" y1="14" x2="48" y2="82" gradientUnits="userSpaceOnUse">
          {kind === 'top' ? (
            <>
              <stop stopColor="white" />
              <stop offset="1" stopColor="#B2B8BD" />
            </>
          ) : (
            <>
              <stop stopColor="#B2B8BD" />
              <stop offset="1" stopColor="white" />
            </>
          )}
        </linearGradient>
      </defs>
    )}
  </svg>
);

/**
 * 쇼핑몰 플랫폼 선택 — 무한 회전 휠.
 * 세로 드래그로 회전. 슬롯(위치)별 박스: 중앙=검정 크게+이름 / 2·4번=회색 / 1·5번=그라데이션.
 * 로고는 루프(빈틈 없이 채움). (로고 에셋 미정 → 임시 박스)
 */
const ClosetPlatformPage = () => {
  const navigate = useNavigate();
  const setSelectedPlatforms = useClosetStore((state) => state.setSelectedPlatforms);
  const [rotation, setRotation] = useState(0);
  // 선택된 쇼핑몰 집합. 중앙(3시)에 온 쇼핑몰 클릭 시 토글. 하나라도 있으면 '다음' 활성
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
  const drag = useRef<{ startY: number; startRot: number } | null>(null);
  const moved = useRef(false); // 드래그로 움직였는지 (움직였으면 클릭 토글 무시)

  // 무한 루프: 각 로고 각도를 [-주기/2, 주기/2]로 wrap → 로고당 딱 1개, 중복 없음
  type Item = { key: string; name: string; angle: number };
  const items: Item[] = [];
  NAMES.forEach((name, i) => {
    const base = (i - 2) * SPACING + rotation;
    const angle = base - PERIOD * Math.round(base / PERIOD);
    if (Math.abs(angle) <= VISIBLE) items.push({ key: name, name, angle });
  });
  const selected = items.reduce(
    (best, it) => (Math.abs(it.angle) < Math.abs(best.angle) ? it : best),
    { key: '', name: NAMES[2], angle: 999 } as Item,
  );

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, startRot: rotation };
    moved.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // 중앙 쇼핑몰 선택 토글 (드래그 후 발생한 클릭은 무시)
  const toggleSelect = () => {
    if (moved.current) return;
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(selected.name)) next.delete(selected.name);
      else next.add(selected.name);
      return next;
    });
  };
  const centerSelected = selectedSet.has(selected.name);
  const nextActive = selectedSet.size > 0;
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

  const selPos = pos(R, selected.angle); // 선택 점은 arc 라인(R) 위 = 스펙(중심 110)

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
        <div className="relative z-20">
          <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />
        </div>

        <p className="relative z-20 mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          등록할 쇼핑몰을 선택해주세요
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
            const isSel = selectedSet.has(it.name); // 선택된 쇼핑몰 → 검정 표시
            const slot = Math.round(it.angle / SPACING);
            const edge = Math.abs(slot) >= 2;
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
            const label = pos(LABEL_R, it.angle);
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
                  <SlotBox angle={it.angle} kind={kind} gid={`grad-${it.key}`} />
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
          <div
            className="absolute cursor-pointer"
            style={{ left: `${selPos.x}px`, top: `calc(50% + ${selPos.y}px)` }}
            onClick={toggleSelect}
          >
            {/* 중앙 점 — 선택 시 #1F2124, 미선택 시 gray-400 */}
            <span
              className={[
                'absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full',
                centerSelected ? 'bg-[#1F2124]' : 'bg-gray-400',
              ].join(' ')}
            />
            {/* 중앙 박스 — 선택 시 #1F2124, 미선택 시 회색 */}
            <span
              className={[
                'absolute -translate-y-1/2 w-[72px] h-[72px] rounded-lg',
                centerSelected ? 'bg-[#1F2124]' : 'bg-[#B2B8BD]',
              ].join(' ')}
              style={{ left: 24 }}
            />
            <span
              className={[
                'absolute -translate-y-1/2 whitespace-nowrap text-[32px] font-bold leading-[1.4] tracking-[-0.02em]',
                centerSelected ? 'text-[#1F2124]' : 'text-[#B2B8BD]',
              ].join(' ')}
              style={{ left: 104 }}
            >
              {selected.name}
            </span>
          </div>
        </div>

        {/* 하단 흰색 페이드 — 본문을 흐릿하게 (버튼 뒤) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-linear-to-t from-white via-white/80 to-transparent" />

        {/* 하단 CTA — 투명 래퍼(본문 비쳐보이게), 버튼만 반투명 z-10 */}
        <div className="relative z-10 w-full px-6 pt-3 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          {/* 다음 — 쇼핑몰 하나라도 선택되면 활성 (bg #1F2124 + #F6F7F8) */}
          <button
            type="button"
            disabled={!nextActive}
            onClick={
              nextActive
                ? () => {
                    // 선택 순서 대신 휠 노출 순서 유지
                    setSelectedPlatforms(NAMES.filter((name) => selectedSet.has(name)));
                    navigate('/closet/register/permission');
                  }
                : undefined
            }
            className={[
              'w-full h-[58px] rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
              nextActive ? 'text-[#F6F7F8] cursor-pointer' : 'text-[#1F2124] cursor-not-allowed',
            ].join(' ')}
            style={{
              backgroundColor: nextActive ? '#1F2124' : 'rgba(31,33,36,0.04)',
              boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.08)',
            }}
          >
            다음
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetPlatformPage;
