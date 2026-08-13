import { useState } from 'react';

interface TransitionBlobScreenProps {
  /** 중앙 안내 문구 */
  message: string;
  /** blob 이미지 URL. 없으면 CSS 근사 blob 표시 */
  image?: string;
  /** 성장이 끝날 때 이 이미지로 크로스페이드한다(= 다음 화면의 배경 blob).
      끝 순간 다음 화면과 픽셀 단위로 맞아떨어지게 하는 용도 */
  imageEnd?: string;
  /** blob을 꿀렁이게 + 점점 커지게 움직인다 */
  animated?: boolean;
}

/** 꿀렁임 필터 id — 한 화면에 하나만 쓰므로 고정값 */
const WOBBLE_FILTER_ID = 'closet-blob-wobble';

/**
 * blob 실루엣 왜곡 — 노이즈로 이미지를 밀어내(feDisplacementMap) 윤곽을 비정형으로 만든다.
 *
 * baseFrequency와 seed는 고정한다. 이 둘을 애니메이션하면 매 프레임 노이즈를 통째로
 * 다시 만들어야 해서(필터 중 가장 비싼 연산) 프레임이 떨어지고, 값이 바뀌는 순간
 * 무늬가 갈아끼워지듯 튄다. 노이즈는 한 번만 만들고 밀어내는 세기(scale)만 움직인다.
 */
const WobbleFilter = () => (
  <svg className="absolute h-0 w-0" aria-hidden>
    <defs>
      <filter id={WOBBLE_FILTER_ID} x="-35%" y="-35%" width="170%" height="170%">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.0055" numOctaves="2" seed="7" result="noise" />
        {/* 커지는 동안 부풀었다가, 끝(6s)에는 0으로 죽는다.
            0이어야 마지막 프레임이 원본 그대로 = register의 정지 배경과 픽셀 단위로 일치 */}
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G">
          <animate
            attributeName="scale"
            dur="6s"
            values="10; 48; 0"
            calcMode="spline"
            keyTimes="0; 0.5; 1"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            fill="freeze"
          />
        </feDisplacementMap>
      </filter>
    </defs>
  </svg>
);

/**
 * animated일 때 blob은 이 화면의 Figma 레이아웃에서 시작해 /closet/register의
 * 배경 blob과 똑같은 상태로 커진다. 그래서 6초 뒤 register로 넘어가는 순간
 * blob의 크기·위치·각도가 그대로 겹쳐 두 화면이 이어져 보인다.
 *
 * 시작 = intro 정적 스펙(폭 108.71% = 407.66, top 183 + 상단 바 57 = 페이지 240, 중앙, +10.38°).
 * 끝   = register 배경 blob(1078.79², top 50, left -351, -10.07°). ClosetRegisterPage와 같은 값이어야 한다.
 * +10.38° → -10.07° 보간이라 커지는 동안 반시계로 천천히 돈다.
 * 좌표 기준은 페이지 컨테이너(= register의 blob 기준)이고, 이 컴포넌트는 상단 바 아래에
 * 놓이므로 그만큼 위로 끌어올린다. 수치는 375pt 디자인 폭 기준 px 고정(register와 동일한 방식).
 */
const TOP_BAR_PX = 53 + 4; // OnboardingTopBar 높이(53) + 진행 바(4). safe-area는 env()로 따로 상쇄
const BLOB_END = { size: 1078.79, top: 50, left: -351 } as const;
const BLOB_START = { size: 375 * 1.0871, top: 183 + TOP_BAR_PX, left: (375 - 375 * 1.0871) / 2 } as const;
/** intro 시작 각도(CSS) → register blob 각도로 성장하며 보간 */
const BLOB_START_DEG = 10.38;
const BLOB_END_DEG = -10.07;
/** 성장 시간. ClosetIntroPage의 이동 타이머(6s)와 맞물린다 */
const GROW_DURATION_S = 6;

const GROW_SCALE = BLOB_START.size / BLOB_END.size;
const GROW_DX = BLOB_START.left + BLOB_START.size / 2 - (BLOB_END.left + BLOB_END.size / 2);
const GROW_DY = BLOB_START.top + BLOB_START.size / 2 - (BLOB_END.top + BLOB_END.size / 2);

/** 성장 시작 상태(= intro Figma 레이아웃). 이미지 로드를 기다리는 동안에도 이 상태로
    붙잡아 둬야 "이미 다 커진 채로 시작"하는 플래시가 없다 */
const GROW_FROM_TRANSFORM = `translate(${GROW_DX}px, ${GROW_DY}px) rotate(${BLOB_START_DEG}deg) scale(${GROW_SCALE})`;

/**
 * 그라디언트 blob 전환 화면 — 문구 + 큰 blob(좌우 넘침, 회전).
 * 사용처: "거의 다 왔어요"(온보딩→옷장 진입), "Fitty를 이용할 준비가 다 됐어요".
 * 상단 바 아래 스크롤 영역(flex-1)에 배치 전제. 문구와 blob은 각각 독립 절대 배치.
 * 회전 CSS +10.38° = Figma -10.38°.
 */
const TransitionBlobScreen = ({ message, image, imageEnd, animated = false }: TransitionBlobScreenProps) => {
  // 성장은 blob 이미지가 실제로 화면에 뜬 뒤에 시작한다. 마운트와 동시에 시작하면
  // 이미지(수백 KB) 디코드가 끝났을 땐 이미 커져 있어서 "다 커진 채 등장"으로 보인다.
  const [blobLoaded, setBlobLoaded] = useState(false);

  const blobStyle = {
    left: '50%',
    width: '108.71%',
    transform: 'translateX(-50%) rotate(10.38deg)',
  } as const;

  // 하이라이트는 blob 모양으로 잘라내기만 한다. 여기에도 왜곡 필터를 걸면 프레임마다
  // 필터를 세 번(이미지 + 하이라이트 2겹) 계산해야 해서 눈에 띄게 버벅인다.
  // 하이라이트는 안쪽에 뭉쳐 있는 부드러운 그라디언트라 왜곡을 안 따라가도 티가 안 난다.
  const sheenBase = image
    ? ({
        WebkitMaskImage: `url(${image})`,
        maskImage: `url(${image})`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        backgroundSize: '200% 200%',
      } as const)
    : undefined;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      {animated && <WobbleFilter />}
      {animated && (
        <style>{`
          /*
           * 각 움직임은 keyframe 두 개(=구간 하나)로만 만든다. 중간 지점을 두면 easing이
           * 구간마다 다시 시작해서 "빨라졌다 멈칫"이 반복된다. 몽글몽글한 불규칙함은
           * 주기가 어긋난 숨쉬기·왜곡을 성장 위에 겹쳐서 만들되, 전부 6s에 중립으로
           * 수렴시켜 마지막 프레임이 register의 정지 배경과 픽셀 단위로 같게 한다.
           */
          /* 성장 — intro 레이아웃의 자리·크기·각도에서 register blob의 자리·크기·각도로
             한 구간으로 서서히 보간한다. translate 뒤의 rotate라 축은 항상 blob 자기 중심 */
          @keyframes closetBlobGrow {
            from { transform: translate(${GROW_DX}px, ${GROW_DY}px) rotate(${BLOB_START_DEG}deg) scale(${GROW_SCALE}); }
            to   { transform: translate(0px, 0px) rotate(${BLOB_END_DEG}deg) scale(1); }
          }
          /* 꿀렁임 — 가로로 퍼지면 세로로 눌린다. 중립에서 출발해 alternate 짝수 회
             반복이라 성장이 끝나는 6s(3s×2)에 정확히 중립으로 돌아와 멈춘다 */
          @keyframes closetBlobBreathe {
            from { transform: scale(1, 1); }
            to   { transform: scale(1.05, 0.94); }
          }
          /* 성장 끝에 원본 blob → 다음 화면 blob으로 크로스페이드 */
          @keyframes closetBlobFadeOut {
            0%, 75% { opacity: 1; }
            100%    { opacity: 0; }
          }
          @keyframes closetBlobFadeIn {
            0%, 75% { opacity: 0; }
            100%    { opacity: 1; }
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
      {image && animated ? (
        // 상자는 끝 상태(= register blob)에 고정하고, 시작 위치·크기는 transform으로만 만든다.
        // 레이아웃이 아니라 transform만 움직이므로 성장 내내 리플로우가 없다.
        <div
          className="pointer-events-none absolute max-w-none"
          style={{
            left: `${BLOB_END.left}px`,
            top: `calc(${BLOB_END.top - TOP_BAR_PX}px - env(safe-area-inset-top, 0px))`,
            width: `${BLOB_END.size}px`,
            height: `${BLOB_END.size}px`,
          }}
        >
          {/* 성장(이동+회전+확대) → 꿀렁임 → 이미지(실루엣 일그러짐).
              한 요소에 몰면 keyframe끼리 서로 덮어써서 동시에 못 준다.
              왜곡은 맨 안쪽 이미지에만 걸리므로, 일그러진 형태 그대로 통째로 커진다 */}
          <div
            className="closet-blob-animated"
            style={{
              willChange: 'transform',
              // 기본 transform = 시작 상태. 로드 전엔 여기 묶여 있다가, 로드되면 성장 시작
              transform: GROW_FROM_TRANSFORM,
              animation: blobLoaded
                ? `closetBlobGrow ${GROW_DURATION_S}s ease-in-out forwards`
                : 'none',
            }}
          >
            <div
              className="closet-blob-animated"
              style={{
                willChange: 'transform',
                animation: `closetBlobBreathe ${GROW_DURATION_S / 2}s ease-in-out 2 alternate`,
              }}
            >
                <img
                  src={image}
                  alt=""
                  className="closet-blob-animated block w-full select-none"
                  style={{
                    filter: `url(#${WOBBLE_FILTER_ID})`,
                    animation: imageEnd ? `closetBlobFadeOut ${GROW_DURATION_S}s linear forwards` : undefined,
                  }}
                  draggable={false}
                  onLoad={() => setBlobLoaded(true)}
                  // 캐시된 이미지는 onLoad가 마운트보다 먼저 끝나 안 불릴 수 있다
                  ref={(el) => {
                    if (el?.complete) setBlobLoaded(true);
                  }}
                />

                {/* 다음 화면 배경 blob — 같은 필터·같은 상자에서 서서히 드러나,
                    6s에는 이 이미지 원본만 남는다(왜곡도 그때 0) = register 배경과 일치 */}
                {imageEnd && (
                  <img
                    src={imageEnd}
                    alt=""
                    className="closet-blob-animated pointer-events-none absolute inset-0 block w-full select-none"
                    style={{
                      filter: `url(#${WOBBLE_FILTER_ID})`,
                      opacity: 0,
                      animation: `closetBlobFadeIn ${GROW_DURATION_S}s linear forwards`,
                    }}
                    draggable={false}
                  />
                )}

                {sheenBase && (
                  // sheen도 끝에서는 사라져야 register의 정지 배경과 같아진다
                  <div
                    aria-hidden
                    className="closet-blob-animated pointer-events-none absolute inset-0"
                    style={{ animation: `closetBlobFadeOut ${GROW_DURATION_S}s linear forwards` }}
                  >
                    {/* 흰 하이라이트 */}
                    <div
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
                      className="closet-blob-animated pointer-events-none absolute inset-0"
                      style={{
                        ...sheenBase,
                        backgroundImage:
                          'radial-gradient(50% 40% at 65% 70%, rgba(157,152,240,0.3) 0%, rgba(150,200,255,0.2) 45%, rgba(255,255,255,0) 75%)',
                        mixBlendMode: 'screen',
                        animation: 'closetBlobSheenB 16s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      ) : image ? (
        <div className="absolute top-[183px] max-w-none" style={blobStyle}>
          <img src={image} alt="" className="block w-full select-none" draggable={false} />
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
