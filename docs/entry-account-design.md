# 진입/계정 화면 설계 (0. 진입 / 계정)

- 날짜: 2026-07-11
- 브랜치: `feature/onboarding`
- 범위: Figma "0. 진입 / 계정" 프레임의 5개 화면 — 스플래시, 서비스 인트로 1~3, 로그인
- 범위 제외: 회원가입 페이지, `/onboarding/*` 4단계(스타일 선택·사진 업로드·체형 분석·아바타 생성), 실제 백엔드/소셜 OAuth 연동

## 1. 플로우 & 라우팅

기존 라우터(`src/router/index.tsx`)의 경로를 그대로 사용한다. 새 라우트는 추가하지 않는다.

```
/ (Splash) ─ 1.5초 후 자동 이동 ─┬─ 로그인 상태 → /home
                                 └─ 비로그인 ─┬─ 인트로 미시청 → /intro
                                              └─ 인트로 시청함 → /login
/intro ─ "시작하기" 또는 "건너뛰기" → /login
/login ─ 로그인 성공 → /home
```

- 인트로 시청 여부는 `localStorage` 키 `fitty-intro-seen`에 저장한다. `/intro`에서 "시작하기" 또는 "건너뛰기"를 누르는 시점에 기록한다.
- 로그인 성공 후 원래 기획은 "최초 1회 온보딩(/onboarding)" 진입이지만, 이번 범위에서는 항상 `/home`으로 이동한다. 온보딩 분기는 온보딩 구현 브랜치에서 처리한다.

## 2. 화면별 구현

### SplashPage (`src/pages/auth/SplashPage.tsx`)

- 기존 컴포넌트 테스트 코드를 전부 제거하고 재작성한다.
- 중앙에 "Fitty" 텍스트 로고만 표시하는 미니멀 화면 (Figma splash가 빈 화면).
- 마운트 1.5초 후 위 플로우 규칙대로 `navigate(..., { replace: true })`.

### ServiceIntroPage (`src/pages/auth/ServiceIntroPage.tsx`)

- 단일 라우트에서 슬라이드 인덱스 state로 3개 슬라이드를 관리한다.
- 슬라이드 전환: 터치 스와이프(onTouchStart/onTouchEnd 좌표 비교) + 하단 dots 인디케이터(현재 위치 표시, 클릭 시 해당 슬라이드로 이동).
- 우상단 "건너뛰기" → `fitty-intro-seen` 기록 후 `/login`.
- 하단 "시작하기"(모든 슬라이드 동일) → `fitty-intro-seen` 기록 후 `/login`.
- 슬라이드 콘텐츠:
  1. "내 옷으로 코디를 완성하세요" — 이미 가지고 있는 옷만으로도 가장 잘 어울리는 스타일을 추천해드려요
  2. "취향과 체형에 맞는 코디 추천" — 스타일 취향과 체형을 분석해 나에게 가장 잘 어울리는 코디를 찾아드려요 (+ 캐주얼/미니멀/스트릿 Badge)
  3. "아바타로 미리 입어보세요" — 내 체형에 맞는 아바타에 코디를 적용해 실제 착용 모습을 미리 확인할 수 있어요
- 슬라이드 이미지는 에셋이 없으므로 회색 placeholder(`bg-neutral-200` 등)로 두고, 이미지 파일 교체만으로 대체 가능한 구조로 만든다.

### LoginPage (`src/pages/auth/LoginPage.tsx`)

- react-hook-form + zod(`@hookform/resolvers/zod`)로 폼 검증.
  - 이메일: 이메일 형식
  - 비밀번호: 6자 이상
- 레이아웃(Figma 기준): 뒤로가기 헤더("로그인" 타이틀) → "F" 로고 박스 → 안내 문구("빠르게 시작하고 내 옷으로 코디를 완성해보세요") → 이메일/비밀번호 Input → "이메일로 로그인"(primary) → "또는" 구분선 → Google/Apple/Kakao 버튼(secondary 계열) → "계정이 없으신가요? 회원가입".
- "이메일로 로그인" → mock 로그인 → 성공 시 `/home`.
- 소셜 버튼 3개도 동일한 mock 로그인 처리 (provider만 다르게 전달).
- "회원가입" 링크는 표시만 하고 동작 없음 (범위 외).
- 뒤로가기 → `/intro`.

## 3. Mock 인증 구조 (추후 API 교체 용이)

- `src/features/auth/api/authApi.ts`
  - `login(params: { provider: SocialProvider; email?: string; password?: string })` — 0.5초 지연 후 mock `User`와 mock 토큰을 반환하는 Promise. 실패 케이스 없음(형식 검증은 폼에서 완료).
  - 추후 이 파일 내부만 실제 `lib/axios` 호출로 교체한다.
- `src/features/auth/hooks/useLogin.ts`
  - `authApi.login` 호출 → `authStore.setUser` + `setToken` → `/home` 이동. 로딩 state 제공(버튼 disabled 용).
- `src/features/auth/components/`
  - `IntroSlide.tsx` — 인트로 슬라이드 1장 (이미지 영역 + 제목 + 설명 + 선택적 Badge 목록)
  - `SocialLoginButton.tsx` — provider별 라벨을 가진 소셜 로그인 버튼

기존 `authStore`, `Button`, `Input`, `Badge`, `PageLayout`(showHeader/showBottomNav off)을 그대로 재사용한다.

## 4. 검증

- 테스트 프레임워크가 아직 없으므로 자동화 테스트는 이번 범위에서 제외한다.
- `npm run build`, `npm run lint` 통과 확인.
- `npm run dev`로 dev 서버를 띄워 사용자가 `http://localhost:5173`에서 직접 플로우를 확인한다:
  1. `/` → 1.5초 후 `/intro` 자동 이동
  2. 인트로 스와이프/dots 동작, 건너뛰기·시작하기 → `/login`
  3. 폼 검증 오류 표시 (잘못된 이메일, 짧은 비밀번호)
  4. mock 로그인 성공 → `/home` 이동, 새로고침 후에도 로그인 유지(persist)
  5. 재방문 시 `/` → `/login` (인트로 스킵), 로그인 상태면 `/` → `/home`
