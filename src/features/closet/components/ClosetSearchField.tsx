/** 검색 돋보기 — 16×16, #959BA7 */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9995 13.9995L10.5349 10.5349M10.5349 10.5349C11.4726 9.59716 11.9994 8.32534 11.9994 6.99921C11.9994 5.67308 11.4726 4.40126 10.5349 3.46354C9.59716 2.52583 8.32534 1.99902 6.99921 1.99902C5.67308 1.99902 4.40126 2.52583 3.46354 3.46354C2.52583 4.40126 1.99902 5.67308 1.99902 6.99921C1.99902 8.32534 2.52583 9.59716 3.46354 10.5349C4.40126 11.4726 5.67308 11.9994 6.99921 11.9994C8.32534 11.9994 9.59716 11.4726 10.5349 10.5349Z" stroke="#959BA7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ClosetSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 옷장 공통 검색바 — 327×36, radius 32, border #959BA7. 좌측 돋보기 + 입력.
 */
const ClosetSearchField = ({ value, onChange, placeholder = '검색어를 입력해주세요' }: ClosetSearchFieldProps) => (
  <div className="flex h-9 items-center gap-2.5 rounded-[32px] border border-[#959BA7] bg-white py-2 pl-3 pr-3">
    <SearchIcon />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124] placeholder-[#B2B8BD] outline-none"
    />
  </div>
);

export default ClosetSearchField;
