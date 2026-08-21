import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';
import useAuthStore from '@/store/authStore';

/**
 * 낙하 글자 정의 — 온보딩 영상 프레임을 측정해 옮긴 값 (332×720 기준 → % 환산).
 * 글자들이 검정으로 떨어져 좌하→우상 대각선으로 쌓이고,
 * 마지막 y가 내려올 때부터 오래된 글자일수록 빨리 흐려진다(fadeDur).
 * - left/top: 정착 위치(글자 중심), fallFrom: 낙하 시작 오프셋(화면 위 밖)
 */
const LETTERS = [
  { char: 'F', left: '30%', top: '83%', rot: '-35deg', size: '5rem', delay: 900, fallFrom: '-95dvh', fadeDur: 900 },
  { char: 'i', left: '60%', top: '74%', rot: '25deg', size: '2.75rem', delay: 1750, fallFrom: '-86dvh', fadeDur: 1150 },
  { char: 'T', left: '66%', top: '65%', rot: '30deg', size: '5.25rem', delay: 2600, fallFrom: '-77dvh', fadeDur: 1400 },
  { char: 'T', left: '82%', top: '42%', rot: '115deg', size: '8rem', delay: 3450, fallFrom: '-56dvh', fadeDur: 1700 },
  { char: 'y', left: '58%', top: '19%', rot: '-155deg', size: '5rem', delay: 4300, fallFrom: '-33dvh', fadeDur: 1900 },
];

/** 낙하 시간 - 감속하며 내려앉는다 */
const FALL_DURATION_MS = 1100;
/** 흐려짐이 일제히 시작되는 시각 - 마지막 글자(y)의 낙하 시작 시점 */
const FADE_START_MS = 4300;

/** 각 단계 시작 시각(ms): 낙하 → 로고 페이드 인(F 기울음) → F 회전 정렬 → 페이드 아웃 → 이동 */
const PHASE_LOGO_MS = 6900;
const PHASE_ALIGN_MS = 8200;
const PHASE_LEAVE_MS = 9800;
const NAVIGATE_MS = 10300;

type Phase = 'drop' | 'logo' | 'align' | 'leave';

/** 모션 최소화 설정 시 애니메이션 없이 마지막 로고만 잠깐 보여준다 */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SplashPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'align' : 'drop'));
  /** 로고 페이드 인 트리거 - 마운트 다음 프레임에 켜야 opacity 트랜지션이 걸린다 */
  const [logoVisible, setLogoVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const reduceMotion = prefersReducedMotion();

    const timers = reduceMotion
      ? []
      : [
          setTimeout(() => setPhase('logo'), PHASE_LOGO_MS),
          setTimeout(() => setPhase('align'), PHASE_ALIGN_MS),
          setTimeout(() => setPhase('leave'), PHASE_LEAVE_MS),
        ];

    const navigateTimer = setTimeout(() => {
      if (isLoggedIn) {
        navigate('/home', { replace: true });
      } else if (localStorage.getItem(INTRO_SEEN_KEY)) {
        navigate('/login', { replace: true });
      } else {
        navigate('/intro', { replace: true });
      }
    }, reduceMotion ? 1500 : NAVIGATE_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(navigateTimer);
    };
  }, [isLoggedIn, navigate]);

  // 로고가 마운트된 다음 프레임에 opacity 트랜지션 시작 (페이드 인)
  useEffect(() => {
    if (phase !== 'logo') return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setLogoVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="relative overflow-hidden">
      {/* 1단계: 글자 낙하 - 검정으로 쌓이다가 y가 내려올 때부터 오래된 순으로 흐려진다.
          낙하 대기 중인 글자가 화면 위로 비치지 않게 전용 레이어에서 클리핑한다 */}
      {phase === 'drop' && (
        <div className="absolute inset-0 overflow-hidden">
          {LETTERS.map(({ char, left, top, rot, size, delay, fallFrom, fadeDur }, i) => (
            <span
              key={`${char}-${i}`}
              className="splash-letter absolute font-extrabold text-[#1F2124]"
              style={{
                left,
                top,
                fontSize: size,
                rotate: rot,
                '--fall-from': fallFrom,
                animation: [
                  `splash-fall ${FALL_DURATION_MS}ms cubic-bezier(0.18, 0.6, 0.24, 1) ${delay}ms both`,
                  `splash-age ${fadeDur}ms ease-out ${FADE_START_MS}ms both`,
                ].join(', '),
              } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </div>
      )}

      {/* 2~4단계: 하단 로고 - 기울어진 F로 페이드 인 → F만 슥 회전 정렬 → 페이드 아웃 */}
      {phase !== 'drop' && (
        <div
          className={`absolute bottom-[11%] left-1/2 flex -translate-x-1/2 items-baseline whitespace-nowrap font-extrabold text-[#1F2124] transition-opacity ${
            phase === 'leave' ? 'opacity-0 duration-500' : 'duration-[1100ms]'
          } ${logoVisible && phase !== 'leave' ? 'opacity-100' : phase !== 'leave' ? 'opacity-0' : ''}`}
          style={{ fontSize: 'calc(min(100vw, 430px) * 0.32)' }}
        >
          <span
            className="inline-block"
            style={{
              rotate: phase === 'logo' ? '-15deg' : '0deg',
              transition: 'rotate 600ms ease-out',
            }}
          >
            F
          </span>
          {/* F가 회전해 들어와도 닿지 않도록 최소 간격을 유지한다 */}
          <span
            className="inline-block"
            style={{
              marginLeft: phase === 'logo' ? '0.12em' : '0.04em',
              transition: 'margin-left 600ms ease-out',
            }}
          >
            itty.
          </span>
        </div>
      )}
    </PageLayout>
  );
};

export default SplashPage;
