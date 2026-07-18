interface BlobGraphicProps {
  className?: string;
}

/**
 * 홀로그램 블롭 그래픽 (홈 히어로 / 방식 선택 배경)
 * - 실제 에셋 수급 전 CSS 그라데이션 근사 placeholder — 에셋 오면 <img>로 교체
 */
const BlobGraphic = ({ className = '' }: BlobGraphicProps) => {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        borderRadius: '58% 42% 55% 45% / 52% 58% 42% 48%',
        background:
          'radial-gradient(circle at 30% 30%, #E8D9F5 0%, #B8A7F0 35%, #8FA3E8 60%, #D9B8E8 85%)',
        filter: 'blur(0.5px)',
        boxShadow: 'inset -12px -14px 30px rgba(255,255,255,0.55), inset 10px 12px 24px rgba(120,100,220,0.25)',
      }}
    />
  );
};

export default BlobGraphic;
