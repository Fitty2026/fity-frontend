import type { LoadingState } from '../types';

interface HangerLoaderProps {
  /** loading = 회색 진행중, done = 보라 + 체크 */
  state?: LoadingState;
  /** 아이콘 위 안내 문구 */
  message?: string;
}

/**
 * 옷걸이 로딩 인디케이터 — 진행중(회색) / 완료(보라 + 체크).
 * 사용처: 구매내역 불러오는 중 / 불러왔어요, 사진 분석 중.
 */
const HangerLoader = ({ state = 'loading', message }: HangerLoaderProps) => {
  const color = state === 'done' ? '#8B7BF7' : '#C7C7C7';

  return (
    <div className="flex flex-col items-center gap-8">
      {message && <p className="text-base text-neutral-700">{message}</p>}
      <div className="relative">
        <svg width="88" height="88" viewBox="0 0 96 96" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={state === 'loading' ? 'animate-pulse' : ''}>
          {/* 옷걸이 훅 */}
          <path d="M48 30c0-5 4-9 9-9s9 4 9 9c0 4-3 6-6 8l-12 8" />
          {/* 옷걸이 몸통 */}
          <path d="M48 47L14 70a2 2 0 001 4h66a2 2 0 001-4L48 47z" />
        </svg>
        {state === 'done' && (
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[35%]"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B7BF7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l5 5L20 6" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default HangerLoader;
