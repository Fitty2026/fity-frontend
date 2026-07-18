# 진입/계정 화면 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 새 Figma 디자인 기준으로 스플래시 애니메이션, 서비스 소개 슬라이드, 로그인, 회원가입 화면을 `feature/entry-auth` 브랜치에 구현한다.

**Architecture:** 기존 라우트(`/`, `/intro`, `/login`)를 유지하고 `/signup`만 추가한다. 스플래시는 CSS keyframes + React 단계(state) 전환, 서비스 소개는 Swiper, 폼은 react-hook-form + zod, 인증은 기존 mock authApi 확장.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, react-router-dom v7, react-hook-form + zod, Swiper 14, zustand

## Global Constraints

- 커밋/푸시는 **사용자가 직접** 수행한다. 각 태스크 마지막 스텝은 복붙용 `git add` + `git commit` 명령 제시만 한다 (실행 금지).
- 테스트 프레임워크 부재 → 자동화 테스트 없음. 검증은 `npm run build` + `npm run lint` + dev 서버 수동 확인.
- 비밀번호 찾기 페이지는 만들지 않는다 (텍스트만 표시, onClick 없음).
- "로그인 상태 유지" 체크박스는 UI만 구현, 동작은 API 연동 시 TODO.
- 인트로 시청 기록 localStorage 키는 기존 `INTRO_SEEN_KEY`(`fitty-intro-seen`) 재사용.
- 문구는 설계 문서(`docs/entry-auth-design.md`)의 확정 문구를 그대로 사용한다.

---

### Task 1: 스플래시 애니메이션 재작성

**Files:**
- Modify: `src/pages/auth/SplashPage.tsx` (전체 재작성)
- Modify: `src/index.css` (keyframes 추가)

**Interfaces:**
- Consumes: `INTRO_SEEN_KEY` (`@/features/auth/constants`), `useAuthStore`
- Produces: 없음 (독립 화면)

- [ ] **Step 1: index.css에 낙하 keyframes 추가**

`src/index.css` 맨 아래에 추가:

```css
/* 스플래시 - 글자 낙하 (위에서 떨어져 바운스로 착지)
   회전은 CSS rotate 속성(개별 transform)이 담당하므로 여기서는 translateY만 다룬다 */
@keyframes splash-letter-drop {
  0% {
    transform: translateY(-120vh);
    opacity: 0;
  }
  60% {
    transform: translateY(0);
    opacity: 1;
  }
  75% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
```

- [ ] **Step 2: SplashPage 재작성**

`src/pages/auth/SplashPage.tsx` 전체 교체:

```tsx
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

const SplashPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [phase, setPhase] = useState<Phase>('drop');

  useEffect(() => {
    // 모션 최소화 설정 시 애니메이션 없이 마지막 화면만 잠깐 보여준다
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) setPhase('final');

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
```

- [ ] **Step 3: 빌드/린트 확인**

Run: `npm run build && npm run lint`
Expected: 둘 다 에러 없이 통과

- [ ] **Step 4: dev 서버 수동 확인**

Run: `npm run dev` 후 브라우저에서 `/` 접속 (localStorage의 `fitty-intro-seen` 삭제, 로그아웃 상태).
Expected: 글자 5개가 순차 낙하 → 하단 좌측 "Fitty."로 정렬 → "Fit Your Style" 화면이 아래에서 스윽 등장 → `/intro`로 자동 이동.

- [ ] **Step 5: 커밋 안내 (사용자 수동)**

```bash
git add src/pages/auth/SplashPage.tsx src/index.css
git commit -m "feat: 스플래시 글자 낙하 애니메이션 및 자동 이동 구현"
```

---

### Task 2: 서비스 소개 슬라이드 리디자인 (Swiper)

**Files:**
- Modify: `src/pages/auth/ServiceIntroPage.tsx` (전체 재작성)
- Delete: `src/features/auth/components/IntroSlide.tsx`
- Delete: `src/assets/images/intro-1.png`, `src/assets/images/intro-2.png`, `src/assets/images/intro-3.png`

**Interfaces:**
- Consumes: `INTRO_SEEN_KEY`, `Button`(기존), Swiper(`swiper/react`)
- Produces: 없음 (독립 화면)

- [ ] **Step 1: ServiceIntroPage 재작성**

`src/pages/auth/ServiceIntroPage.tsx` 전체 교체:

```tsx
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';

const SLIDES = [
  {
    number: '1',
    title: '내 옷으로\n완성하는\n코디',
    description: '이미 가지고 있는 옷만으로도\n가장 잘 어울리는 스타일을 추천해드려요',
  },
  {
    number: '2',
    title: '체형과\n취향에 맞는\n코디 추천',
    description: '스타일 취향과 체형을 분석해\n나에게 가장 잘 어울리는 코디를 찾아드려요',
  },
  {
    number: '3',
    title: '사진으로\n미리 보는\n실사 코디',
    description: '사진을 합성해\n실제처럼 미리 확인할 수 있어요',
  },
];

const ServiceIntroPage = () => {
  const [index, setIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();

  const isLast = index === SLIDES.length - 1;

  const goToLogin = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    navigate('/login');
  };

  const handleNext = () => {
    if (isLast) {
      goToLogin();
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
      {/* 슬라이드 영역 */}
      <Swiper
        className="w-full flex-1"
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.number}>
            <div className="flex h-full flex-col px-6 pt-16">
              <span className="text-7xl font-extrabold">{slide.number}</span>
              <h2 className="mt-10 whitespace-pre-line text-4xl font-extrabold leading-snug">
                {slide.title}
              </h2>
              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-neutral-400">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* dots 인디케이터 */}
      <div className="mb-5 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.number}
            type="button"
            aria-label={`${i + 1}번째 슬라이드로 이동`}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? 'bg-black' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>

      {/* 다음 / 시작하기 */}
      <div className="px-6 pb-8">
        <Button
          label={isLast ? '시작하기' : '다음'}
          shape="pill"
          fullWidth
          onClick={handleNext}
        />
      </div>
    </PageLayout>
  );
};

export default ServiceIntroPage;
```

주의: `Button`의 `shape` prop은 Task 3에서 추가된다. Task 3보다 먼저 빌드하면 타입 에러가 나므로, **Task 3 완료 후에 빌드 확인**한다. (Task 2~3을 묶어서 검증)

- [ ] **Step 2: 미사용 파일 삭제**

Run:
```bash
rm src/features/auth/components/IntroSlide.tsx src/assets/images/intro-1.png src/assets/images/intro-2.png src/assets/images/intro-3.png
```

- [ ] **Step 3: 커밋 안내는 Task 3 검증 후 함께 제시** (shape prop 의존)

---

### Task 3: 공통 UI 컴포넌트 확장

**Files:**
- Modify: `src/components/ui/Button.tsx` (shape prop 추가)
- Modify: `src/components/ui/Input.tsx` (rightElement 슬롯 추가)
- Create: `src/features/auth/components/PasswordInput.tsx`
- Modify: `src/features/auth/components/SocialLoginButton.tsx` (전체 재작성)

**Interfaces:**
- Produces:
  - `Button`: `shape?: 'default' | 'pill'` prop 추가 (pill = 완전 라운드). 기존 사용처 영향 없음.
  - `Input`: `rightElement?: React.ReactNode` prop 추가.
  - `PasswordInput`: `Omit<InputProps, 'type' | 'rightElement'>`를 받는 forwardRef 컴포넌트. react-hook-form `register` 스프레드 가능.
  - `SocialLoginButton`: 기존과 동일한 props (`provider`, `onClick`, `disabled`), 라벨 "○○로 시작하기" + 아이콘 + provider별 배경.

- [ ] **Step 1: Button에 shape prop 추가**

`src/components/ui/Button.tsx` 전체 교체 (radius를 sizeStyles에서 분리):

```tsx
interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'pill';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900',
  secondary: 'bg-white text-black border border-black hover:bg-neutral-100',
  ghost: 'bg-transparent text-black hover:bg-neutral-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

const defaultRadius: Record<string, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-xl',
};

const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  shape = 'default',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'font-medium transition-colors duration-150 focus:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        shape === 'pill' ? 'rounded-full' : defaultRadius[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
};

export default Button;
```

- [ ] **Step 2: Input에 rightElement 슬롯 추가**

`src/components/ui/Input.tsx`에서 interface에 `rightElement?: React.ReactNode;` 추가, 구조 분해에 `rightElement` 추가, input을 relative 래퍼로 감싼다:

```tsx
import { forwardRef } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      value,
      onChange,
      onBlur,
      name,
      autoComplete,
      errorMessage,
      disabled = false,
      className = '',
      rightElement,
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-neutral-700">{label}</label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            disabled={disabled}
            className={[
              'w-full h-12 px-4 text-sm bg-white border rounded-xl outline-none transition-colors',
              'placeholder:text-neutral-400',
              rightElement ? 'pr-12' : '',
              errorMessage
                ? 'border-red-400 focus:border-red-500'
                : 'border-neutral-300 focus:border-black',
              disabled ? 'opacity-40 cursor-not-allowed bg-neutral-100' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
```

(주의: `InputProps`를 `export`로 바꿔 PasswordInput에서 재사용한다.)

- [ ] **Step 3: PasswordInput 생성**

`src/features/auth/components/PasswordInput.tsx` 신규:

```tsx
import { forwardRef, useState } from 'react';
import Input, { type InputProps } from '@/components/ui/Input';

/** 눈 아이콘으로 표시/숨김을 토글하는 비밀번호 입력 필드 */
const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'rightElement'>>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightElement={
          <button
            type="button"
            aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
            onClick={() => setVisible((v) => !v)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            {visible ? (
              // 눈 아이콘 (표시 중)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // 빗금 눈 아이콘 (숨김 중)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="4" y1="20" x2="20" y2="4" />
              </svg>
            )}
          </button>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
```

- [ ] **Step 4: SocialLoginButton 리뉴얼**

`src/features/auth/components/SocialLoginButton.tsx` 전체 교체:

```tsx
import type { ReactNode } from 'react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8H1.2v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2a12 12 0 0 0 0 10.8l4.1-3.1Z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8L20 3.2A12 12 0 0 0 1.2 6.6l4.1 3.1A7.2 7.2 0 0 1 12 4.8Z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.7 12.9c0-2.4 2-3.6 2.1-3.7a4.6 4.6 0 0 0-3.6-2c-1.5-.1-3 .9-3.8.9-.8 0-2-.9-3.3-.8a4.9 4.9 0 0 0-4.1 2.5c-1.8 3-.5 7.5 1.2 10 .8 1.2 1.8 2.5 3.1 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.4a10 10 0 0 0 1.4-2.9 4.4 4.4 0 0 1-2.7-4.1ZM14.2 5.6A4.5 4.5 0 0 0 15.3 2a4.6 4.6 0 0 0-3 1.6 4.3 4.3 0 0 0-1.1 3.4 3.8 3.8 0 0 0 3-1.4Z" />
  </svg>
);

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6l-1.2 4.4c-.1.4.3.7.6.5l5.2-3.4c.2 0 .5.1.7.1 5.5 0 10-3.5 10-7.9S17.5 3 12 3Z" />
  </svg>
);

const PROVIDER_CONFIG: Record<string, { label: string; icon: ReactNode; className: string }> = {
  google: {
    label: 'Google로 시작하기',
    icon: <GoogleIcon />,
    className: 'bg-neutral-100 text-black hover:bg-neutral-200',
  },
  apple: {
    label: 'Apple로 시작하기',
    icon: <AppleIcon />,
    className: 'bg-black text-white hover:bg-neutral-800',
  },
  kakao: {
    label: 'Kakao로 시작하기',
    icon: <KakaoIcon />,
    className: 'bg-[#FEE500] text-black hover:bg-[#f5dc00]',
  },
};

interface SocialLoginButtonProps {
  provider: keyof typeof PROVIDER_CONFIG;
  onClick: () => void;
  disabled?: boolean;
}

const SocialLoginButton = ({ provider, onClick, disabled = false }: SocialLoginButtonProps) => {
  const { label, icon, className } = PROVIDER_CONFIG[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors',
        className,
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
};

export default SocialLoginButton;
```

- [ ] **Step 5: 빌드/린트 확인 (Task 2 + 3 통합 검증)**

Run: `npm run build && npm run lint`
Expected: 둘 다 통과. `/intro`에서 슬라이드 스와이프·다음 버튼·dots 동작 확인.

- [ ] **Step 6: 커밋 안내 (사용자 수동, 2건)**

```bash
git add src/components/ui/Button.tsx src/components/ui/Input.tsx src/features/auth/components/PasswordInput.tsx src/features/auth/components/SocialLoginButton.tsx
git commit -m "feat: pill 버튼·비밀번호 토글 입력·소셜 버튼 신규 디자인 적용"
```

```bash
git add src/pages/auth/ServiceIntroPage.tsx src/features/auth/components/IntroSlide.tsx src/assets/images/intro-1.png src/assets/images/intro-2.png src/assets/images/intro-3.png
git commit -m "feat: 서비스 소개 슬라이드 Swiper 기반 리디자인"
```

---

### Task 4: 로그인 화면 리디자인

**Files:**
- Modify: `src/pages/auth/LoginPage.tsx` (전체 재작성)

**Interfaces:**
- Consumes: `PasswordInput`, `SocialLoginButton`, `Button`(shape="pill"), `useLogin`(기존 그대로)
- Produces: "회원가입하기" → `navigate('/signup')` (Task 5의 라우트에 의존 — Task 5 전까지는 404 이동)

- [ ] **Step 1: LoginPage 재작성**

`src/pages/auth/LoginPage.tsx` 전체 교체:

```tsx
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/features/auth/components/PasswordInput';
import SocialLoginButton from '@/features/auth/components/SocialLoginButton';
import useLogin from '@/features/auth/hooks/useLogin';

const loginSchema = z.object({
  email: z.email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요'),
});

type LoginForm = z.infer<typeof loginSchema>;

const SOCIAL_PROVIDERS = ['google', 'apple', 'kakao'] as const;

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useLogin();
  // TODO: API 연동 시 "로그인 상태 유지" 여부를 토큰 저장 방식에 반영
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => handleLogin('email', data.email, data.password);

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col px-6 pb-10">
        <h1 className="py-10 text-center text-lg font-semibold">로그인</h1>

        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <PasswordInput
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          {/* 로그인 상태 유지 / 비밀번호 찾기 */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 accent-black"
              />
              로그인 상태 유지
            </label>
            {/* 비밀번호 찾기 - 페이지 미구현, 추후 제거 가능성 있어 표시만 */}
            <span className="text-neutral-600">비밀번호 찾기</span>
          </div>

          <Button
            type="submit"
            label={isLoading ? '로그인 중...' : '로그인'}
            shape="pill"
            disabled={isLoading}
            fullWidth
            size="md"
            className="mt-2"
          />
        </form>

        {/* 구분선 */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">또는</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        {/* 소셜 로그인 */}
        <div className="flex flex-col gap-3">
          {SOCIAL_PROVIDERS.map((provider) => (
            <SocialLoginButton
              key={provider}
              provider={provider}
              onClick={() => handleLogin(provider)}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* 회원가입 이동 */}
        <p className="mt-8 text-center text-sm text-neutral-400">
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-semibold text-black"
          >
            회원가입하기
          </button>
        </p>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
```

- [ ] **Step 2: 빌드/린트 확인**

Run: `npm run build && npm run lint`
Expected: 통과

- [ ] **Step 3: 커밋 안내 (사용자 수동)**

```bash
git add src/pages/auth/LoginPage.tsx
git commit -m "feat: 로그인 화면 신규 디자인 적용"
```

---

### Task 5: 회원가입 화면 + mock 가입 API + 라우트

**Files:**
- Modify: `src/features/auth/api/authApi.ts` (signup 추가)
- Create: `src/pages/auth/SignupPage.tsx`
- Modify: `src/router/index.tsx` (`/signup` 라우트 추가)

**Interfaces:**
- Consumes: `PasswordInput`, `Button`(shape="pill"), `Input`
- Produces: `signup(params: SignupParams): Promise<void>` — `SignupParams = { name: string; username: string; email: string; password: string }`

- [ ] **Step 1: authApi에 signup 추가**

`src/features/auth/api/authApi.ts` 맨 아래에 추가:

```ts
export interface SignupParams {
  name: string;
  username: string;
  email: string;
  password: string;
}

/**
 * mock 회원가입 - 백엔드 연동 시 이 함수 내부만 실제 API 호출로 교체한다.
 * 입력 형식 검증은 폼(zod)에서 끝나므로 실패 케이스가 없다.
 */
export const signup = async (_params: SignupParams): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
};
```

- [ ] **Step 2: SignupPage 생성**

`src/pages/auth/SignupPage.tsx` 신규:

```tsx
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { signup } from '@/features/auth/api/authApi';
import PasswordInput from '@/features/auth/components/PasswordInput';

const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  username: z
    .string()
    .min(4, '아이디는 4자 이상이어야 해요')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문과 숫자만 사용할 수 있어요'),
  email: z.email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요'),
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signup(data);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col px-6 pb-10">
        <h1 className="py-10 text-center text-lg font-semibold">회원가입</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="이름"
            placeholder="이름을 입력해주세요"
            autoComplete="name"
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요"
            autoComplete="username"
            errorMessage={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <PasswordInput
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            autoComplete="new-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            label={isLoading ? '가입 중...' : '회원가입'}
            shape="pill"
            disabled={isLoading}
            fullWidth
            size="md"
            className="mt-2"
          />
        </form>

        {/* 로그인 이동 */}
        <p className="mt-8 text-center text-sm text-neutral-400">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-black"
          >
            로그인하기
          </button>
        </p>
      </div>
    </PageLayout>
  );
};

export default SignupPage;
```

- [ ] **Step 3: 라우트 추가**

`src/router/index.tsx`:

import 구역(진입/계정)에 추가:
```tsx
import SignupPage from '../pages/auth/SignupPage';
```

`{ path: '/login', element: <LoginPage /> },` 바로 아래에 추가:
```tsx
    { path: '/signup', element: <SignupPage /> },
```

- [ ] **Step 4: 빌드/린트 확인**

Run: `npm run build && npm run lint`
Expected: 통과

- [ ] **Step 5: 커밋 안내 (사용자 수동)**

```bash
git add src/features/auth/api/authApi.ts src/pages/auth/SignupPage.tsx src/router/index.tsx
git commit -m "feat: 회원가입 화면 및 mock 가입 API 추가"
```

---

### Task 6: 전체 플로우 수동 검증

**Files:** 없음 (검증 전용)

- [ ] **Step 1: 빌드/린트 최종 확인**

Run: `npm run build && npm run lint`
Expected: 통과

- [ ] **Step 2: dev 서버 전체 플로우 확인**

Run: `npm run dev` 후 브라우저에서 확인 (localStorage 초기화 + 로그아웃 상태에서 시작):

1. `/` — 글자 낙하 → Fitty. 정렬 → Fit Your Style 슬라이드 인 → `/intro` 자동 이동
2. `/intro` — 스와이프/다음 버튼/dots 동작, 3번 슬라이드 "시작하기" → `/login`
3. `/login` — 폼 검증 오류(잘못된 이메일, 짧은 비밀번호), 비밀번호 👁 토글, "회원가입하기" → `/signup`
4. `/signup` — 4개 필드 검증(아이디 영문·숫자 4자+), "회원가입" → `/login`, "로그인하기" → `/login`
5. `/login` — mock 로그인 성공 → 온보딩 미완료 시 `/onboarding`, 완료 시 `/home`
6. 재방문: `/` → (인트로 시청 기록) `/login`, 로그인 상태면 `/home`
7. 소셜 버튼 3종 mock 로그인 동작

- [ ] **Step 3: 설계/계획 문서 커밋 안내 (사용자 수동, 아직 안 했다면)**

```bash
git add docs/entry-auth-design.md docs/entry-auth-plan.md
git commit -m "docs: 진입/계정 리디자인 설계 및 구현 계획 문서 추가"
```
