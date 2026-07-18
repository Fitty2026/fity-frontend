import type { HangerStage } from '../types';

const GRAY = '#C7CCD1';
const ACCENT = '#A29AF0';

interface HangerLoaderProps {
  /** start: 전체 회색 / progress: 고리만 보라 / done: 전체 보라 + 체크 */
  stage: HangerStage;
  className?: string;
}

/**
 * 코디 생성 — 대형 옷걸이 로더
 * - '코디를 만들고 있어요'(start → progress) → '코디가 완성되었어요'(done)
 */
const HangerLoader = ({ stage, className = '' }: HangerLoaderProps) => {
  const bodyColor = stage === 'done' ? ACCENT : GRAY;
  const hookColor = stage === 'start' ? GRAY : ACCENT;

  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 180 150"
      fill="none"
      className={className}
      role="img"
      aria-label={stage === 'done' ? '코디 완성' : '코디 생성 중'}
    >
      {/* 몸통 (삼각형) */}
      <path
        d="M90 50 L166 124 H14 Z"
        stroke={bodyColor}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 고리 */}
      <path
        d="M90 50 V42 A17 17 0 1 1 107 25"
        stroke={hookColor}
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* 완성 체크 */}
      {stage === 'done' && (
        <g>
          <circle cx="90" cy="124" r="15" fill="#F6F7F8" />
          <path
            d="M83.5 124 L88 128.5 L96.5 119.5"
            stroke="#1F2124"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
};

export default HangerLoader;
