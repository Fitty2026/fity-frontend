import type { ClothingCategory } from '../types';

interface ClosetSummaryProps {
  counts: Record<ClothingCategory, number>;
  total?: number;
}

const CATEGORY_META: { key: ClothingCategory; label: string; icon: React.ReactNode }[] = [
  {
    key: 'top',
    label: '상의',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3l4 2 4-2 5 4-3 3v11H6V10L3 7l5-4z" />
      </svg>
    ),
  },
  {
    key: 'bottom',
    label: '하의',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l-1 18h-4l-1-9-1 9H6L5 3z" />
      </svg>
    ),
  },
  {
    key: 'shoes',
    label: '신발',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16v-4l6-6 3 3 4 2 7 2v3H2z" />
      </svg>
    ),
  },
  {
    key: 'etc',
    label: '기타',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    ),
  },
];

/**
 * 내 옷장 현황 — 카테고리별 보유 수량 요약.
 * 사용처: 내 옷장 홈.
 */
const ClosetSummary = ({ counts, total }: ClosetSummaryProps) => {
  const sum = total ?? Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-neutral-900">내 옷장 현황</span>
        <span className="text-xs text-neutral-400">전체 {sum}개</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {CATEGORY_META.map((c) => (
          <div key={c.key} className="flex flex-col items-center gap-1">
            <span className="text-neutral-700">{c.icon}</span>
            <span className="text-[11px] text-neutral-500">{c.label}</span>
            <span className="text-sm font-semibold text-neutral-900">{counts[c.key] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosetSummary;
