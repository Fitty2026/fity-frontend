# 온보딩 1차(동의·취향) 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 로그인 후 온보딩 중 동의 → 스타일 취향 선택/확인 단계를 블롭 인트로 애니메이션과 함께 구현한다.

**Architecture:** 각 단계는 독립 라우트(`/onboarding`, `/onboarding/style`, `/onboarding/style/confirm`)이며, 블롭 인트로는 페이지 내부 phase(2초 자동 전환)로 처리한다. 공용 `OnboardingLayout`(Fitty 헤더 + 진행 바)과 `BlobIntro`(CSS 블롭)를 두고, 취향 수집은 기존 `onboardingStore.selectedStyles`를 재사용한다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, react-router-dom v7, Swiper 14, zustand

## Global Constraints

- 커밋/푸시는 **사용자가 직접** 수행 — 각 태스크 마지막 스텝은 복붙용 명령 제시만.
- 테스트 프레임워크 부재 → `npm run build` + `npm run lint` + dev 서버 수동 확인으로 검증.
- 기존 린트 에러 7건(BottomSheet, Outfit 계열)은 이번 범위 밖 — 새 파일에서 에러 0건 유지.
- 문구는 설계 문서(`docs/onboarding-design.md`) 확정 문구 그대로 사용.
- 진행률: 동의 0.15 / 취향 선택 0.4 / 취향 확인 0.55.
- 블롭 인트로 자동 전환 2000ms.

---

### Task 1: 기반 — 스토어 확장 + OnboardingLayout + BlobIntro + 블롭 keyframes

**Files:**
- Modify: `src/store/onboardingStore.ts` (marketingAgreed 추가)
- Modify: `src/index.css` (blob keyframes 추가)
- Create: `src/features/onboarding/components/OnboardingLayout.tsx`
- Create: `src/features/onboarding/components/BlobIntro.tsx`

**Interfaces:**
- Produces:
  - `onboardingStore`: `marketingAgreed: boolean`, `setMarketingAgreed(agreed: boolean): void` 추가 (persist 대상 포함)
  - `OnboardingLayout`: `{ progress: number; children: React.ReactNode }` — Fitty 헤더 + 보라 진행 바
  - `BlobIntro`: `{ message: string; size: 'sm' | 'md' | 'lg' }` — 이전 단계 크기에서 커지며 꿀렁이는 블롭 + 문구

- [ ] **Step 1: onboardingStore에 marketingAgreed 추가**

`src/store/onboardingStore.ts`에서 interface에 아래 2줄 추가:

```ts
  marketingAgreed: boolean;
  setMarketingAgreed: (agreed: boolean) => void;
```

초기값·액션 추가 (`isOnboardingComplete: false,` 아래에 `marketingAgreed: false,` / `completeOnboarding` 아래에):

```ts
      setMarketingAgreed: (agreed) => set({ marketingAgreed: agreed }),
```

`reset`에 `marketingAgreed: false,` 추가, `partialize` 반환 객체에 `marketingAgreed: state.marketingAgreed,` 추가.

- [ ] **Step 2: index.css에 블롭 keyframes 추가**

`src/index.css` 맨 아래에 추가:

```css
/* 온보딩 블롭 - 유기적으로 꿀렁이는 border-radius 변형 */
@keyframes blob-wobble {
  0%,
  100% {
    border-radius: 58% 42% 55% 45% / 52% 58% 42% 48%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 45% 55% 48% 52% / 60% 44% 56% 40%;
    transform: rotate(3deg) scale(1.03);
  }
  50% {
    border-radius: 52% 48% 60% 40% / 45% 55% 48% 52%;
    transform: rotate(-2deg) scale(0.97);
  }
  75% {
    border-radius: 48% 52% 42% 58% / 55% 45% 60% 40%;
    transform: rotate(2deg) scale(1.02);
  }
}
```

- [ ] **Step 3: OnboardingLayout 생성**

`src/features/onboarding/components/OnboardingLayout.tsx`:

```tsx
import PageLayout from '@/components/layout/PageeLayout';

interface OnboardingLayoutProps {
  /** 진행 바 비율 (0~1) */
  progress: number;
  children: React.ReactNode;
}

/** 온보딩 공용 레이아웃 - Fitty 타이틀 + 보라색 진행 바 */
const OnboardingLayout = ({ progress, children }: OnboardingLayoutProps) => (
  <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
    <header className="border-b border-neutral-100 pb-3 pt-4 text-center text-lg font-bold">
      Fitty
    </header>
    <div className="h-1 w-full bg-neutral-100">
      <div
        className="h-full rounded-r-full bg-violet-400 transition-all duration-500 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
    <div className="flex flex-1 flex-col">{children}</div>
  </PageLayout>
);

export default OnboardingLayout;
```

- [ ] **Step 4: BlobIntro 생성**

`src/features/onboarding/components/BlobIntro.tsx`:

```tsx
import { useEffect, useState } from 'react';

interface BlobIntroProps {
  message: string;
  size: 'sm' | 'md' | 'lg';
}

/** 단계별 목표 크기(px)와, 등장 시 시작 크기(이전 단계 크기) */
const TARGET_PX = { sm: 120, md: 220, lg: 320 } as const;
const START_PX = { sm: 120, md: 120, lg: 220 } as const;

/**
 * 온보딩 단계 인트로의 꿀렁이는 물풍선 블롭.
 * 디자이너 영상(webm/Lottie)으로 교체 시 이 컴포넌트 내부만 바꾸면 된다.
 */
const BlobIntro = ({ message, size }: BlobIntroProps) => {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const px = grown ? TARGET_PX[size] : START_PX[size];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 pb-24">
      <p className="text-base font-medium">{message}</p>
      <div
        className="relative"
        style={{
          width: px,
          height: px,
          transition: 'width 1.2s ease-out, height 1.2s ease-out',
        }}
      >
        {/* 바깥 블롭 */}
        <div
          className="absolute inset-0"
          style={{
            animation: 'blob-wobble 6s ease-in-out infinite',
            background:
              'linear-gradient(135deg, rgba(196, 181, 253, 0.55), rgba(221, 214, 254, 0.3) 45%, rgba(167, 139, 250, 0.45))',
            boxShadow: 'inset 0 0 24px rgba(255, 255, 255, 0.7), 0 8px 24px rgba(167, 139, 250, 0.25)',
          }}
        />
        {/* 안쪽 블롭 - 반대 방향으로 느리게 꿀렁여 유기적인 느낌 */}
        <div
          className="absolute inset-[8%]"
          style={{
            animation: 'blob-wobble 7.5s ease-in-out infinite reverse',
            background:
              'linear-gradient(315deg, rgba(233, 213, 255, 0.5), rgba(255, 255, 255, 0.35) 55%, rgba(196, 181, 253, 0.4))',
          }}
        />
        {/* 광택 하이라이트 */}
        <div
          className="absolute left-[18%] top-[14%] h-[22%] w-[30%] rounded-full bg-white/70"
          style={{ filter: 'blur(6px)' }}
        />
      </div>
    </div>
  );
};

export default BlobIntro;
```

- [ ] **Step 5: 빌드/린트 확인**

Run: `npm run build && npm run lint`
Expected: 빌드 통과, 새 파일 린트 에러 0건 (기존 7건만 유지)

- [ ] **Step 6: 커밋 안내 (사용자 수동)**

```bash
git add src/store/onboardingStore.ts src/index.css src/features/onboarding/components/OnboardingLayout.tsx src/features/onboarding/components/BlobIntro.tsx
git commit -m "feat: 온보딩 공용 레이아웃·블롭 인트로 및 마케팅 동의 상태 추가"
```

---

### Task 2: 동의 화면 (ConsentPage) + 라우터 교체

**Files:**
- Create: `src/pages/onboarding/ConsentPage.tsx`
- Modify: `src/router/index.tsx` (온보딩 라우트 교체 — StyleSwipePage/StyleConfirmPage는 Task 3~4에서 생성되므로 라우터 수정은 두 파일 생성 후 검증)

**Interfaces:**
- Consumes: `OnboardingLayout`, `BlobIntro`, `Button`(shape="pill"), `BottomSheet`, `useOnboardingStore.setMarketingAgreed`
- Produces: `/onboarding` 라우트에서 필수 동의 후 `/onboarding/style`로 이동

- [ ] **Step 1: ConsentPage 생성**

`src/pages/onboarding/ConsentPage.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2000;

const CONSENT_ITEMS = [
  { key: 'terms', label: '(필수) 이용 약관 동의', required: true },
  { key: 'privacy', label: '(필수) 개인정보 수집 및 이용 동의', required: true },
  { key: 'aiImage', label: '(필수) AI 생성 및 이미지 활용 동의서', required: true },
  {
    key: 'marketing',
    label: '(선택) 마케팅 정보 수집 및 수신 동의',
    required: false,
    description: '다양한 이벤트 및 혜택, 서비스 소식 정보를 보내 드립니다',
  },
] as const;

type ConsentKey = (typeof CONSENT_ITEMS)[number]['key'];

/** 약관 본문은 아직 없어 더미 텍스트를 보여준다 */
const DUMMY_TERMS_BODY =
  '약관 본문이 준비 중이에요.\n서비스 오픈 전에 실제 약관 내용으로 교체될 예정입니다.';

/** 원형 체크 아이콘 */
const CheckCircle = ({ checked }: { checked: boolean }) => (
  <span
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
      checked ? 'border-black bg-black text-white' : 'border-neutral-300 bg-white text-transparent'
    }`}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L19 7" />
    </svg>
  </span>
);

const ConsentPage = () => {
  const navigate = useNavigate();
  const setMarketingAgreed = useOnboardingStore((s) => s.setMarketingAgreed);
  const [showIntro, setShowIntro] = useState(true);
  const [agreed, setAgreed] = useState<Record<ConsentKey, boolean>>({
    terms: false,
    privacy: false,
    aiImage: false,
    marketing: false,
  });
  const [openedTerms, setOpenedTerms] = useState<(typeof CONSENT_ITEMS)[number] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const allAgreed = CONSENT_ITEMS.every((item) => agreed[item.key]);
  const requiredAgreed = CONSENT_ITEMS.filter((i) => i.required).every((i) => agreed[i.key]);

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreed({ terms: next, privacy: next, aiImage: next, marketing: next });
  };

  const toggleOne = (key: ConsentKey) => {
    setAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    setMarketingAgreed(agreed.marketing);
    navigate('/onboarding/style');
  };

  return (
    <OnboardingLayout progress={0.15}>
      {showIntro ? (
        <BlobIntro message="이제 시작해요" size="sm" />
      ) : (
        <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
          {/* F 로고 */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-extrabold text-white">
            F
          </div>

          <p className="mt-6 text-center text-base font-semibold leading-relaxed">
            Fitty를 원활하게 이용하기 위해서는
            <br />
            아래 권한이 필요해요
          </p>

          {/* 전체 동의 */}
          <button
            type="button"
            onClick={toggleAll}
            className="mt-8 flex w-full items-center gap-3 rounded-xl bg-neutral-100 px-4 py-4"
          >
            <CheckCircle checked={allAgreed} />
            <span className="text-sm font-semibold">약관 전체 동의</span>
          </button>

          {/* 개별 항목 */}
          <div className="mt-3 flex flex-col gap-4 rounded-xl border border-neutral-100 px-4 py-4">
            {CONSENT_ITEMS.map((item) => (
              <div key={item.key} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => toggleOne(item.key)} aria-label={item.label}>
                    <CheckCircle checked={agreed[item.key]} />
                  </button>
                  <span className="flex-1 text-sm text-neutral-700">{item.label}</span>
                  <button
                    type="button"
                    aria-label={`${item.label} 상세 보기`}
                    onClick={() => setOpenedTerms(item)}
                    className="px-1 text-neutral-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                {'description' in item && (
                  <p className="pl-9 text-xs text-neutral-400">{item.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button
              label="다음"
              shape="pill"
              fullWidth
              disabled={!requiredAgreed}
              onClick={handleNext}
            />
          </div>

          {/* 약관 상세 더미 바텀시트 */}
          <BottomSheet
            isOpen={openedTerms !== null}
            onClose={() => setOpenedTerms(null)}
            title={openedTerms?.label}
          >
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
              {DUMMY_TERMS_BODY}
            </p>
          </BottomSheet>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default ConsentPage;
```

- [ ] **Step 2: 빌드 확인은 Task 4(라우터 교체) 후 통합 수행** — ConsentPage는 라우터 연결 전이라 단독으로는 미사용 파일 상태.

---

### Task 3: 취향 선택 (StyleSwipePage) + 타일 상수

**Files:**
- Create: `src/features/onboarding/constants.ts`
- Create: `src/pages/onboarding/StyleSwipePage.tsx`

**Interfaces:**
- Consumes: `OnboardingLayout`, `BlobIntro`, `Button`, Swiper, `useOnboardingStore.selectedStyles/toggleStyle`
- Produces:
  - `STYLE_TILES: { id: string; imageSrc: string; tag: StyleTag }[]` (`@/features/onboarding/constants`)
  - 수집 = `selectedStyles`에 태그 추가 → Task 4의 확인 화면이 이 데이터를 읽음

- [ ] **Step 1: 타일 상수 생성**

`src/features/onboarding/constants.ts`:

```ts
import style1 from '@/assets/images/style-1.png';
import style2 from '@/assets/images/style-2.png';
import style3 from '@/assets/images/style-3.png';
import style4 from '@/assets/images/style-4.png';
import style5 from '@/assets/images/style-5.png';
import style6 from '@/assets/images/style-6.png';
import type { StyleTag } from '@/types';

export interface StyleTile {
  id: string;
  imageSrc: string;
  tag: StyleTag;
}

/** 취향 선택 카드에 쓰는 스타일 타일 - 기존 스타일 이미지·태그 재사용 */
export const STYLE_TILES: StyleTile[] = [
  { id: 'tile-1', imageSrc: style1, tag: '포멀' },
  { id: 'tile-2', imageSrc: style2, tag: '페미닌' },
  { id: 'tile-3', imageSrc: style3, tag: '미니멀' },
  { id: 'tile-4', imageSrc: style4, tag: '캐주얼' },
  { id: 'tile-5', imageSrc: style5, tag: '빈티지' },
  { id: 'tile-6', imageSrc: style6, tag: '스트리트' },
];
```

- [ ] **Step 2: StyleSwipePage 생성**

`src/pages/onboarding/StyleSwipePage.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import Button from '@/components/ui/Button';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { STYLE_TILES } from '@/features/onboarding/constants';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2000;
/** 아래로 이만큼(px) 이상 끌면 수집으로 판정 */
const COLLECT_THRESHOLD_PX = 80;
/** 수집 애니메이션(카드가 아래로 빠지는) 시간 */
const COLLECT_ANIMATION_MS = 300;

const StyleSwipePage = () => {
  const navigate = useNavigate();
  const selectedStyles = useOnboardingStore((s) => s.selectedStyles);
  const toggleStyle = useOnboardingStore((s) => s.toggleStyle);

  const [showIntro, setShowIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // 아직 수집하지 않은 타일만 캐러셀에 남긴다
  const remaining = STYLE_TILES.filter((tile) => !selectedStyles.includes(tile.tag));
  // 루프는 3장 이상일 때만 - 2장 이하에서 loop를 켜면 같은 카드가 양옆에 중복 표시됨
  const loopEnabled = remaining.length > 2;

  const handlePointerDown = (x: number, y: number) => {
    dragStart.current = { x, y };
  };

  const handlePointerMove = (x: number, y: number) => {
    if (!dragStart.current || leavingId) return;
    const dx = x - dragStart.current.x;
    const dy = y - dragStart.current.y;
    // 세로 의도(아래 방향)일 때만 카드를 따라 내린다
    if (dy > 0 && dy > Math.abs(dx)) setDragY(dy);
  };

  const handlePointerUp = (tileId: string, tag: (typeof STYLE_TILES)[number]['tag']) => {
    if (!dragStart.current) return;
    dragStart.current = null;

    if (dragY > COLLECT_THRESHOLD_PX) {
      // 수집 확정 - 카드가 아래로 빠진 뒤 스토어에 반영되며 캐러셀에서 제거된다
      setLeavingId(tileId);
      setTimeout(() => {
        toggleStyle(tag);
        setLeavingId(null);
        setDragY(0);
      }, COLLECT_ANIMATION_MS);
    } else {
      setDragY(0);
    }
  };

  return (
    <OnboardingLayout progress={0.4}>
      {showIntro ? (
        <BlobIntro message="취향을 알아볼게요" size="md" />
      ) : (
        <div className="flex flex-1 flex-col pb-8 pt-10">
          <div className="px-6 text-center">
            <h2 className="text-lg font-semibold leading-relaxed">
              선호하는 스타일을
              <br />
              아래로 스와이프해주세요
            </h2>
            <p className="mt-1 text-xs text-neutral-400">많이 모을 수록 더 정확해져요</p>
          </div>

          {/* 카드 캐러셀 */}
          <div className="mt-6 flex flex-1 items-center overflow-hidden">
            {remaining.length === 0 ? (
              <p className="w-full text-center text-sm text-neutral-500">
                모든 스타일을 모았어요!
              </p>
            ) : (
              <Swiper
                // 카드 수가 변할 때 loop 재계산을 위해 재마운트
                key={remaining.map((t) => t.id).join('-')}
                className="h-full w-full"
                slidesPerView="auto"
                centeredSlides
                spaceBetween={16}
                loop={loopEnabled}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  // 카드 수집으로 재마운트되면 activeIndex를 다시 맞춘다
                  setActiveIndex(swiper.realIndex);
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              >
                {remaining.map((tile, i) => {
                  const isActive = i === activeIndex;
                  const isLeaving = leavingId === tile.id;
                  const offsetY = isLeaving ? 480 : isActive ? dragY : 0;
                  return (
                    <SwiperSlide key={tile.id} className="!w-[62%]">
                      <div
                        className="mx-auto h-full max-h-[420px] overflow-hidden rounded-2xl bg-neutral-100"
                        style={{
                          transform: `translateY(${offsetY}px)`,
                          opacity: isLeaving ? 0 : 1,
                          transition: dragStart.current
                            ? 'none'
                            : `transform ${COLLECT_ANIMATION_MS}ms ease-in, opacity ${COLLECT_ANIMATION_MS}ms ease-in`,
                        }}
                        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
                        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
                        onTouchEnd={() => handlePointerUp(tile.id, tile.tag)}
                        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                        onMouseUp={() => handlePointerUp(tile.id, tile.tag)}
                        onMouseLeave={() => handlePointerUp(tile.id, tile.tag)}
                      >
                        <img
                          src={tile.imageSrc}
                          alt={`${tile.tag} 스타일`}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>

          <div className="mt-6 px-6">
            <Button
              label="다음"
              shape="pill"
              fullWidth
              disabled={selectedStyles.length === 0}
              onClick={() => navigate('/onboarding/style/confirm')}
            />
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default StyleSwipePage;
```

- [ ] **Step 3: 빌드 확인은 Task 4 후 통합 수행**

---

### Task 4: 취향 확인 (StyleConfirmPage) + 라우터 교체 + 통합 검증

**Files:**
- Create: `src/pages/onboarding/StyleConfirmPage.tsx`
- Modify: `src/router/index.tsx`

**Interfaces:**
- Consumes: `STYLE_TILES`, `OnboardingLayout`, `Button`, `useAuthStore.user`, `useOnboardingStore.selectedStyles/completeOnboarding`

- [ ] **Step 1: StyleConfirmPage 생성**

`src/pages/onboarding/StyleConfirmPage.tsx`:

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { STYLE_TILES } from '@/features/onboarding/constants';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';

const StyleConfirmPage = () => {
  const navigate = useNavigate();
  const nickname = useAuthStore((s) => s.user?.nickname) ?? '회원';
  const selectedStyles = useOnboardingStore((s) => s.selectedStyles);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const collected = STYLE_TILES.filter((tile) => selectedStyles.includes(tile.tag));

  // 수집한 카드 없이 직접 진입하면 선택 화면으로 돌려보낸다
  useEffect(() => {
    if (collected.length === 0) navigate('/onboarding/style', { replace: true });
  }, [collected.length, navigate]);

  const handleNext = () => {
    // TODO: 체형 입력 단계 구현 시 완료 처리 대신 체형 인트로로 이동
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <OnboardingLayout progress={0.55}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        <div className="px-6 text-center">
          <h2 className="text-lg font-semibold">{nickname}님의 취향을 모아왔어요!</h2>
          <p className="mt-1 text-xs text-neutral-400">이런 스타일을 추구하시는 군요</p>
        </div>

        {/* 수집한 타일 캐러셀 */}
        <div className="mt-6 flex flex-1 items-center overflow-hidden">
          <Swiper
            className="h-full w-full"
            slidesPerView="auto"
            centeredSlides
            spaceBetween={16}
          >
            {collected.map((tile) => (
              <SwiperSlide key={tile.id} className="!w-[62%]">
                <div className="mx-auto h-full max-h-[420px] overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={tile.imageSrc}
                    alt={`${tile.tag} 스타일`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-6 px-6">
          <Button label="다음" shape="pill" fullWidth onClick={handleNext} />
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default StyleConfirmPage;
```

- [ ] **Step 2: 라우터 교체**

`src/router/index.tsx`에서 온보딩 import 4줄을 아래로 교체:

```tsx
// 1. 온보딩
import ConsentPage from '../pages/onboarding/ConsentPage';
import StyleSwipePage from '../pages/onboarding/StyleSwipePage';
import StyleConfirmPage from '../pages/onboarding/StyleConfirmPage';
```

온보딩 라우트 4개(`/onboarding`, `/onboarding/photo`, `/onboarding/analysis`, `/onboarding/avatar`)를 아래 3개로 교체:

```tsx
    // ── 온보딩 (로그인 후 최초 1회) ───────────────
    {
      path: '/onboarding',
      element: <ProtectedRoute><ConsentPage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/style',
      element: <ProtectedRoute><StyleSwipePage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/style/confirm',
      element: <ProtectedRoute><StyleConfirmPage /></ProtectedRoute>,
    },
```

- [ ] **Step 3: 빌드/린트 통합 검증 (Task 2~4)**

Run: `npm run build && npm run lint`
Expected: 빌드 통과, 새 파일 린트 에러 0건. (기존 온보딩 페이지 4개는 라우트에서만 빠지고 파일은 남음 — 미사용이어도 빌드에 영향 없음)

- [ ] **Step 4: 커밋 안내 (사용자 수동, 3건)**

```bash
git add src/pages/onboarding/ConsentPage.tsx
git commit -m "feat: 온보딩 동의 화면 구현"
```

```bash
git add src/features/onboarding/constants.ts src/pages/onboarding/StyleSwipePage.tsx
git commit -m "feat: 스타일 취향 스와이프 수집 화면 구현"
```

```bash
git add src/pages/onboarding/StyleConfirmPage.tsx src/router/index.tsx
git commit -m "feat: 취향 확인 화면 및 온보딩 라우트 개편"
```

---

### Task 5: 전체 플로우 수동 검증

**Files:** 없음 (검증 전용)

- [ ] **Step 1: dev 서버 확인**

Run: `npm run dev` 후 브라우저 확인 (localStorage에서 `fitty-onboarding` 삭제 + 로그인 상태):

1. 로그인 → `/onboarding`: 블롭(작게) 꿀렁 2초 → 동의 화면
2. 전체 동의 ↔ 개별 체크 동기화, `>` 바텀시트, 필수 3개 체크 시 다음 활성
3. `/onboarding/style`: 블롭이 sm 크기에서 md로 커지며 꿀렁 2초 → 카드 캐러셀
4. 좌우 무한 루프 스와이프, 카드 아래로 드래그 → 수집·즉시 제거, 남은 카드 2장 이하 시 루프 해제, 6장 모두 수집 시 안내 문구
5. 1장 이상 수집 시 다음 활성 → 확인 화면: 닉네임 + 수집 타일만 표시
6. 다음 → `/home`, 재로그인 시 온보딩 스킵 (`isOnboardingComplete`)
