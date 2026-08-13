import { useEffect, useRef, useState } from 'react';

interface BlobIntroProps {
  message: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * 단계별 목표 크기(px) - 피그마 시안의 화면 대비 비율 기준에서 sm/md는 요청으로 살짝 키움.
 * xl은 옷장 진입(마지막 단계)용 — 체형(lg)의 가장 큰 프레임(실측 226px)보다 확실히 커야 해
 * lg와 같은 간격(+50)으로 300을 쓴다. 300 × 0.90 = 최대 271px.
 */
const TARGET_PX = { sm: 108, md: 200, lg: 250, xl: 300 } as const;
/** 등장 시 시작 크기(이전 단계 크기)에서 커지며 나타난다 */
const START_PX = { sm: 108, md: 108, lg: 200, xl: 250 } as const;

/**
 * 디자이너 레퍼런스 영상(onboarding.mov)의 유리질 블롭 모핑을 SVG 패스 모핑으로 재현.
 * 8점 유기 곡선 4개를 순환(SMIL)하며, 세 화면(sm/md/lg)이 서로 다른 형태·주기로 움직인다.
 * 반지름 대비를 줄이고 이웃 스무딩을 거쳐 찌그러져도 뾰족해지지 않는다.
 * 한 세트 안의 패스는 M+8C+Z 동일 구조여야 브라우저가 보간할 수 있다.
 */
const BLOB_PATHS = {
  sm: [
    'M 184.1 124.2 C 179.7 141.7 158.6 144.9 141.0 153.4 C 123.4 161.8 96.7 174.8 78.5 174.8 C 60.3 174.8 38.5 168.8 31.8 153.5 C 25.2 138.2 33.1 99.5 38.5 83.0 C 43.9 66.5 50.6 63.3 64.2 54.4 C 77.8 45.4 103.1 30.4 120.3 29.4 C 137.6 28.3 157.0 32.2 167.7 48.0 C 178.3 63.8 188.5 106.6 184.1 124.2 Z',
    'M 154.0 148.3 C 144.3 165.0 133.8 184.1 117.5 184.2 C 101.3 184.2 71.5 160.1 56.4 148.7 C 41.4 137.3 31.0 133.5 27.4 115.9 C 23.8 98.2 25.1 56.5 34.8 42.9 C 44.5 29.2 68.0 32.2 85.6 34.2 C 103.2 36.2 125.3 46.6 140.3 54.9 C 155.4 63.3 173.4 68.7 175.7 84.2 C 178.0 99.8 163.7 131.7 154.0 148.3 Z',
    'M 123.8 157.8 C 109.6 167.8 98.2 180.9 80.8 176.8 C 63.5 172.7 27.2 148.5 19.6 133.1 C 11.9 117.7 26.3 101.4 34.8 84.4 C 43.4 67.5 56.9 42.7 71.0 31.6 C 85.1 20.5 105.1 10.4 119.6 17.8 C 134.2 25.2 150.6 59.5 158.4 75.9 C 166.2 92.4 172.1 102.9 166.3 116.5 C 160.5 130.2 138.1 147.7 123.8 157.8 Z',
    'M 95.3 178.9 C 79.5 179.7 70.2 163.6 58.6 149.7 C 47.0 135.8 30.0 113.0 25.8 95.6 C 21.6 78.2 20.4 55.4 33.2 45.5 C 46.1 35.6 83.9 37.0 103.1 36.1 C 122.4 35.2 135.1 28.5 149.0 40.0 C 163.0 51.5 186.1 87.7 186.8 105.1 C 187.6 122.6 168.5 132.1 153.3 144.4 C 138.0 156.7 111.1 178.0 95.3 178.9 Z',
  ],
  md: [
    'M 138.0 156.6 C 125.6 170.5 114.6 187.6 96.2 186.2 C 77.7 184.9 37.7 163.5 27.3 148.7 C 17.0 134.0 29.3 116.4 34.2 97.7 C 39.1 79.1 45.3 46.7 56.7 36.8 C 68.0 26.8 84.0 35.0 102.1 38.2 C 120.3 41.4 154.2 45.2 165.6 56.0 C 177.0 66.8 175.2 86.4 170.6 103.2 C 166.0 119.9 150.4 142.8 138.0 156.6 Z',
    'M 111.9 184.0 C 95.4 187.1 84.2 168.3 69.8 156.0 C 55.3 143.8 32.5 126.4 25.2 110.6 C 18.0 94.8 15.6 74.0 26.4 61.3 C 37.2 48.6 71.1 40.6 90.0 34.4 C 109.0 28.2 126.5 14.7 140.1 23.9 C 153.7 33.1 166.8 71.0 171.6 89.8 C 176.4 108.7 178.8 121.4 168.8 137.1 C 158.8 152.8 128.4 180.8 111.9 184.0 Z',
    'M 77.3 171.1 C 57.4 168.2 36.9 165.7 30.2 150.5 C 23.5 135.3 33.5 99.2 37.1 79.9 C 40.8 60.7 37.3 45.2 52.0 35.0 C 66.6 24.8 108.7 14.1 125.1 18.8 C 141.4 23.5 142.0 45.6 150.0 63.1 C 158.1 80.5 173.5 105.9 173.3 123.4 C 173.2 141.0 165.3 160.2 149.3 168.2 C 133.3 176.1 97.1 174.1 77.3 171.1 Z',
    'M 41.9 161.2 C 27.5 150.4 27.1 132.7 26.8 113.0 C 26.5 93.3 29.8 55.9 40.0 43.1 C 50.2 30.3 68.3 37.5 88.0 36.5 C 107.8 35.4 144.7 28.7 158.6 37.0 C 172.4 45.4 173.5 69.1 171.1 86.6 C 168.7 104.1 153.8 126.8 144.2 142.0 C 134.7 157.1 130.8 174.3 113.8 177.4 C 96.7 180.6 56.4 171.9 41.9 161.2 Z',
  ],
  lg: [
    'M 91.6 176.9 C 73.8 174.9 69.1 161.1 56.9 146.8 C 44.6 132.5 19.9 107.1 17.8 91.0 C 15.8 74.8 29.5 62.7 44.6 50.0 C 59.7 37.2 91.9 14.1 108.5 14.3 C 125.1 14.5 132.4 35.4 144.1 51.1 C 155.8 66.9 175.4 90.7 178.7 108.6 C 181.9 126.5 178.1 147.2 163.6 158.6 C 149.1 170.0 109.4 178.8 91.6 176.9 Z',
    'M 66.8 153.0 C 50.0 147.9 28.1 145.6 23.3 130.3 C 18.5 115.0 30.7 79.6 38.1 61.3 C 45.5 42.9 51.6 23.2 67.6 20.3 C 83.6 17.4 116.7 35.5 134.4 43.8 C 152.0 52.2 167.0 53.3 173.3 70.2 C 179.7 87.1 180.5 130.1 172.3 145.3 C 164.1 160.4 141.7 159.8 124.1 161.1 C 106.5 162.4 83.7 158.1 66.8 153.0 Z',
    'M 25.9 146.6 C 14.9 132.8 21.0 111.1 27.9 94.7 C 34.8 78.2 54.5 60.6 67.3 48.1 C 80.2 35.6 89.5 17.4 105.1 19.5 C 120.8 21.6 147.8 46.3 161.3 60.6 C 174.7 74.9 190.2 89.4 186.0 105.5 C 181.8 121.6 151.1 145.0 135.9 157.0 C 120.6 169.0 112.6 179.4 94.3 177.6 C 75.9 175.9 37.0 160.4 25.9 146.6 Z',
    'M 31.1 107.7 C 25.7 90.5 21.0 75.7 30.9 60.1 C 40.7 44.4 73.5 16.6 90.3 13.9 C 107.2 11.1 116.6 31.0 131.8 43.7 C 147.0 56.4 176.8 75.1 181.4 90.1 C 185.9 105.0 171.1 117.7 159.1 133.3 C 147.1 149.0 125.4 179.2 109.4 184.1 C 93.5 189.1 76.5 175.9 63.5 163.2 C 50.4 150.5 36.5 124.9 31.1 107.7 Z',
  ],
} as const;

/**
 * 옷장 진입(xl)은 체형(lg)과 같은 형태 세트를 쓰고 크기·주기·위상만 다르다.
 * viewBox가 고정(0 0 200 200)이라 컨테이너 px만 키우면 형태가 그대로 확대된다.
 */
const PATHS = { ...BLOB_PATHS, xl: BLOB_PATHS.lg } as const;

/** 화면마다 모핑·흔들림 주기를 다르게 해 같은 리듬으로 보이지 않게 한다 */
const MORPH_DUR_S = { sm: 3.8, md: 4.6, lg: 5.4, xl: 6.2 } as const;
/** 사이클 중간에서 시작하는 위상(초) - 첫 프레임부터 한창 움직이는 중으로 보인다 */
const MORPH_PHASE_S = { sm: 1.3, md: 2.1, lg: 3.0, xl: 3.8 } as const;
const SWAY = {
  sm: { animationDuration: '5.6s', animationDelay: '-1.2s' },
  md: { animationDuration: '6.8s', animationDelay: '-3.5s' },
  lg: { animationDuration: '7.8s', animationDelay: '-6s' },
  xl: { animationDuration: '8.8s', animationDelay: '-7.5s' },
} as const;

/** 패스 문자열에서 숫자만 추출 (모든 패스가 M+8C+Z 동일 구조라 개수가 같다) */
const toNumbers = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

/**
 * 순환 Catmull-Rom 보간 - 키프레임을 '통과'하며 속도가 어느 지점에서도 0이 되지 않아
 * 멈칫거림 없이 계속 흐른다. (SMIL은 첫 사이클 보간이 브라우저에 따라 동작하지 않아 JS로 구동)
 */
const catmullRom = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3)
  );
};

/** 8커브 닫힌 패스의 숫자 배열 → d 문자열 복원 */
const toPathD = (n: number[]) => {
  let d = `M ${n[0].toFixed(1)} ${n[1].toFixed(1)} `;
  for (let i = 2; i < n.length; i += 6) {
    d += `C ${n[i].toFixed(1)} ${n[i + 1].toFixed(1)} ${n[i + 2].toFixed(1)} ${n[i + 3].toFixed(1)} ${n[i + 4].toFixed(1)} ${n[i + 5].toFixed(1)} `;
  }
  return d + 'Z';
};

const BlobIntro = ({ message, size }: BlobIntroProps) => {
  const [grown, setGrown] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // rAF로 매 프레임 키프레임 사이를 순환 보간해 d를 갱신한다
  useEffect(() => {
    const keys = PATHS[size].map(toNumbers);
    const K = keys.length;
    const dur = MORPH_DUR_S[size] * 1000;
    const phase = MORPH_PHASE_S[size] * 1000;
    const buf = new Array<number>(keys[0].length);
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const cyc = (((now - start + phase) % dur) / dur) * K;
      const i = Math.floor(cyc) % K;
      const u = cyc - Math.floor(cyc);
      const a = keys[(i - 1 + K) % K];
      const b = keys[i];
      const c = keys[(i + 1) % K];
      const e = keys[(i + 2) % K];
      for (let j = 0; j < buf.length; j += 1) buf[j] = catmullRom(a[j], b[j], c[j], e[j], u);
      pathRef.current?.setAttribute('d', toPathD(buf));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  const px = grown ? TARGET_PX[size] : START_PX[size];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 pb-24">
      <p className="text-base font-medium">{message}</p>
      <div
        style={{
          width: px,
          height: px,
          transition: 'width 1.2s ease-out, height 1.2s ease-out',
        }}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
          <defs>
            {/* 비눗방울 몸통 - 안쪽은 거의 투명, 가장자리에서만 색이 맺히는 얇은 막 */}
            <radialGradient id="blob-glass" cx="45%" cy="40%" r="68%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="55%" stopColor="#f5f3ff" stopOpacity="0.06" />
              <stop offset="76%" stopColor="#ede9fe" stopOpacity="0.16" />
              <stop offset="88%" stopColor="#ddd6fe" stopOpacity="0.24" />
              <stop offset="96%" stopColor="#cbbcf9" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#b7a5f7" stopOpacity="0.44" />
            </radialGradient>
            {/*
              3D 유리 셰이딩 - 테두리 선 대신, 모핑 중인 형태를 그대로 따라가는
              가장자리 안쪽 음영 밴드를 만든다 (알파를 침식→블러→원본에서 빼기).
              빛이 좌상단에서 오는 것처럼 밴드를 우하단으로 살짝 밀어 두께를 준다.
            */}
            <filter id="blob-shade" x="-25%" y="-25%" width="150%" height="150%">
              <feMorphology in="SourceAlpha" operator="erode" radius="4" result="core" />
              <feOffset in="core" dx="-2.5" dy="-3.5" result="coreShift" />
              <feGaussianBlur in="coreShift" stdDeviation="6" result="coreBlur" />
              {/* 형태 경계는 그대로 두고(밖으로 번지지 않게) 안쪽으로만 음영 램프 */}
              <feComposite in="SourceAlpha" in2="coreBlur" operator="out" result="band" />
              <feFlood floodColor="#a795f0" floodOpacity="0.8" result="lav" />
              <feComposite in="lav" in2="band" operator="in" result="shade" />
              {/* 실루엣 가장자리 심도 - 1~2px 폭의 아주 부드러운 어두운 막 (선이 아니라 볼륨 경계로 읽힘) */}
              <feMorphology in="SourceAlpha" operator="erode" radius="1.5" result="core2" />
              <feGaussianBlur in="core2" stdDeviation="1.8" result="core2Blur" />
              <feComposite in="SourceAlpha" in2="core2Blur" operator="out" result="edge" />
              <feFlood floodColor="#9c88ee" floodOpacity="0.5" result="deep" />
              <feComposite in="deep" in2="edge" operator="in" result="edgeShade" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="shade" />
                <feMergeNode in="edgeShade" />
              </feMerge>
            </filter>
          </defs>

          <g className="blob-sway" style={{ transformOrigin: '100px 100px', ...SWAY[size] }}>
            {/* 몸통 + 가장자리 셰이딩 (테두리 선 없음) */}
            <path ref={pathRef} d={PATHS[size][0]} fill="url(#blob-glass)" filter="url(#blob-shade)" />
            {/* 홍채빛 글린트 - 가장자리 근처에 핑크/하늘색이 살짝 맺힘 */}
            <ellipse cx="134" cy="126" rx="16" ry="10" fill="#fbcfe8" opacity="0.35" style={{ filter: 'blur(7px)' }} />
            <ellipse cx="64" cy="126" rx="12" ry="8" fill="#bfdbfe" opacity="0.3" style={{ filter: 'blur(7px)' }} />
            {/* 광택 하이라이트 - 흰 광이 배경에 묻히지 않게 라벤더 결을 깔고 그 위에 얹는다 */}
            <ellipse
              cx="84"
              cy="56"
              rx="40"
              ry="14"
              fill="#ddd6fe"
              opacity="0.35"
              transform="rotate(-14 84 56)"
              style={{ filter: 'blur(8px)' }}
            />
            <ellipse
              cx="80"
              cy="49"
              rx="32"
              ry="8"
              fill="#ffffff"
              opacity="0.95"
              transform="rotate(-14 80 49)"
              style={{ filter: 'blur(2px)' }}
            />
            <ellipse cx="132" cy="146" rx="8" ry="5" fill="#ffffff" opacity="0.75" style={{ filter: 'blur(2px)' }} />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BlobIntro;
