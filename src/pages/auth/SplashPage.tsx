import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';
import useAuthStore from '@/store/authStore';

/** 흩어진 낙하 위치(크기 제각각으로 리듬감) → 로고 정렬 위치를 글자별로 정의 */
const LETTERS = [
  { char: 'F', drop: { left: '14%', top: '52%', rot: '-14deg', size: '3.4rem' }, logo: { left: '8%', top: '74%', rot: '0deg' } },
  { char: 'i', drop: { left: '32%', top: '42%', rot: '16deg', size: '2.4rem' }, logo: { left: '17%', top: '74%', rot: '0deg' } },
  { char: 't', drop: { left: '48%', top: '32%', rot: '-26deg', size: '3.9rem' }, logo: { left: '23%', top: '74%', rot: '0deg' } },
  { char: 't', drop: { left: '62%', top: '22%', rot: '30deg', size: '4.6rem' }, logo: { left: '30%', top: '74%', rot: '0deg' } },
  { char: 'y', drop: { left: '76%', top: '12%', rot: '-18deg', size: '4.1rem' }, logo: { left: '37%', top: '74%', rot: '0deg' } },
];

/** 로고 정렬 시 글자 공통 크기 (text-6xl) */
const LOGO_SIZE = '3.75rem';

/** 한 글자씩 여유를 두고 떨어지도록 시차를 크게 */
const DROP_DELAY_STEP_MS = 380;
/** 낙하 시간 - 바운스 없이 감속하며 천천히 내려앉는다 */
const DROP_DURATION_MS = 1500;

/** 각 단계 시작 시각(ms): 낙하 → 로고 정렬 → 마지막 화면 슬라이드 인 → 이동 */
const PHASE_LOGO_MS = 3500;
const PHASE_FINAL_MS = 4700;
const NAVIGATE_MS = 6000;

type Phase = 'drop' | 'logo' | 'final';

/** 모션 최소화 설정 시 애니메이션 없이 마지막 화면만 잠깐 보여준다 */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SplashPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'final' : 'drop'));

  useEffect(() => {
    const reduceMotion = prefersReducedMotion();

    const timers = reduceMotion
      ? []
      : [
          setTimeout(() => setPhase('logo'), PHASE_LOGO_MS),
          setTimeout(() => setPhase('final'), PHASE_FINAL_MS),
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

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="relative overflow-hidden">
      {/* 1~2단계: 글자 낙하 → 로고 정렬 */}
      {LETTERS.map(({ char, drop, logo }, i) => {
        const pos = phase === 'drop' ? drop : logo;
        return (
          <span
            key={`${char}-${i}`}
            className="absolute font-extrabold transition-all duration-700 ease-out"
            style={{
              left: pos.left,
              top: pos.top,
              // 낙하 중엔 글자별 크기로 리듬감을 주고, 로고 정렬 시 공통 크기로 모인다
              fontSize: phase === 'drop' ? drop.size : LOGO_SIZE,
              // 회전은 rotate 속성이 담당 → logo 단계에서 transition으로 0deg까지 풀림
              rotate: pos.rot,
              animation:
                phase === 'drop'
                  ? `splash-letter-drop ${DROP_DURATION_MS}ms cubic-bezier(0.18, 0.6, 0.24, 1) ${i * DROP_DELAY_STEP_MS}ms both`
                  : undefined,
            }}
          >
            {char}
          </span>
        );
      })}

      {/* 로고 정렬 시 마침표 등장 - 글자 기준선에 붙도록 살짝 아래(온점 위치) */}
      <span
        className={`absolute left-[44%] top-[75.2%] text-6xl font-extrabold transition-opacity duration-500 ${
          phase === 'logo' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        .
      </span>

      {/* 3단계: 마지막 화면 슬라이드 인 */}
      <div
        className={`absolute inset-0 flex flex-col justify-center gap-4 bg-white px-8 transition-transform duration-500 ease-out ${
          phase === 'final' ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <h1 className="text-5xl font-extrabold leading-tight">
          Fit
          <br />
          Your
          <br />
          Style
        </h1>
        <p className="text-sm text-neutral-400">
          내 옷으로 시작하는 나만의 스타일링,
          <br />
          Fitty에서 시작해보세요
        </p>
      </div>
    </PageLayout>
  );
};

export default SplashPage;
