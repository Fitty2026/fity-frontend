interface BottomCTAProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 하단 고정 CTA 컨테이너.
 * 스크롤 영역의 형제로 배치해 화면 하단에 고정한다. (sticky/absolute 사용 안 함)
 * iOS safe-area 하단 여백 포함.
 */
const BottomCTA = ({ children, className = '' }: BottomCTAProps) => {
  return (
    <div
      className={[
        'w-full bg-white px-5 pt-3',
        'pb-[calc(20px+env(safe-area-inset-bottom,0px))]',
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
