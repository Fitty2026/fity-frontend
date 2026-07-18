interface BottomCTAProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 화면 하단 고정 CTA — 검정 알약 버튼 ('다음' / '확인' / '88 퍼즐로 코디 생성하기')
 * - disabled: 연회색 배경 + 회색 텍스트
 */
const BottomCTA = ({ label, onClick, disabled = false, className = '' }: BottomCTAProps) => {
  return (
    <div className={['shrink-0 px-6 pt-3 pb-[calc(40px+env(safe-area-inset-bottom))]', className].filter(Boolean).join(' ')}>
      {/* Figma: 327×58, radius32, bg #1F2124 (좌우 inset 24) */}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          // 텍스트: Pretendard 600 / 16px / lh160% / -2% / #F6F7F8
          'w-full h-[58px] rounded-[32px] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] transition-colors',
          disabled
            ? 'bg-[#E6E8EA] text-[#B2B8BD]'
            : 'bg-[#1F2124] text-[#F6F7F8] active:bg-black',
        ].join(' ')}
      >
        {label}
      </button>
    </div>
  );
};

export default BottomCTA;
