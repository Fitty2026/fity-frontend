import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';
import useAuthStore from '@/store/authStore';

/** 흩어진 낙하 위치 → 로고 정렬 위치를 글자별로 정의 */
const LETTERS = [
  { char: 'F', drop: { left: '14%', top: '52%', rot: '-14deg' }, logo: { left: '8%', top: '74%', rot: '0deg' } },
  { char: 'i', drop: { left: '32%', top: '42%', rot: '16deg' }, logo: { left: '17%', top: '74%', rot: '0deg' } },
  { char: 't', drop: { left: '48%', top: '32%', rot: '-26deg' }, logo: { left: '23%', top: '74%', rot: '0deg' } },
  { char: 't', drop: { left: '62%', top: '22%', rot: '30deg' }, logo: { left: '30%', top: '74%', rot: '0deg' } },
  { char: 'y', drop: { left: '76%', top: '12%', rot: '-18deg' }, logo: { left: '37%', top: '74%', rot: '0deg' } },
];

const DROP_DELAY_STEP_MS = 150;

/** 각 단계 시작 시각(ms): 낙하 → 로고 정렬 → 마지막 화면 슬라이드 인 → 이동 */
const PHASE_LOGO_MS = 1500;
const PHASE_FINAL_MS = 2400;
const NAVIGATE_MS = 3600;

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
            className="absolute text-6xl font-extrabold transition-all duration-500 ease-out"
            style={{
              left: pos.left,
              top: pos.top,
              // 회전은 rotate 속성이 담당 → logo 단계에서 transition으로 0deg까지 풀림
              rotate: pos.rot,
              animation:
                phase === 'drop'
                  ? `splash-letter-drop 0.6s cubic-bezier(0.34, 1.3, 0.64, 1) ${i * DROP_DELAY_STEP_MS}ms both`
                  : undefined,
            }}
          >
            {char}
          </span>
        );
      })}

      {/* 로고 정렬 시 마침표 등장 */}
      <span
        className={`absolute left-[44%] top-[74%] text-6xl font-extrabold transition-opacity duration-500 ${
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
