import type { ReactNode } from 'react';

/** 시트에 늘어놓을 줄 하나 */
interface SheetOption {
  key: string;
  icon: ReactNode;
  label: string;
  onSelect: () => void;
}

interface PhotoSourceSheetProps {
  open: boolean;
  onClose: () => void;
  /** 가운데 타이틀 */
  title: string;
  options: SheetOption[];
}

/**
 * 사진을 어디서 가져올지 고르는 하단 시트 — 375×294, radius 상단 56, bg #F6F7F8 (Figma).
 * 높이 검산: 32(pt) + 30(타이틀) + 40(gap) + 80×2(줄) + 40(pb) = 302.
 * 시안 표기는 294지만 바닥에 붙는 시트라 내용 높이를 그대로 쓴다.
 *
 * 옷 사진 추가·재업로드 방식 선택이 같은 모양이라 공통으로 쓴다.
 */
const PhotoSourceSheet = ({ open, onClose, title, options }: PhotoSourceSheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-center" onClick={onClose}>
      <div className="relative w-full max-w-[430px]">
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-10 rounded-t-[56px] bg-[#F6F7F8] pt-8 pb-10"
          style={{ boxShadow: '0 -1px 16px 0 rgba(0,0,0,0.16)' }}
          onClick={(event) => event.stopPropagation()}
        >
          {/* Title/T3 */}
          <p className="w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            {title}
          </p>

          {/* 줄 80 — padding 24/14/24/24, 아이콘↔라벨 40, 위 구분선 1 */}
          <div className="flex w-full flex-col">
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={option.onSelect}
                className="flex h-20 w-full cursor-pointer items-center gap-10 border-t border-[#E6E8EA] py-6 pl-6 pr-[14px] text-left"
              >
                <span className="shrink-0">{option.icon}</span>
                {/* Body/B1 */}
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSourceSheet;
