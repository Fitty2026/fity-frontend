interface TransitionBlobScreenProps {
  /** 중앙 안내 문구 */
  message: string;
  /** blob 이미지 URL. 없으면 CSS 근사 blob 표시 */
  image?: string;
  /** blob을 꿀렁이게 + 점점 커지게 움직인다 */
  animated?: boolean;
}

/** 꿀렁임 필터 id — 한 화면에 하나만 쓰므로 고정값 */
const WOBBLE_FILTER_ID = 'closet-blob-wobble';

/**
 * blob 꿀렁임 — 노이즈로 이미지를 밀어내고(feDisplacementMap), 노이즈 자체를 흔들어
 * 형태가 불규칙하게 변하게 한다. baseFrequency를 흔들면 결이, scale은 밀어내는 세기다.
 */
const WobbleFilter = () => (
  <svg className="absolute h-0 w-0" aria-hidden>
    <defs>
      <filter id={WOBBLE_FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.008" numOctaves="2" seed="7" result="noise">
          <animate
            attributeName="baseFrequency"
            dur="14s"
            values="0.006 0.008; 0.009 0.006; 0.005 0.009; 0.006 0.008"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G">
          <animate attributeName="scale" dur="11s" values="6; 11; 7; 6" repeatCount="indefinite" />
        </feDisplacementMap>
      </filter>
    </defs>
  </svg>
);

/**
 * 그라디언트 blob 전환 화면 — 문구 + 큰 blob(좌우 넘침, 회전).
 * 사용처: "거의 다 왔어요"(온보딩→옷장 진입), "Fitty를 이용할 준비가 다 됐어요".
 * 상단 바 아래 스크롤 영역(flex-1)에 배치 전제. 문구와 blob은 각각 독립 절대 배치.
 * 회전 CSS +10.38° = Figma -10.38°.
 */
const TransitionBlobScreen = ({ message, image, animated = false }: TransitionBlobScreenProps) => {
  const blobStyle = {
    left: '50%',
    width: '108.71%',
    transform: 'translateX(-50%) rotate(10.38deg)',
  } as const;

  // 하이라이트는 blob 모양으로 잘라내고 같은 필터로 함께 일그러뜨려야 한 덩어리로 보인다
  const sheenBase = image
    ? ({
        WebkitMaskImage: `url(${image})`,
        maskImage: `url(${image})`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        filter: `url(#${WOBBLE_FILTER_ID})`,
        backgroundSize: '200% 200%',
      } as const)
    : undefined;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      {animated && <WobbleFilter />}
      {animated && (
        <style>{`
          @keyframes closetBlobGrow {
            from { transform: translateX(-50%) rotate(10.38deg) scale(0.95); }
            to   { transform: translateX(-50%) rotate(10.38deg) scale(1.04); }
          }
          /* 빛이 표면을 훑고 지나가는 느낌 — 두 층의 주기를 어긋나게 둔다 */
          @keyframes closetBlobSheenA {
            0%   { background-position: 10% 20%; }
            50%  { background-position: 85% 70%; }
            100% { background-position: 10% 20%; }
          }
          @keyframes closetBlobSheenB {
            0%   { background-position: 80% 75%; }
            50%  { background-position: 20% 25%; }
            100% { background-position: 80% 75%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .closet-blob-animated { animation: none !important; filter: none !important; }
          }
        `}</style>
      )}

      {/* blob (좌우 넘침 + 회전) */}
      {image ? (
        <div
          className={animated ? 'closet-blob-animated absolute top-[183px] max-w-none' : 'absolute top-[183px] max-w-none'}
          style={
            animated
              ? { ...blobStyle, animation: 'closetBlobGrow 6s ease-out forwards' }
              : blobStyle
          }
        >
          <img
            src={image}
            alt=""
            className={animated ? 'closet-blob-animated block w-full select-none' : 'block w-full select-none'}
            style={animated ? { filter: `url(#${WOBBLE_FILTER_ID})` } : undefined}
            draggable={false}
          />

          {animated && sheenBase && (
            <>
              {/* 흰 하이라이트 */}
              <div
                aria-hidden
                className="closet-blob-animated pointer-events-none absolute inset-0"
                style={{
                  ...sheenBase,
                  backgroundImage:
                    'radial-gradient(45% 35% at 35% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
                  mixBlendMode: 'screen',
                  animation: 'closetBlobSheenA 12s ease-in-out infinite',
                }}
              />
              {/* 보라·파랑 색번짐 */}
              <div
                aria-hidden
                className="closet-blob-animated pointer-events-none absolute inset-0"
                style={{
                  ...sheenBase,
                  backgroundImage:
                    'radial-gradient(50% 40% at 65% 70%, rgba(157,152,240,0.3) 0%, rgba(150,200,255,0.2) 45%, rgba(255,255,255,0) 75%)',
                  mixBlendMode: 'screen',
                  animation: 'closetBlobSheenB 16s ease-in-out infinite',
                }}
              />
            </>
          )}
        </div>
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
