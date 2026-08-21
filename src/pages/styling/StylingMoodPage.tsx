import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudioHeader, ScreenTitle, BottomCTA } from '@/features/styling/components';
import useStudioBack from '@/features/styling/hooks/useStudioBack';
import { SITUATION_VALUE, type SituationOption, type OutfitJobInput } from '@/features/styling/types';
import dateImg from '@/assets/images/styling/situation-date.png';
import workImg from '@/assets/images/styling/situation-work.png';
import travelImg from '@/assets/images/styling/situation-travel.png';
import schoolImg from '@/assets/images/styling/situation-school.jpg';

/** 상황 목록 — 좌 여행 / 중앙 출근 / 우 데이트 순은 와이어프레임 기준, 학교는 뒤에 추가 */
const SITUATIONS: SituationOption[] = [
  { id: 'travel', label: '여행', image: travelImg },
  { id: 'work', label: '출근', image: workImg },
  { id: 'date', label: '데이트', image: dateImg },
  { id: 'school', label: '학교', image: schoolImg },
];

const SWIPE_THRESHOLD = 50;

/** 앞 화면(날짜·날씨)에서 넘어오는 값 */
type StylingRequestState = Partial<OutfitJobInput>;

/**
 * 상황 선택 (데이트/출근/학교/여행)
 * - 1단계: 카드 캐러셀(중앙 155×200, 좌우 기울어져 잘림) + 다음
 * - 2단계(확정): 카드 1장 + 라벨 + 확인 → 기준 아이템 선택
 * - 스와이프(드래그)·좌우 카드 탭으로 전환
 * ※ 세부 px/타이포는 Figma 스펙으로 확정 예정 (스캐폴드)
 */
const StylingMoodPage = () => {
  const navigate = useNavigate();
  const goBack = useStudioBack();
  const { state } = useLocation() as { state: StylingRequestState | null };
  const [active, setActive] = useState(1);
  const [confirming, setConfirming] = useState(false);
  const dragStartX = useRef<number | null>(null);

  /** 앞 화면에서 받은 날짜·날씨에 상황을 얹어 넘긴다 (건너뛰면 상황 없이) */
  const goItems = (situationId?: string) =>
    navigate('/styling/items', {
      state: { ...state, situation: situationId ? SITUATION_VALUE[situationId] : undefined },
    });

  const clamp = (i: number) => Math.max(0, Math.min(SITUATIONS.length - 1, i));

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (delta < -SWIPE_THRESHOLD) setActive((i) => clamp(i + 1));
    else if (delta > SWIPE_THRESHOLD) setActive((i) => clamp(i - 1));
  };

  const selected = SITUATIONS[active];

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col overflow-hidden">
        <StudioHeader
          onBack={() => (confirming ? setConfirming(false) : goBack())}
          onSkip={() => goItems()}
        />

        <div className="flex-1 pt-14">
          {/* 헤더↔타이틀 56 (날짜 선택과 동일) */}
          <ScreenTitle
            title="코디가 필요한 상황을 선택해주세요"
            subtitle="자동으로 장소의 분위기를 반영해줘요"
          />

          {confirming ? (
            /* 2단계 — 확정 뷰: 카드 155×200 (서브↔카드 107, 캐러셀 중앙과 동일 위치) + 라벨 (카드↔라벨 31) */
            <div className="mt-[107px] flex flex-col items-center gap-[31px]">
              <div className="w-[155px] h-[200px] overflow-hidden rounded-2xl">
                <img src={selected.image} alt={selected.label} className="w-full h-full object-cover" />
              </div>
              {/* Pretendard 600 / 24px / lh150% / -2% / #1F2124 */}
              <p className="text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-center text-[#1F2124]">
                {selected.label}
              </p>
            </div>
          ) : (
            /* 1단계 — 캐러셀: 중앙 155×200 (헤더↔카드 217 → 서브 아래 107) + 좌우 기울어진 카드 */
            <>
            <div
              className="relative mt-[107px] h-[220px] select-none touch-pan-y"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {SITUATIONS.map((s, i) => {
                const rel = i - active;
                if (Math.abs(rel) > 1) return null;
                const isCenter = rel === 0;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => !isCenter && setActive(i)}
                    className={[
                      'absolute top-0 left-1/2 w-[155px] h-[200px] overflow-hidden rounded-2xl transition-transform duration-300',
                      isCenter ? 'z-10' : 'z-0',
                    ].join(' ')}
                    style={{
                      /* 좌우 대칭 (왼쪽 기준): Δx ∓232.72 / Δy +20 / rot ∓12° */
                      transform: isCenter
                        ? 'translateX(-50%)'
                        : `translateX(calc(-50% + ${rel * 232.72}px)) rotate(${rel * 12}deg) translateY(40px)`,
                    }}
                  >
                    <img src={s.image} alt={s.label} className="w-full h-full object-cover pointer-events-none" />
                    {/* 사이드 카드 어둡게 — #1F2124 그라데이션 (불투명도 근사 40%) */}
                    {!isCenter && (
                      <span className="absolute inset-0 bg-linear-to-b from-[#1F2124]/40 to-transparent pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* 중앙 카드 라벨 — 그림만으로 상황을 유추하기 어려워 고르기 전에도 이름을 보여준다.
                확정 뷰와 같은 타이포, 카드 아래 31(220-200=20 + 11)로 위치도 맞춘다 */}
            <p className="mt-[11px] text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-center text-[#1F2124]">
              {selected.label}
            </p>
            </>
          )}
        </div>

        <BottomCTA
          label={confirming ? '확인' : '다음'}
          onClick={() => (confirming ? goItems(selected.id) : setConfirming(true))}
        />
      </div>
    </div>
  );
};

export default StylingMoodPage;
