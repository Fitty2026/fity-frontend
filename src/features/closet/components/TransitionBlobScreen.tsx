interface TransitionBlobScreenProps {
  /** 중앙 안내 문구 */
  message: string;
  /** blob 이미지 URL. 없으면 CSS 근사 blob 표시 */
  image?: string;
}

/**
 * 그라디언트 blob 전환 화면 — 문구 + 큰 blob(좌우 넘침, 회전).
 * 사용처: "거의 다 왔어요"(온보딩→옷장 진입), "Fitty를 이용할 준비가 다 됐어요".
 * 상단 바 아래 스크롤 영역(flex-1)에 배치 전제. 문구와 blob은 각각 독립 절대 배치.
 * 회전 CSS +10.38° = Figma -10.38°.
 */
const TransitionBlobScreen = ({ message, image }: TransitionBlobScreenProps) => {
  const blobStyle = {
    left: '50%',
    width: '108.71%',
    transform: 'translateX(-50%) rotate(10.38deg)',
  } as const;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      {/* blob (좌우 넘침 + 회전) */}
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute top-[183px] max-w-none select-none"
          style={blobStyle}
          draggable={false}
        />
      ) : (
        <div
          className="absolute top-[183px] aspect-square blur-2xl opacity-90"
          style={{
            ...blobStyle,
            background:
              'radial-gradient(circle at 35% 35%, #D8C9FF 0%, #C6E0FF 55%, #EBDBFF 100%)',
            borderRadius: '46% 54% 60% 40% / 52% 44% 56% 48%',
          }}
        />
      )}

      {/* 안내 문구 (독립 고정 배치) */}
      <p className="absolute top-[156px] left-1/2 -translate-x-1/2 w-full px-6 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
        {message}
      </p>
    </div>
  );
};

export default TransitionBlobScreen;
