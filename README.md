# 🧥 Fitty Frontend

> AI 기반 실사 코디 합성 서비스 **Fitty**의 프론트엔드 레포지토리입니다.

---

## 📌 목차

- [기술 스택](#기술-스택)
- [팀원 및 역할](#팀원-및-역할)
- [폴더 구조](#폴더-구조)
- [Git 브랜치 전략](#git-브랜치-전략)
- [커밋 컨벤션](#커밋-컨벤션)
- [PR 규칙](#pr-규칙)
- [코드 컨벤션](#코드-컨벤션)
- [개발 환경 세팅](#개발-환경-세팅)

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS |
| 상태 관리 | Zustand |
| 서버 상태 | TanStack Query (React Query v5) |
| HTTP Client | Axios |
| Form | React Hook Form + Zod |
| Routing | React Router DOM v6 |
| 코드 품질 | ESLint, Prettier |

---

## 👥 팀원 및 역할

| 이름 | 담당 |
|------|------|
| | |
| | |

---

## 📁 폴더 구조

```
fity-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                   # 정적 리소스
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/               # 전역 공통 컴포넌트 (Atomic)
│   │   ├── ui/                   # Button, Input, Badge, Modal, Chip, BottomSheet 등
│   │   └── layout/               # Header, BottomNav, PageLayout 등
│   │
│   ├── features/                 # 도메인/기능 단위 모듈
│   │   ├── auth/                 # 0. 진입/계정 (Splash, 서비스소개, 로그인/회원가입)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   │
│   │   ├── onboarding/           # 1. 개인화 온보딩 (스타일취향, 체형분석, 아바타)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   │
│   │   ├── closet/               # 2. 디지털 옷장 (등록, 연동, 아이템 관리)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   │
│   │   ├── home/                 # 3. 홈 대시보드
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── api/
│   │   │
│   │   ├── styling/              # 4. 코디 생성 (날짜/상황/무드/아이템 선택, AI 생성)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   │
│   │   ├── outfit/               # 5. 코디 결과 & 저장 목록 (완성, 저장, 공유)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   │
│   │   ├── commerce/             # 6. 커머스 연결 (추천 상품, 상품 상세)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types.ts
│   │   │
│   │   ├── myoutfit/             # 7. 내 코디 (저장 목록, 상세)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── api/
│   │   │
│   │   └── mypage/               # 8. 마이페이지 (프로필, 스타 관리, 설정)
│   │       ├── components/
│   │       ├── hooks/
│   │       └── api/
│   │
│   ├── hooks/                    # 전역 공통 커스텀 훅
│   │   ├── useDebounce.ts
│   │   └── useIntersectionObserver.ts
│   │
│   ├── lib/                      # 외부 라이브러리 설정
│   │   ├── axios.ts              # axios 인스턴스 + 인터셉터
│   │   └── queryClient.ts        # TanStack Query 클라이언트
│   │
│   ├── pages/                    # 라우터 연결 페이지 (껍데기만)
│   │   ├── auth/
│   │   │   ├── SplashPage.tsx
│   │   │   ├── ServiceIntroPage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── onboarding/
│   │   │   ├── StylePreferencePage.tsx
│   │   │   ├── PhotoUploadPage.tsx
│   │   │   ├── BodyAnalysisPage.tsx
│   │   │   └── AvatarGeneratePage.tsx
│   │   ├── closet/
│   │   │   ├── ClosetHomePage.tsx
│   │   │   ├── ClosetRegisterPage.tsx
│   │   │   └── ClosetItemDetailPage.tsx
│   │   ├── home/
│   │   │   └── HomePage.tsx
│   │   ├── styling/
│   │   │   ├── StylingStartPage.tsx
│   │   │   ├── StylingDatePage.tsx
│   │   │   ├── StylingMoodPage.tsx
│   │   │   ├── StylingItemSelectPage.tsx
│   │   │   └── StylingLoadingPage.tsx
│   │   ├── outfit/
│   │   │   ├── OutfitResultPage.tsx
│   │   │   ├── OutfitSavePage.tsx
│   │   │   └── OutfitSharePage.tsx
│   │   ├── commerce/
│   │   │   ├── ProductListPage.tsx
│   │   │   └── ProductDetailPage.tsx
│   │   ├── myoutfit/
│   │   │   ├── MyOutfitListPage.tsx
│   │   │   └── MyOutfitDetailPage.tsx
│   │   └── mypage/
│   │       └── MyPage.tsx
│   │
│   ├── router/                   # React Router 라우팅 설정
│   │   ├── index.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── store/                    # Zustand 전역 상태
│   │   ├── authStore.ts          # 인증 상태
│   │   ├── onboardingStore.ts    # 온보딩 진행 상태
│   │   └── stylingStore.ts       # 코디 생성 플로우 상태
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── types/                    # 전역 공통 TypeScript 타입
│   │   └── index.ts
│   │
│   ├── utils/                    # 순수 유틸 함수
│   │   └── format.ts
│   │
│   ├── mocks/                    # Mock 데이터 (개발용)
│   │   └── data/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

> **pages vs features 분리 원칙**
> - `pages/` : 라우터와 1:1 연결되는 최상위 컨테이너. 레이아웃 조합 + features 불러오기만 담당
> - `features/` : 실제 UI 컴포넌트, 비즈니스 로직, API 호출이 모두 여기에 집중
> - `components/ui/` : 어느 도메인에도 종속되지 않는 순수 공통 컴포넌트

---

## 🌿 Git 브랜치 전략

### 브랜치 구조

```
main
└── dev
    ├── feature/기능명
    ├── fix/버그명
    └── chore/작업명
```

| 브랜치 | 용도 |
|--------|------|
| `main` | 배포용 브랜치. 직접 push 금지, PR + 리뷰 후 merge |
| `dev` | 개발 통합 브랜치. 모든 feature는 여기로 머지 |
| `feature/xxx` | 기능 단위 개발 브랜치 |
| `fix/xxx` | 버그 수정 브랜치 |
| `chore/xxx` | 빌드 설정, 패키지, 문서 등 비기능 작업 |

### 브랜치 네이밍 규칙

```
feature/auth-login
feature/closet-upload
feature/styling-ai-generate
fix/auth-token-refresh
chore/eslint-config
```

### 머지 규칙

- `feature/*` → `dev` : PR 생성 후 팀원 1인 이상 승인 시 merge
- `dev` → `main` : 팀 전체 합의 후 merge (스프린트 마감 시)
- **직접 push 금지** (main, dev 모두)

---

## ✍️ 커밋 컨벤션

```
타입: 제목 (#이슈번호)

예시:
feat: 로그인 이메일/소셜 로그인 구현 (#12)
fix: 토큰 갱신 시 무한루프 버그 수정 (#15)
style: 버튼 컴포넌트 hover 스타일 수정
```

### 커밋 타입

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | 코드 포맷, 세미콜론 등 로직 변경 없는 수정 |
| `refactor` | 리팩토링 (기능 변경 없음) |
| `chore` | 빌드 설정, 패키지 관리, 기타 잡무 |
| `docs` | 문서 수정 (README 등) |
| `test` | 테스트 코드 추가/수정 |
| `design` | UI/스타일 작업 |
| `remove` | 파일 삭제 |

### 커밋 규칙

- 제목은 **50자 이내**, 마침표 없이 작성
- 현재 시제 사용: `추가했다` ❌ → `추가` ✅
- 한 커밋에 하나의 변경사항만 담기

---

## 🔀 PR 규칙

### PR 제목 형식

```
[feat] 로그인 화면 구현
[fix] 옷장 아이템 태그 수정 버그 해결
[chore] ESLint 설정 추가
```

### PR 작성 가이드

```markdown
## 작업 내용
- 구현한 기능이나 수정 내용 요약

## 변경 사항
- [ ] 항목 1
- [ ] 항목 2

## 스크린샷 (UI 변경 시)
<!-- 변경 전/후 스크린샷 첨부 -->

## 참고 사항
<!-- 리뷰어가 알아야 할 정보 -->
```

### PR 규칙

- PR은 **기능 단위**로 작게 나누기 (리뷰 부담 최소화)
- 셀프 리뷰 후 PR 생성
- 승인 없이 **본인이 merge 금지**
- Conflict 발생 시 본인이 직접 해결 후 재요청

---

## 🎨 코드 컨벤션

### ESLint / Prettier

`.eslintrc.cjs`
```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};
```

`.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `LoginForm.tsx` |
| 훅 파일 | camelCase | `useAuthStore.ts` |
| 유틸 파일 | camelCase | `formatDate.ts` |
| 타입/인터페이스 | PascalCase | `UserProfile`, `OutfitItem` |
| 변수/함수 | camelCase | `isLoggedIn`, `fetchOutfit` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS 클래스 | TailwindCSS 유틸 우선 | — |

### 컴포넌트 작성 규칙

- 함수형 컴포넌트 + 화살표 함수 사용
- `export default`는 파일 하단에
- Props 타입은 `interface`로 별도 선언
- 한 파일에 하나의 컴포넌트 원칙

```tsx
// ✅ 올바른 예시
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
```

### import 순서

```ts
// 1. React 관련
import { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// 3. 내부 절대경로 (features, components, hooks, ...)
import LoginForm from '@/features/auth/components/LoginForm';
import Button from '@/components/ui/Button';

// 4. 상대경로
import './styles.css';
```

---

## ⚙️ 개발 환경 세팅

### 사전 준비

- Node.js 20.x 이상
- pnpm (또는 npm)

### 설치 및 실행

```bash
# 레포 클론
git clone https://github.com/Fitty2026/fity-frontend.git
cd fity-frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경변수

`.env` 파일을 루트에 생성 후 아래 값을 채워주세요.

```env
VITE_API_BASE_URL=https://api.fitty.com
VITE_KAKAO_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=
```

> `.env`은 `.gitignore`에 포함되어 있어 절대 커밋하지 마세요.

---

## 📎 참고 링크

- [Figma 디자인](https://www.figma.com/design/m58eG0RN63GHEErsR2YybE/Fitty)
- [백엔드 레포지토리](#)
- [API 문서](#)