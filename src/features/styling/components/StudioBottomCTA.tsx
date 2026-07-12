interface StudioBottomCTAProps {
  /** 버튼 텍스트 (예: '다음', '15스타로 코디 만들기') */
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  /** 라벨 좌측 아이콘 (예: 스타 아이콘) */
  leftIcon?: React.ReactNode;
  className?: string;
}

/**
 * 스튜디오(코디 생성) 하단 고정 CTA — 날짜/무드/아이템 화면 공용
 * - 검정 풀폭 버튼 1개. 세이프에어리어 하단 패딩 포함
 * - 3-layer 스켈레톤에서 스크롤 영역의 '형제'로 배치 (sticky/absolute 아님)
 * ※ 정확한 px(버튼 높이·radius·패딩)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const StudioBottomCTA = ({ label, onClick, disabled = false, leftIcon, className = '' }: StudioBottomCTAProps) => {
  return (
    <div
      className={[
        'w-full bg-white',
        'px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          'flex items-center justify-center gap-2 w-full h-14 rounded-lg',
          'text-base font-medium leading-6',
          'cursor-pointer',
          disabled ? 'bg-neutral-300! text-[#848484]' : 'bg-black! text-white',
        ].join(' ')}
      >
        {leftIcon}
        {label}
      </button>
    </div>
  );
};

export default StudioBottomCTA;
