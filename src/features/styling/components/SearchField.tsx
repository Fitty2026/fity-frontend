interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * 기준 아이템 선택 — 검색 필드
 * - Figma: 327×36, radius32, border 1px #959BA7, pad 좌12, 아이콘↔텍스트 8
 * - placeholder: Pretendard 500 / 12px / lh165% / -2% / #B2B8BD
 */
const SearchField = ({ value, onChange, placeholder = '검색어를 입력해주세요', className = '' }: SearchFieldProps) => {
  return (
    <label className={['flex items-center gap-2 h-[36px] pl-3 pr-2 rounded-[32px] border border-[#959BA7] bg-white', className].filter(Boolean).join(' ')}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M13.9995 13.9995L10.5349 10.5349M10.5349 10.5349C11.4726 9.59716 11.9994 8.32534 11.9994 6.99921C11.9994 5.67308 11.4726 4.40126 10.5349 3.46354C9.59716 2.52583 8.32534 1.99902 6.99921 1.99902C5.67308 1.99902 4.40126 2.52583 3.46354 3.46354C2.52583 4.40126 1.99902 5.67308 1.99902 6.99921C1.99902 8.32534 2.52583 9.59716 3.46354 10.5349C4.40126 11.4726 5.67308 11.9994 6.99921 11.9994C8.32534 11.9994 9.59716 11.4726 10.5349 10.5349Z" stroke="#959BA7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124] placeholder:text-[#B2B8BD] outline-none"
      />
    </label>
  );
};

export default SearchField;
