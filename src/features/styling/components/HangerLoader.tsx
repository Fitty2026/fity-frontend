// 옷걸이 중심선(stroke) — 옷장 '분석하고 있어요' 로더와 동일한 path (viewBox 0 0 64 56 기준)
const HANGER_PATH =
  'M32 10a6 6 0 1 1 6 6c-2.6.8-4 2.4-4 5v2.2L59.5 40A4 4 0 0 1 57 47H7a4 4 0 0 1-2.5-7L29 23.2';

const GRAY = '#CED1D5';
const ACCENT = '#9D98F0';

interface HangerLoaderProps {
  /** 진행도 0~1 (고리→몸통 순서로 그려짐). 1이면 완료(체크 표시) */
  progress: number;
  className?: string;
}

/**
 * 코디 생성 — 옷걸이 로더 (189×160)
 * - 회색 옷걸이 선 위로 보라(#9D98F0)가 고리부터 stroke로 그려짐 (옷장 분석 로더와 동일 형태)
 * - progress 1 도달 시 체크 표시 (※ 체크 에셋 미수급 — 자작 근사, 에셋 오면 교체)
 */
const HangerLoader = ({ progress, className = '' }: HangerLoaderProps) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const done = clamped >= 1;

  return (
    <div className={`relative mx-auto h-[160px] w-[189px] ${className}`}>
      {/* overflow-visible — 선 굵기(5)의 절반이 viewBox 경계 밖으로 나가 양 끝이 잘리던 것을 넘치게 둔다 */}
      <svg
        width="189"
        height="160"
        viewBox="2 3.5 60 46"
        className="overflow-visible"
        fill="none"
        role="img"
        aria-label={done ? '코디 완성' : '코디 생성 중'}
      >
        {/* 회색 베이스 */}
        <path d={HANGER_PATH} stroke={GRAY} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {/* 보라 — 고리부터 progress만큼 그려짐 */}
        <path
          d={HANGER_PATH}
          stroke={ACCENT}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 * (1 - clamped)}
        />
      </svg>
      {/* 완성 체크 — 48×48, 옷걸이 박스 내 (71, 92) */}
      {done && (
        <div className="absolute" style={{ left: 71, top: 92 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#F6F7F8" />
            <path d="M13 25L21.8 33L35 15" stroke="#1F2124" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default HangerLoader;
