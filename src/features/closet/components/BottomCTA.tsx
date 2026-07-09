interface BottomCTAProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 화면 하단 고정 CTA 영역
 * - 버튼 1개 또는 세로 스택으로 여러 개 배치
 * - 세이프에어리어 하단 패딩 포함
 * - app-container(max-w-430) 기준으로 붙음
 */
const BottomCTA = ({ children, className = '' }: BottomCTAProps) => {
  return (
    <div
      className={[
        'w-full bg-white',
        // Figma: Fixed Bottom Button Section — padding 20px, border-top 1px #F5F5F5
        'px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
        'flex flex-col gap-2',
        'border-t border-[#F5F5F5]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default BottomCTA;
