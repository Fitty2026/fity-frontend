import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useOnboardingStore from '@/store/onboardingStore';
import useClosetStore, { receiptProducts } from '@/store/closetStore';

// 캐러셀 슬롯 — 중앙(155×200 정면) + 좌/우(126×152 기울임). offset(=i-active)별 위치.
type Slot = { left: string; top: number; w: number; h: number; rot: number; z: number; op: number };
const slotFor = (offset: number): Slot => {
  if (offset === 0) return { left: '50%', top: 100, w: 155, h: 200, rot: 0, z: 30, op: 1 };
  if (offset === -1) return { left: 'calc(50% - 172.21px)', top: 155.22, w: 126, h: 152, rot: -13, z: 20, op: 1 };
  if (offset === 1) return { left: 'calc(50% + 177.89px)', top: 153.66, w: 126, h: 152, rot: 11, z: 20, op: 1 };
  // ±2 이상은 슬롯 밖으로 밀고 숨김 (스와이프 시 자연스럽게 슬라이드 인/아웃)
  const far = offset < 0 ? 'calc(50% - 300px)' : 'calc(50% + 305px)';
  return { left: far, top: 155, w: 126, h: 152, rot: offset < 0 ? -13 : 11, z: 10, op: 0 };
};

/**
 * 완료 체크 배지 48×48 — 등장 시 연회색(원 #F6F7F8 / 체크 #1F2124),
 * 이어서 반전 상태(원 #1F2124 / 체크 #F6F7F8)로 전환.
 */
const CheckBadge = ({ filled }: { filled: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1461_116178)">
      <circle
        cx="24"
        cy="24"
        r="24"
        style={{ fill: filled ? '#1F2124' : '#F6F7F8', transition: 'fill 300ms ease' }}
      />
      <path
        d="M13 25L21.8 33L35 15"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: filled ? '#F6F7F8' : '#1F2124', transition: 'stroke 300ms ease' }}
      />
    </g>
    <defs>
      <clipPath id="clip0_1461_116178">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/**
 * 옷 추가 완료 — "옷이 추가되었어요" + 추가된 옷 캐러셀 + 옷장 보러가기/코디 시작하기.
 */
const ClosetAddedPage = () => {
  const navigate = useNavigate();
  // 이번 회차에 등록한 옷 사진 — 인식 성공분의 상품 사진을 등록한 순서대로 늘어놓는다
  const results = useClosetStore((state) => state.ocrResults);
  const addedItems = results
    .filter((result) => !result.failed)
    .flatMap((result) => receiptProducts(result))
    .map((product) => product.photo)
    .filter((photo): photo is string => Boolean(photo));
  // 시안 기준 초기 중앙은 두 번째 — 한 장뿐이면 그 한 장이 중앙
  const initialActive = addedItems.length > 1 ? 1 : 0;
  // 옷장 준비 완료 화면은 최초 1회만 — 처음이면 거기를 거쳐서 원래 누른 곳으로 이어간다
  const closetCompleteSeen = useOnboardingStore((state) => state.closetCompleteSeen);
  const leaveTo = (path: string) =>
    closetCompleteSeen
      ? navigate(path)
      : navigate('/closet/register/complete', { state: { next: path } });
  // 진입 1초 후 체크 배지 표시 → 다시 0.8초 후 반전(검정) 상태로 전환
  const [showCheck, setShowCheck] = useState(false);
  const [filledCheck, setFilledCheck] = useState(false);

  // 캐러셀 다이얼 — 스와이프/탭으로 추가된 옷 전체 순회
  const [active, setActive] = useState(initialActive);
  const dragStartX = useRef<number | null>(null);
  const dragged = useRef(false);

  const go = (next: number) => setActive((a) => Math.min(addedItems.length - 1, Math.max(0, next ?? a)));

  const onPointerDown = (e: PointerEvent) => {
    dragStartX.current = e.clientX;
    dragged.current = false;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (dx <= -40) { dragged.current = true; go(active + 1); } // 왼쪽으로 밀면 다음
    else if (dx >= 40) { dragged.current = true; go(active - 1); } // 오른쪽으로 밀면 이전
  };

  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showCheck) return;
    const t = setTimeout(() => setFilledCheck(true), 800);
    return () => clearTimeout(t);
  }, [showCheck]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* 로딩바 300/375, fill #9D98F0 */}
        <OnboardingTopBar progress={300 / 375} />

        {/* 안내 문구 — 로딩바 아래 52px, 20 SemiBold #1F2124 */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          옷이 추가되었어요
        </h1>

        {/* 체크 배지 — 타이틀 아래 24px, 중앙 (로딩바→106). 진입 1초 후 표시 (공간은 유지) */}
        <div className="mt-6 flex h-12 justify-center">
          {showCheck && <CheckBadge filled={filledCheck} />}
        </div>

        {/* 캐러셀 다이얼 — 좌우 스와이프/사이드 탭으로 추가된 옷 순회. 배지 아래 58px */}
        <div
          className="relative mt-[58px] h-[200px] touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {addedItems.map((src, i) => {
            const offset = i - active;
            const s = slotFor(offset);
            const isCenter = offset === 0;
            return (
              <img
                key={i}
                src={src}
                alt=""
                draggable={false}
                onClick={() => { if (!dragged.current && !isCenter) go(i); }}
                className="absolute rounded-2xl border border-[#E6E8EA] object-cover"
                style={{
                  left: s.left,
                  top: `${s.top}px`,
                  width: `${s.w}px`,
                  height: `${s.h}px`,
                  zIndex: s.z,
                  opacity: s.op,
                  transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                  transition: 'transform 300ms ease, left 300ms ease, top 300ms ease, opacity 300ms ease',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              />
            );
          })}
        </div>

        {/* 버튼 — 화면 바닥 고정, 바닥 여백 40 (간격 8) */}
        <div className="mt-auto flex flex-col gap-2 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => leaveTo('/closet')}
            className="w-full h-[58px] rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124] cursor-pointer"
          >
            옷장 보러가기
          </button>
          {/* 코디 시작하기 — 체크 반전과 함께 검정으로 전환. 코디 생성 시작 화면(타 파트)으로 이동 */}
          <button
            type="button"
            onClick={() => leaveTo('/styling')}
            className={`w-full h-[58px] rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] cursor-pointer transition-colors duration-300 ${
              filledCheck ? 'bg-[#1F2124] text-[#F6F7F8]' : 'bg-[#F6F7F8] text-[#1F2124]'
            }`}
          >
            코디 시작하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetAddedPage;
