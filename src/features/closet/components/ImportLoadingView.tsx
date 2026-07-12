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

/** 회전 로딩 아이콘 — Figma 에셋 (20×20) */
const LoopIcon = () => (
  <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.0961609 19.1826V17.3077H3.75002L2.84134 16.4375C1.8141 15.4871 1.08373 14.4234 0.65024 13.2464C0.216747 12.0693 0 10.8798 0 9.67786C0 7.51761 0.632608 5.58052 1.89782 3.86658C3.16304 2.15265 4.82208 0.975967 6.87495 0.33654V2.31245C5.36694 2.9022 4.1566 3.86815 3.24394 5.2103C2.33128 6.55245 1.87495 8.04164 1.87495 9.67786C1.87495 10.6554 2.06005 11.6049 2.43024 12.5264C2.80044 13.4479 3.37656 14.2997 4.15862 15.0817L4.95192 15.875V12.4519H6.82687V19.1826H0.0961609ZM12.5 18.8461V16.8702C14.008 16.2804 15.2184 15.3145 16.131 13.9723C17.0437 12.6302 17.5 11.141 17.5 9.50478C17.5 8.52721 17.3149 7.57769 16.9447 6.65621C16.5745 5.73473 15.9984 4.88297 15.2163 4.10091L14.423 3.30761V6.73071H12.5481V0H19.2788V1.87495H15.6249L16.5336 2.74518C17.5224 3.73396 18.2431 4.80727 18.6959 5.96512C19.1486 7.12297 19.375 8.30286 19.375 9.50478C19.375 11.665 18.7423 13.6021 17.4771 15.316C16.2119 17.03 14.5529 18.2067 12.5 18.8461Z" fill="black"/>
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
    <div className="flex flex-col items-center w-full">
      {/* 회전 아이콘 — 3중 동심원 (바깥96 #CFC4C5/20, 중간80 #7E7576/40, 안쪽64 흰색+그림자) */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full border border-[#CFC4C5]/20 mb-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full border border-[#7E7576]/40">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <LoopIcon />
          </div>
        </div>
      </div>

      <h2 className="text-[28px] font-medium leading-10 tracking-[-0.8px] text-center text-[#1A1C1C]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm font-medium leading-5 text-center text-[#5E5E5E] whitespace-pre-line">
          {subtitle}
        </p>
      )}

      {/* 진행바 (서브텍스트↔섹션 gap 48) */}
      <div className="w-full mt-12">
        <ProgressBar percent={percent} label={progressLabel} />
      </div>

      {/* 체크리스트 카드 (Figma: radius12, border 1px #E2E2E2, padding24, shadow) */}
      <div className="w-full mt-12 p-6 rounded-xl border border-[#E2E2E2] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <ProgressChecklist steps={steps} />
      </div>

      {note && (
        <p className="mt-[72px] text-xs font-medium leading-4 text-center text-[#4C4546]">{note}</p>
      )}
    </div>
  );
};

export default ImportLoadingView;
