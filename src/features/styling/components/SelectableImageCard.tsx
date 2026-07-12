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
  /** 이미지 박스에 추가 클래스 (예: border) */
  imageClassName?: string;
  /** 선택 시 이미지 박스 테두리 스타일 override (기본: 무드용 흰/검정 이중 링) */
  selectedFrameClassName?: string;
  /** 선택 체크 아이콘 크기 (무드 30 / 아이템 25) */
  checkSize?: number;
  /** 선택 딤 오버레이 스타일 (기본: 무드용 #000 40% + blur2 / 아이템은 blur 없음) */
  overlayClassName?: string;
}

/** 선택 체크 — 흰색 체크-원 (Figma 에셋, 무드 30 / 아이템 25) */
const CheckBadge = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.9 21.9L23.475 11.325L21.375 9.225L12.9 17.7L8.625 13.425L6.525 15.525L12.9 21.9ZM15 30C12.925 30 10.975 29.6063 9.15 28.8188C7.325 28.0312 5.7375 26.9625 4.3875 25.6125C3.0375 24.2625 1.96875 22.675 1.18125 20.85C0.39375 19.025 0 17.075 0 15C0 12.925 0.39375 10.975 1.18125 9.15C1.96875 7.325 3.0375 5.7375 4.3875 4.3875C5.7375 3.0375 7.325 1.96875 9.15 1.18125C10.975 0.39375 12.925 0 15 0C17.075 0 19.025 0.39375 20.85 1.18125C22.675 1.96875 24.2625 3.0375 25.6125 4.3875C26.9625 5.7375 28.0312 7.325 28.8188 9.15C29.6063 10.975 30 12.925 30 15C30 17.075 29.6063 19.025 28.8188 20.85C28.0312 22.675 26.9625 24.2625 25.6125 25.6125C24.2625 26.9625 22.675 28.0312 20.85 28.8188C19.025 29.6063 17.075 30 15 30Z" fill="white" />
  </svg>
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
  imageClassName = '',
  selectedFrameClassName = 'border-2 border-black shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#000000]',
  checkSize = 30,
  overlayClassName = 'bg-black/40 backdrop-blur-[2px]',
}: SelectableImageCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['w-full text-left bg-transparent! p-0!', className].filter(Boolean).join(' ')}
    >
      {/* 이미지 영역 (radius 12, 선택 시 딤 + 중앙 체크 + 2px 검정 테두리 + 흰/검정 이중 링) */}
      <div
        className={[
          'relative w-full overflow-hidden rounded-xl bg-[#EEEEEE]',
          selected ? selectedFrameClassName : imageClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ aspectRatio }}
      >
        <img src={src} alt={label ?? ''} className="w-full h-full object-cover" />

        {/* 선택 오버레이 — Figma: #000 40% + background blur 2 */}
        {selected && (
          <>
            <div className={`absolute inset-0 ${overlayClassName}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckBadge size={checkSize} />
            </div>
          </>
        )}

        {/* 라벨 — 이미지 안 좌하단 필 (아이템). Figma: bg #FFF 90% / radius4 / padding4·8 / blur4 /
            Epilogue 400 / 10 / lh15 / tracking 0.5px / uppercase / #1A1C1C, 위치 left8·bottom8 */}
        {label && labelPosition === 'overlay-bottom-left' && (
          <span className="absolute left-2 bottom-2 inline-flex items-center py-1 px-2 rounded-[4px] bg-white/90 backdrop-blur-[4px] font-['Epilogue'] text-[10px] font-normal leading-[15px] tracking-[0.5px] uppercase text-[#1A1C1C]">
            {label}
          </span>
        )}
      </div>

      {/* 라벨 — 이미지 아래 중앙 (무드). Figma: Pretendard 500 / 12 / lh16 / tracking 1.2px / uppercase / #000 */}
      {label && labelPosition === 'below' && (
        <p className="mt-2 text-center text-xs font-medium leading-4 tracking-[1.2px] uppercase text-black">{label}</p>
      )}
    </button>
  );
};

export default SelectableImageCard;
