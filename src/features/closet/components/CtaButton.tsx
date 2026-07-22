interface CtaButtonProps {
  label: string;
  onClick?: () => void;
  /** dark = 블랙 필(주 액션) / fill = 연회색 필(보조 액션) */
  variant?: 'dark' | 'fill';
  /** px 높이 (Figma: 58 기본, 상세 삭제하기만 64) */
  height?: 58 | 64;
}

/**
 * 옷장 화면 공통 CTA 버튼 — 327 풀폭, radius 32(풀 라운드).
 * dark: bg #1F2124 / 흰 글자, fill: bg #F6F7F8 / #1F2124 글자.
 */
const CtaButton = ({ label, onClick, variant = 'dark', height = 58 }: CtaButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full cursor-pointer rounded-full text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] ${
      height === 64 ? 'h-16' : 'h-[58px]'
    } ${variant === 'dark' ? 'bg-[#1F2124] text-white' : 'bg-[#F6F7F8] text-[#1F2124]'}`}
  >
    {label}
  </button>
);

export default CtaButton;
