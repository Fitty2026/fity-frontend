interface ScreenTitleProps {
  title: string;
  subtitle?: string;
  /** 중앙 정렬 기본. 좌측 정렬 화면(방식 선택)은 'left' */
  align?: 'center' | 'left';
  className?: string;
}

/**
 * 화면 상단 타이틀 + 서브타이틀
 * - 예: '코디가 필요한 날을 선택해주세요' / '자동으로 날씨를 반영해줘요'
 */
const ScreenTitle = ({ title, subtitle, align = 'center', className = '' }: ScreenTitleProps) => {
  return (
    <div className={[align === 'center' ? 'text-center' : 'text-left', className].filter(Boolean).join(' ')}>
      {/* Figma: Pretendard 600 / 20px / lh150% / -2% / #1F2124 */}
      <h1 className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124] whitespace-pre-line">{title}</h1>
      {subtitle && (
        // Figma: Pretendard 500 / 14px / lh160% / -2% / #5A6169 / center, 타이틀↔서브 2
        <p className="mt-0.5 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169] whitespace-pre-line">{subtitle}</p>
      )}
    </div>
  );
};

export default ScreenTitle;
