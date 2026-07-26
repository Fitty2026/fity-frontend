import type { LoadingState } from '../types';

// TODO(후속): 옷걸이 로더 정밀 구현 — 옷걸이 크기/비율, 체크 배지 위치,
// 그리기 애니메이션 타이밍을 시안과 픽셀 단위로 재정렬. 현재는 대략 맞춘 상태.

// 옷걸이 중심선(stroke) — body/analysis HangerIcon의 검증된 옷걸이 path 재사용.
// viewBox 0 0 64 56 기준. 고리(M32 10…)부터 시작해 몸통 순서로 그려짐.
const HANGER_PATH =
  'M32 10a6 6 0 1 1 6 6c-2.6.8-4 2.4-4 5v2.2L59.5 40A4 4 0 0 1 57 47H7a4 4 0 0 1-2.5-7L29 23.2';

/** 완료 체크 배지 48×48 — 원 #F6F7F8 + 체크 #1F2124 */
const CheckBadge = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#hanger-check-clip)">
      <circle cx="24" cy="24" r="24" fill="#F6F7F8" />
      <path d="M13 25L21.8 33L35 15" stroke="#1F2124" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="hanger-check-clip">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

interface HangerLoaderProps {
  /** loading = 그리는 중 / done = 완료(전체 보라 + 체크) */
  state?: LoadingState;
  /** 그리기 애니메이션 시간 (ms) */
  durationMs?: number;
}

/**
 * 옷걸이 로딩 인디케이터 — 회색 옷걸이 위로 보라(#9D98F0)가 고리부터 stroke로 그려짐.
 * 중심선 stroke를 두껍게(round cap/join) 그려 코너·이음새를 깔끔하게 처리.
 * 사용처: 구매내역 불러오는 중 / 사진 분석 중.
 */
const HangerLoader = ({ state = 'loading', durationMs = 2116.7 }: HangerLoaderProps) => (
  <div className="relative mx-auto h-[160px] w-[189px]">
    <style>{`@keyframes hangerDraw { to { stroke-dashoffset: 0; } }`}</style>
    <svg width="189" height="160" viewBox="2 3.5 60 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 회색 옷걸이 (배경) */}
      <path d={HANGER_PATH} stroke="#CED1D5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 보라 — 고리부터 dashoffset으로 그려짐 (완료 시 전체 보라) */}
      <path
        d={HANGER_PATH}
        stroke="#9D98F0"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        style={
          state === 'done'
            ? { strokeDasharray: 100, strokeDashoffset: 0 }
            : {
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: `hangerDraw ${durationMs}ms linear forwards`,
              }
        }
      />
    </svg>
    {/* 완료 체크 배지 — 옷걸이 박스 내 left 71 / top 92 */}
    {state === 'done' && (
      <div className="absolute" style={{ left: 71, top: 92 }}>
        <CheckBadge />
      </div>
    )}
  </div>
);

export default HangerLoader;
