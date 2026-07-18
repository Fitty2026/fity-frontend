interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * 기준 아이템 선택 — 검색 필드 (알약형, 돋보기 아이콘)
 */
const SearchField = ({ value, onChange, placeholder = '검색어를 입력해주세요', className = '' }: SearchFieldProps) => {
  return (
    <label className={['flex items-center gap-2 h-11 px-4 rounded-full border border-[#D6DADF] bg-white', className].filter(Boolean).join(' ')}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#959BA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4.5" />
        <path d="m13.5 13.5-3.2-3.2" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent text-sm font-medium text-[#1F2124] placeholder:text-[#B2B8BD] outline-none"
      />
    </label>
  );
};

export default SearchField;
