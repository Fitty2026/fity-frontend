import { chipKey, type ChipKind, type OcrItem } from '../ocrItems';

/** 태그 삭제 X — 12×12 */
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L9 3M3 3L9 9" stroke="#34363C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface OcrItemRowProps {
  item: OcrItem;
  /** 수정 화면 여부 — 칩을 눌러 선택/삭제할 수 있다 */
  editable?: boolean;
  /** 선택된 칩 키 (수정 화면에서만) */
  selectedKey?: string | null;
  onSelectChip?: (key: string) => void;
  onDeleteChip?: (kind: ChipKind, index: number) => void;
}

// 칩 — Hug 26 높이, radius 32, border 1px #34363C(inner), padding 상하2/좌우8,
// 글자 Body/B7 (Pretendard 500 / 14px / lh160% / -2% / #34363C)
const CHIP_CLASS =
  'flex h-[26px] items-center gap-1 rounded-[32px] border border-[#34363C] px-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C]';

/**
 * OCR 인식 결과 한 줄 — 좌측 상품 이미지 + 우측 칩(카테고리/세부/브랜드/해시태그/색상).
 * 수정 화면에서는 칩을 눌러 선택(회색) → X로 삭제.
 * ※ 이미지 크기·칩 간격은 시안에서 잰 값 (정확한 스펙 확인 대기)
 */
const OcrItemRow = ({ item, editable = false, selectedKey, onSelectChip, onDeleteChip }: OcrItemRowProps) => {
  const renderChip = (label: string, kind: ChipKind, index = 0) => {
    if (!label) return null;
    if (!editable) {
      return (
        <span key={chipKey(item.id, kind, index)} className={CHIP_CLASS}>
          {label}
        </span>
      );
    }

    const key = chipKey(item.id, kind, index);
    const selected = selectedKey === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onSelectChip?.(key)}
        className={`${CHIP_CLASS} cursor-pointer transition-colors ${selected ? 'bg-[#B2B8BD]' : 'bg-white'}`}
      >
        {label}
        {selected && (
          <span
            role="button"
            aria-label={`${label} 삭제`}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChip?.(kind, index);
            }}
          >
            <XIcon />
          </span>
        )}
      </button>
    );
  };

  return (
    // 이미지 ↔ 칩 영역 16
    <div className="flex gap-4">
      {/* 상품 이미지 104×134, radius 8, border 1px #E6E8EA (inner) */}
      <div className="h-[134px] w-[104px] shrink-0 overflow-hidden rounded-lg border border-[#E6E8EA]">
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      </div>

      {/* 칩 — 카테고리/세부, 브랜드, 해시태그, 색상 순으로 줄바꿈. 옆 칩과 4, 위아래 줄과 8 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {renderChip(item.category, 'category')}
          {renderChip(item.subCategory, 'subCategory')}
        </div>
        <div className="flex flex-wrap gap-1">{renderChip(item.brand, 'brand')}</div>
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag, index) => renderChip(tag, 'tag', index))}
        </div>
        {/* 색상 스와치 24×24, border 1px #34363C */}
        <div className="flex gap-1">
          {item.colors.map((color) => (
            <span
              key={color}
              className="h-6 w-6 rounded-full border border-[#34363C]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OcrItemRow;
