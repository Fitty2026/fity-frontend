interface HangerIconProps {
  state: 'loading' | 'done';
}

const HANGER_PATH =
  'M32 10a6 6 0 1 1 6 6c-2.6.8-4 2.4-4 5v2.2L59.5 40A4 4 0 0 1 57 47H7a4 4 0 0 1-2.5-7L29 23.2';

/**
 * 체형 분석 옷걸이 아이콘.
 * loading: 회색 옷걸이 위로 보라 stroke가 차오르는 애니메이션
 * done: 전체 보라 + 중앙 체크
 */
const HangerIcon = ({ state }: HangerIconProps) => (
  <div className="relative">
    <svg width="160" height="140" viewBox="0 0 64 56" fill="none">
      {/* 회색 베이스 */}
      <path
        d={HANGER_PATH}
        stroke={state === 'done' ? '#a78bfa' : '#e5e5e5'}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 차오르는 보라 stroke */}
      {state === 'loading' && (
        <path
          d={HANGER_PATH}
          stroke="#a78bfa"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={240}
          strokeDasharray={240}
          style={{ animation: 'hanger-fill 2.4s ease-in-out infinite' }}
        />
      )}
    </svg>
    {state === 'done' && (
      <span className="absolute left-1/2 top-[62%] flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-neutral-50 shadow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
          <path d="M5 12l5 5L19 7" />
        </svg>
      </span>
    )}
  </div>
);

export default HangerIcon;
