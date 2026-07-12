/** 라벨 위치 — below: 이미지 아래 중앙(무드), overlay-bottom-left: 이미지 안 좌하단(아이템) */
export type LabelPosition = 'below' | 'overlay-bottom-left';

interface SelectableImageCardProps {
  /** 이미지 소스 */
  src: string;
  /** alt / 라벨 텍스트 */
  label?: string;
  selected?: boolean;
  onClick?: () => void;
  /** 이미지 비율. 무드=정사각 '1/1', 아이템=세로 '3/4' 등 화면별 지정 */
  aspectRatio?: string;
  /** 라벨 위치. 무드='below', 아이템='overlay-bottom-left' */
  labelPosition?: LabelPosition;
  /** 그리드 셀 크기는 부모가 결정 (w-full 등) */
  className?: string;
}

/** 선택 체크 — 검정 원 + 흰 체크 (Figma 에셋, ※ px 캡쳐로 확정 필요) */
const CheckBadge = () => (
  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6668 3.5L5.25016 9.91667L2.3335 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/**
 * 선택형 이미지 카드 — 무드 선택(MOOD-01) / 아이템 선택(ITEM-01) 공용
 * - 크기/비율은 컴포넌트가 안 정함: 폭은 부모 grid(w-full), 비율만 aspectRatio prop
 * - 라벨 위치만 labelPosition으로 분기 (below / overlay-bottom-left)
 * - 선택 시 이미지 중앙에 체크 배지 + 딤 오버레이
 * ※ 정확한 px(체크 크기, 라벨 폰트, radius)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const SelectableImageCard = ({
  src,
  label,
  selected = false,
  onClick,
  aspectRatio = '1/1',
  labelPosition = 'below',
  className = '',
}: SelectableImageCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['w-full text-left bg-transparent! p-0!', className].filter(Boolean).join(' ')}
    >
      {/* 이미지 영역 (radius 12, 선택 시 딤 + 중앙 체크) */}
      <div
        className="relative w-full overflow-hidden rounded-xl bg-[#EEEEEE]"
        style={{ aspectRatio }}
      >
        <img src={src} alt={label ?? ''} className="w-full h-full object-cover" />

        {/* 선택 오버레이 */}
        {selected && (
          <>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckBadge />
            </div>
          </>
        )}

        {/* 라벨 — 이미지 안 좌하단 (아이템) */}
        {label && labelPosition === 'overlay-bottom-left' && (
          <span className="absolute left-2 bottom-2 text-[10px] font-medium leading-none tracking-[0.5px] text-white uppercase">
            {label}
          </span>
        )}
      </div>

      {/* 라벨 — 이미지 아래 중앙 (무드) */}
      {label && labelPosition === 'below' && (
        <p className="mt-2 text-center text-sm font-medium leading-5 text-[#1A1C1C]">{label}</p>
      )}
    </button>
  );
};

export default SelectableImageCard;
