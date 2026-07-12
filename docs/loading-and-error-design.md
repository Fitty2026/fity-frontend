# 로딩 및 에러 공통 화면 설계

- 날짜: 2026-07-12
- 브랜치: `feature/loading-and-error`
- 범위: 공통 LoadingScreen/ErrorScreen 컴포넌트 + 라우터 전역 에러 연결 + 404 화면 + dev 전용 미리보기
- 참고: Figma Frame 9(로딩/에러)는 빈 프레임 — 기존 진입/계정 화면과 동일한 흑백 미니멀 톤으로 자체 디자인
- 범위 제외: 버튼 내 인라인 스피너, react-query 연동(각 기능 브랜치에서 LoadingScreen을 가져다 씀), 토스트/스낵바

## 1. 컴포넌트

### LoadingScreen (`src/components/ui/LoadingScreen.tsx`)

- 영역 중앙에 검은 링 스피너 + 안내 문구.
- 스피너는 CSS만 사용: `h-10 w-10 rounded-full border-4 border-neutral-200 border-t-black animate-spin`.
- props: `message?: string` (기본값 `'불러오는 중...'`).
- 부모 영역을 채우는 방식(`flex flex-1 min-h-[60vh] items-center justify-center ...`)으로, 페이지 안에서든 전체 화면에서든 쓸 수 있게 한다.

### ErrorScreen (`src/components/ui/ErrorScreen.tsx`)

- 중앙 정렬: 경고 아이콘(인라인 SVG, 원 + 느낌표, `text-neutral-300` 계열) → 제목 → 설명 → 버튼.
- props:
  - `title?: string` (기본 `'문제가 발생했어요'`)
  - `description?: string` (기본 `'잠시 후 다시 시도해주세요'`)
  - `onRetry?: () => void` — 있으면 "다시 시도" primary 버튼 표시
- "홈으로" ghost 버튼은 항상 표시 (`navigate('/')`).
- 기존 `Button` 컴포넌트 재사용.

## 2. 전역 연결 (라우터)

`src/router/index.tsx`:

- 기존 flat 라우트 배열을 경로 없는 루트 라우트의 `children`으로 감싸고, 루트에 `errorElement: <RouteErrorPage />`를 단다. **기존 경로·엘리먼트는 전부 그대로** (구조만 이동).
- 루트 라우트는 `<Outlet />`만 렌더링한다.
- `{ path: '*', element: <Navigate to="/" replace /> }` → `{ path: '*', element: <NotFoundPage /> }`로 교체.

### RouteErrorPage (`src/pages/error/RouteErrorPage.tsx`)

- `useRouteError()`로 에러 수신, `console.error`로 기록.
- `ErrorScreen` 표시 — onRetry는 `window.location.reload()`.
- 전체 화면 레이아웃: `PageLayout`(showHeader/showBottomNav off)으로 감싼다.

### NotFoundPage (`src/pages/error/NotFoundPage.tsx`)

- `ErrorScreen` 재사용: title `'페이지를 찾을 수 없어요'`, description `'주소가 잘못되었거나 삭제된 페이지예요'`, onRetry 없음(홈으로 버튼만).
- `PageLayout`(showHeader/showBottomNav off)으로 감싼다.

## 3. dev 전용 미리보기

### DevPreviewPage (`src/pages/dev/DevPreviewPage.tsx`)

- 상단에 탭 버튼(로딩 / 에러 / 404), 아래에 해당 화면 렌더링.
- 라우터에서 `import.meta.env.DEV`일 때만 `/dev` 라우트를 등록한다:
  ```ts
  ...(import.meta.env.DEV ? [{ path: '/dev', element: <DevPreviewPage /> }] : []),
  ```
- 프로덕션 빌드에서는 라우트가 등록되지 않는다 (분기 상수화로 트리쉐이킹 여부와 무관하게 접근 불가).

## 4. 검증

- `npm run build` 통과, 작업 파일 eslint 통과.
- dev 서버(`localhost:5173`)에서:
  1. `/dev` — 로딩/에러/404 화면 탭 전환 확인
  2. `/없는경로` — 404 화면 표시, "홈으로" 버튼 → `/`
  3. 기존 플로우(스플래시→인트로→로그인) 회귀 없음 확인
