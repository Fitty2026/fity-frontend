import ProgressBar from './ProgressBar';
import ProgressChecklist, { type ChecklistStep } from './ProgressChecklist';

interface ImportLoadingViewProps {
  title: string;
  subtitle?: string;
  percent: number;
  progressLabel?: string;
  steps: ChecklistStep[];
  /** 하단 안내 문구 (예: "분석이 끝나면요, 곧 완료돼요.") */
  note?: string;
}

const LoopIcon = () => (
  <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/**
 * DAT-03 로딩 화면 공통 뷰
 * - 옷장 불러오는 중 / 옷 분석하는 중 등에 재사용
 */
const ImportLoadingView = ({
  title,
  subtitle,
  percent,
  progressLabel = '진행',
  steps,
  note,
}: ImportLoadingViewProps) => {
  return (
    <div className="flex flex-col items-center px-6 pt-16">
      {/* 회전 아이콘 */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full border border-neutral-200 text-black mb-6">
        <LoopIcon />
      </div>

      <h2 className="text-lg font-bold text-black text-center">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-sm text-neutral-500 text-center whitespace-pre-line">{subtitle}</p>
      )}

      {/* 진행바 */}
      <div className="w-full mt-8">
        <ProgressBar percent={percent} label={progressLabel} />
      </div>

      {/* 체크리스트 카드 */}
      <div className="w-full mt-6 p-4 bg-neutral-50 rounded-2xl">
        <ProgressChecklist steps={steps} />
      </div>

      {note && <p className="mt-6 text-xs text-neutral-400 text-center">{note}</p>}
    </div>
  );
};

export default ImportLoadingView;
