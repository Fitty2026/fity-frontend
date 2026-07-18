interface RegisterOptionRowProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

/**
 * 아이콘 + 라벨 목록 행. 클릭 가능.
 * 사용처: 옷장 등록 방식 선택(앨범/카메라/쇼핑몰/영수증), 빈 옷장 홈 액션(옷 추가/쇼핑몰 연동).
 */
const RegisterOptionRow = ({ icon, label, onClick, className = '' }: RegisterOptionRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-3 w-full text-left px-4 py-4',
        'rounded-xl border border-neutral-200 bg-white',
        'hover:border-neutral-400 transition-colors cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="flex items-center justify-center w-6 h-6 shrink-0 text-neutral-700">
        {icon}
      </span>
      <span className="text-base font-medium text-neutral-900">{label}</span>
    </button>
  );
};

export default RegisterOptionRow;
