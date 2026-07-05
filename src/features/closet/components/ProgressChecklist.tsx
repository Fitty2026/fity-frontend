export type ChecklistStatus = 'done' | 'current' | 'pending';

export interface ChecklistStep {
  label: string;
  status: ChecklistStatus;
}

interface ProgressChecklistProps {
  steps: ChecklistStep[];
  className?: string;
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** 로딩 화면 하단 단계 체크리스트 (완료 / 진행중 / 대기) */
const ProgressChecklist = ({ steps, className = '' }: ProgressChecklistProps) => {
  return (
    <ul className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      {steps.map((step, i) => {
        const isPending = step.status === 'pending';
        return (
          <li key={i} className="flex items-center gap-2.5">
            <span
              className={[
                'flex items-center justify-center w-5 h-5 rounded-full shrink-0',
                step.status === 'done' ? 'bg-black text-white' : '',
                step.status === 'current' ? 'text-black' : '',
                isPending ? 'text-neutral-300' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {step.status === 'done' && <CheckIcon />}
              {step.status === 'current' && <SpinnerIcon />}
              {isPending && <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />}
            </span>
            <span
              className={[
                'text-sm',
                isPending ? 'text-neutral-400' : 'text-black font-medium',
              ].join(' ')}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ProgressChecklist;
