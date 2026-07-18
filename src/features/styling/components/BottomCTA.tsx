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
    <div className={['shrink-0 px-5 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          'w-full h-14 rounded-full text-base font-semibold transition-colors',
          disabled
            ? 'bg-[#E9EBEE] text-[#B2B8BD]'
            : 'bg-[#1F2124] text-white active:bg-black',
        ].join(' ')}
      >
        {label}
      </button>
    </div>
  );
};

export default BottomCTA;
