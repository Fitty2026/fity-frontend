# 🧥 Fitty Frontend

> AI 기반 실사 코디 합성 서비스 **Fitty**의 프론트엔드 레포지토리입니다.

🔗 **배포 링크**: https://fitty-2026.vercel.app

---

## 📌 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [팀원 및 역할](#팀원-및-역할)
- [폴더 구조](#폴더-구조)
- [Git 브랜치 전략](#git-브랜치-전략)
- [커밋 컨벤션](#커밋-컨벤션)
- [PR 규칙](#pr-규칙)
- [코드 컨벤션](#코드-컨벤션)
- [개발 환경 세팅](#개발-환경-세팅)

---

## ✨ 주요 기능

| 도메인 | 기능 |
|--------|------|
| 진입/계정 | 스플래시, 서비스 소개, 이메일·소셜 로그인, 회원가입 |
| 개인화 온보딩 | 이용 약관 동의, 스타일 취향 스와이프 선택, 체형 입력·사진 분석, 체형 결과 확인 |
| 디지털 옷장 | 쇼핑몰 캡처/스마트 영수증/직접 입력으로 아이템 등록, 아이템 목록·검색·필터·정렬, 상세 조회 및 태그·카테고리·브랜드·메모 수정, 삭제 |
| 코디 생성 | 날짜 선택 → 날씨 연동(OpenWeatherMap) → 무드 선택 → 아이템 선택 → AI 코디 생성 |
| 코디 플레이 | 생성된 코디 확인, 아이템 교체 리터치, 코디 저장 |
| 코디 공유 | 코디 이미지 다운로드, Web Share API 공유 |
| 내 코디 | 저장한 코디 목록·상세, 편집(아이템 추가/교체), 삭제 및 최근 삭제 복구 |
| 커머스 | 추천 상품 목록, 상품 상세 |
| 마이페이지 | 프로필(이름·스타일·체형) 수정, 회원 탈퇴 |
| 공통 | 로그인 가드(ProtectedRoute), 401 세션 만료 처리, 로딩/빈 데이터/오류 화면, 404·라우트 에러 페이지 |

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS v4 |
| 상태 관리 | Zustand |
| 서버 상태 | TanStack Query (React Query v5) |
| HTTP Client | Axios |
| Form | React Hook Form + Zod |
| Routing | React Router DOM v7 |
| UI 라이브러리 | Swiper (스타일 취향 스와이프) |
| 코드 품질 | ESLint, Prettier |

---

## 👥 팀원 및 역할

| 이름 | 담당 |
|------|------|
| 몽모/김채연 | 0. 진입/개정&로딩 및 에러, 1. 개인화 온보딩 / 배포 |
| 아리/이재인 | 2. 디지털 옷장 온보딩, 3. 코디 생성 / QA |
| 제비/최지범 | 4. 코디 플레이, 5. 스타일 완성&코디 보기 / 시연준비 |

---

## 📁 폴더 구조

```
fity-frontend/
├── public/                       # 정적 파일 (favicon 등)
├── docs/                         # 화면·기능 설계 문서
├── src/
│   ├── assets/                   # 정적 리소스
│   │   ├── icons/
│   │   └── images/               # 도메인별 이미지 (body, closet, moods, ...)
│   │
│   ├── components/               # 전역 공통 컴포넌트
│   │   ├── ui/                   # Button, Input, Badge, BottomSheet, LoadingScreen, ErrorScreen
│   │   └── layout/               # Header, BottomNav, PageLayout
│   │
│   ├── features/                 # 도메인/기능 단위 모듈 (components / hooks / api)
│   │   ├── auth/                 # 0. 진입/계정 (로그인, 회원가입, 소셜 로그인)
│   │   ├── onboarding/           # 1. 개인화 온보딩 (약관, 스타일 취향, 체형 분석)
│   │   ├── closet/               # 2. 디지털 옷장 (등록 플로우, 아이템 관리, 검색)
│   │   ├── styling/              # 3. 코디 생성 (날짜/날씨/무드/아이템 선택, AI 생성)
│   │   ├── codyplay/             # 4. 코디 플레이 (결과 확인, 리터치, 공유)
│   │   ├── myoutfit/             # 5. 내 코디 (목록, 상세, 편집, 삭제/복구)
│   │   ├── commerce/             # 6. 커머스 (추천 상품)
│   │   └── mypage/               # 7. 마이페이지 (프로필 수정, 탈퇴)
│   │
│   ├── lib/                      # 외부 라이브러리 설정
│   │   ├── axios.ts              # axios 인스턴스 + 토큰/에러 인터셉터
│   │   ├── apiError.ts           # 서버 공통 에러 래퍼 → ApiError 변환
│   │   └── queryClient.ts        # TanStack Query 클라이언트
│   │
│   ├── pages/                    # 라우터 연결 페이지 (레이아웃 조합 + features 사용)
│   │   ├── auth/                 # Splash, ServiceIntro, Login, Signup
│   │   ├── onboarding/           # Consent, StyleSwipe/Confirm, BodyType/Photo/Analysis/Result
│   │   ├── closet/               # ClosetHome, 등록 플로우(캡처/영수증/직접입력), 아이템 목록/상세
│   │   ├── styling/              # StylingStart, Method, Date, Weather, Mood, ItemSelect, Loading
│   │   ├── codyplay/             # CodyPlay, CodyRetouch, OutfitShare
│   │   ├── myoutfit/             # MyOutfit 목록/상세/편집/삭제/최근삭제
│   │   ├── commerce/             # ProductList, ProductDetail
│   │   ├── mypage/               # MyPage, 프로필/이름/스타일/체형 수정, 탈퇴
│   │   └── error/                # NotFound, RouteError
│   │
│   ├── router/                   # React Router 라우팅 설정
│   │   ├── index.tsx
│   │   └── ProtectedRoute.tsx    # 로그인 가드
│   │
│   ├── store/                    # Zustand 전역 상태
│   │   ├── authStore.ts          # 인증 상태
│   │   ├── onboardingStore.ts    # 온보딩 진행 상태
│   │   ├── closetStore.ts        # 옷장 등록 플로우 상태
│   │   └── stylingStore.ts       # 코디 생성 플로우 상태
│   │
│   ├── types/                    # 전역 공통 TypeScript 타입
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 # Tailwind 진입점 + 전역 스타일
│
├── .env.example                  # 환경변수 템플릿
├── eslint.config.js
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
└── develop
    ├── feature/기능명
    ├── fix/버그명
    └── chore/작업명
```

| 브랜치 | 용도 |
|--------|------|
| `main` | 배포용 브랜치. 직접 push 금지, PR + 리뷰 후 merge |
| `develop` | 개발 통합 브랜치. 모든 feature는 여기로 머지 |
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

- `feature/*` → `develop` : PR 생성 후 팀원 1인 이상 승인 시 merge
- `develop` → `main` : 팀 전체 합의 후 merge (스프린트 마감 시)
- **직접 push 금지** (main, develop 모두)

---

## ✍️ 커밋 컨벤션

```
타입: 제목 

예시:
feat: 로그인 이메일/소셜 로그인 구현 
fix: 토큰 갱신 시 무한루프 버그 수정 
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

### PR 제목 형식(커밋 메시지와 똑같은 형식)

```
feat: 로그인 화면 구현
fix: 옷장 아이템 태그 수정 버그 해결
chore: ESLint 설정 추가
```

### PR 작성 가이드

```markdown
📌작업 내용
* 구현한 기능이나 수정 내용 요약

✅ 변경 사항
- [ ] 항목 1
- [ ] 항목 2

🧪 스크린샷 (UI 변경 시)
<!-- 변경 전/후 스크린샷 첨부 -->

📝 참고 사항
<!-- 리뷰어가 알아야 할 정보 -->
```

### PR 규칙

- PR은 **기능 단위**로 작게 나누기 (리뷰 부담 최소화)
- 셀프 리뷰 후 PR 생성
- 승인 없이 **본인이 merge 금지**
- Conflict 발생 시 **본인이 직접 해결** 후 재요청

---

## 🎨 코드 컨벤션

### ESLint / Prettier

- ESLint 설정은 루트의 `eslint.config.js`(flat config)에 있습니다 — TypeScript 권장 규칙 + `react-hooks` + `react-refresh` + Prettier 충돌 제거(`eslint-config-prettier`).
- `npm run lint`로 검사합니다.

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
- npm

### 설치 및 실행

```bash
# 레포 클론
git clone https://github.com/Fitty2026/fity-frontend.git
cd fity-frontend

# 패키지 설치
npm install

# 환경변수 설정 (아래 참고)
cp .env.example .env

# 개발 서버 실행
npm run dev
```

### 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입체크(`tsc -b`) + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint 검사 |

### 환경변수

`.env.example`을 복사해 `.env`를 만들고 값을 채워주세요.

```env
# 백엔드 API 서버 주소
VITE_API_BASE_URL=

# OpenWeatherMap API 키 (없으면 코디 생성 시 날씨 화면을 건너뜁니다)
VITE_OPENWEATHER_API_KEY=
```

> `.env`는 `.gitignore`에 포함되어 있어 커밋되지 않습니다. 토큰·API 키를 절대 커밋하지 마세요.

---

## 📎 참고 링크

- [Figma 디자인](https://www.figma.com/design/m58eG0RN63GHEErsR2YybE/Fitty)