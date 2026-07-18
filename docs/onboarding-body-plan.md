# 온보딩 2차(체형 입력) 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 체형 타입 선택 → 사진 촬영/업로드 → mock AI 분석 → 결과 확인의 체형 온보딩을 구현하고 기존 미사용 온보딩 코드를 정리한다.

**Architecture:** 6개 라우트(`/onboarding/body*`)로 구성. 카메라는 getUserMedia + canvas 캡처(실패 시 파일 선택 fallback), 분석은 3초 mock API. 상태는 `onboardingStore`를 개편해 `bodyType`/`bodyPhotoUrls`/`analysisResult`로 관리한다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, react-router-dom v7, Swiper 14, zustand, getUserMedia

## Global Constraints

- 커밋/푸시는 사용자가 직접 — 태스크 끝에 복붙 명령만 제시.
- 검증: `npm run build` + `npm run lint`(기존 7건 외 신규 0건) + dev 수동 확인.
- 문구·수치는 `docs/onboarding-body-design.md` 확정값 그대로.
- 진행 바: 타입 0.7 / 사진 0.8 / 분석 0.9 / 결과 1.0. 블롭 인트로 2.5초.
- 에셋: `src/assets/images/body/{straight,wave,natural,mannequin}.png`.

---

### Task 1: 스토어 개편 + mock 분석 API + OnboardingLayout 건너뛰기

**Files:**
- Create: `src/features/onboarding/api/bodyAnalysisApi.ts`
- Modify: `src/store/onboardingStore.ts`, `src/types/index.ts`, `src/features/onboarding/components/OnboardingLayout.tsx`

**Interfaces (Produces):**

```ts
// bodyAnalysisApi.ts
export interface BodyMeasurement { label: string; value: string; side: 'left' | 'right' }
export interface BodyTrait { label: string; value: string; percent: number }
export interface BodyAnalysisResult {
  typeName: string;            // '슬림 스트레이트'
  typeDescription: string;     // '전체적으로 균형이 좋고 슬림한 체형이에요'
  celebrities: string[];       // ['강민경', '크리스탈', '차정원']
  measurements: BodyMeasurement[]; // 어깨너비 38cm(left) ~ 다리길이 61cm(right) 7개
  traits: BodyTrait[];         // 상체 비율 47%/하체 비율 53%/체형 밸런스 균형형/골격 중간/근육량 보통
}
export const analyzeBody: () => Promise<BodyAnalysisResult>; // 3초 지연 후 고정 결과

// onboardingStore
export type BodyType = 'straight' | 'wave' | 'natural';
// 추가: bodyType(persist)/bodyPhotoUrls/analysisResult + setBodyType/setBodyPhotoUrls/setAnalysisResult
// 제거: bodyImageFile/bodyImageUrl/avatarImageUrl/setBodyImage/setAvatarImage

// OnboardingLayout: onSkip?: () => void — 우상단 "건너뛰기 >" 버튼
```

- [ ] Step 1: `bodyAnalysisApi.ts` 작성 — `MOCK_DELAY_MS = 3000`, 피그마 수치 그대로 상수화, "백엔드 연동 시 이 파일 내부만 교체" 주석.
- [ ] Step 2: `onboardingStore` 개편 — 위 인터페이스대로. `partialize`는 `selectedStyles/isOnboardingComplete/marketingAgreed/bodyType`만. `reset`도 갱신.
- [ ] Step 3: `types/index.ts`의 구식 `OnboardingState`를 store 실제 구조에 맞게 수정(bodyImageUrl 등 제거).
- [ ] Step 4: `OnboardingLayout`에 `onSkip` prop 추가 — 헤더 우측 absolute "건너뛰기 >" (text-sm text-neutral-400).
- [ ] Step 5: `npm run build && npm run lint` 통과 확인.
- [ ] Step 6: 커밋 안내

```bash
git add src/features/onboarding/api/bodyAnalysisApi.ts src/store/onboardingStore.ts src/types/index.ts src/features/onboarding/components/OnboardingLayout.tsx
git commit -m "feat: 체형 온보딩 기반 — mock 분석 API·스토어 개편·건너뛰기 옵션"
```

---

### Task 2: 체형 타입 선택 (BodyTypePage)

**Files:**
- Create: `src/features/onboarding/bodyConstants.ts` — `BODY_TYPES: { type: BodyType; label: '스트레이트 타입'...; imageSrc; description }[]` (설계 문서의 설명 문구 그대로)
- Create: `src/pages/onboarding/BodyTypePage.tsx`

**동작:**
- [ ] Step 1: 블롭 인트로 phase — `BlobIntro message="이번엔 체형을 알아볼게요" size="lg"`, 2.5초 후 본문. 진행 바 0.7, `onSkip` = 완료 후 홈.
- [ ] Step 2: 본문 — "체형을 선택해주세요" + 3열 이미지·라벨. 클릭 시 선택 + 설명 오버레이(반투명 카드: 타입명 + 설명, 바깥 클릭 시 닫힘·선택 유지). "확인" pill: 선택 전 비활성 → `setBodyType` 후 `/onboarding/body/photo`.
- [ ] Step 3: 빌드/린트 후 커밋 안내

```bash
git add src/features/onboarding/bodyConstants.ts src/pages/onboarding/BodyTypePage.tsx
git commit -m "feat: 체형 타입 선택 화면 구현"
```

---

### Task 3: 사진 안내/카메라/업로드

**Files:**
- Create: `src/pages/onboarding/BodyPhotoGuidePage.tsx`, `src/pages/onboarding/BodyCameraPage.tsx`, `src/pages/onboarding/BodyUploadPage.tsx`
- Create: `src/features/onboarding/components/PhotoFrameCard.tsx` — 마네킹/체크 등 안내 이미지 카드 + 안심 문구 공용 컴포넌트

**BodyPhotoGuidePage (progress 0.8, onSkip):**
- [ ] phase 'fix': "카메라를 고정하고\n전신을 촬영해주세요" + 마네킹 카드 + "다음" → phase 'bright'
- [ ] phase 'bright': "밝은 배경에서 촬영해주세요" + 마네킹 카드 + "사진 업로드"(회색 pill, 갤러리 아이콘) → `/onboarding/body/upload` / "촬영하기"(검정 pill, 카메라 아이콘) → `/onboarding/body/camera`

**BodyCameraPage (progress 0.8):** 핵심 로직:

```tsx
// phase: 'guide' | 'camera' | 'done', 카메라 진입 시
const streamRef = useRef<MediaStream | null>(null);
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
    setCameraError(false);
  } catch {
    setCameraError(true); // 파일 선택 fallback 안내 표시
  }
};
// 언마운트/이탈 시 streamRef.current?.getTracks().forEach(t => t.stop())
const capture = () => {
  const video = videoRef.current; if (!video) return;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext('2d')?.drawImage(video, 0, 0);
  canvas.toBlob((blob) => {
    if (!blob) return;
    setBodyPhotoUrls([URL.createObjectURL(blob)]);
    stopStream(); setPhase('done');
  }, 'image/jpeg', 0.9);
};
```

- [ ] 'guide': "천천히 한 바퀴 돌아주세요" + 마네킹 카드 + "촬영하기" → 'camera'
- [ ] 'camera': 검은 배경 + `<video autoPlay playsInline muted>` + 좌상단 X(스트림 정리 후 'guide') + 보라 점 원형 프로그레스 오버레이(SVG 점 20개, 순차 밝아지는 stagger 애니메이션) + 좌하단 갤러리 버튼(파일 선택 → done) + 셔터. 권한 실패 시 안내 문구 + 파일 선택 버튼.
- [ ] 'done': "사진이 업로드되었어요" + 체크 카드 + "다음" → `/onboarding/body/analysis`

**BodyUploadPage (progress 0.8, onSkip):**
- [ ] 'select': "체형이 잘 보이는\n정면, 측면, 후면 사진을 업로드 해주세요" + 마네킹 캐러셀(Swiper) + "사진 업로드"(input file accept="image/*" multiple, 최대 3장) → objectURL 배열 저장 → 'done'
- [ ] 'done': "사진이 업로드되었어요" + 체크 카드 + "다음" → 'confirm'
- [ ] 'confirm': "업로드한 사진이 다음과 같나요?" + 업로드 사진 캐러셀 + "확인" → `/onboarding/body/analysis`
- [ ] 빌드/린트 후 커밋 안내

```bash
git add src/pages/onboarding/BodyPhotoGuidePage.tsx src/pages/onboarding/BodyCameraPage.tsx src/pages/onboarding/BodyUploadPage.tsx src/features/onboarding/components/PhotoFrameCard.tsx
git commit -m "feat: 체형 사진 촬영·업로드 화면 구현"
```

---

### Task 4: 분석 로딩/결과 + 라우터 + 정리

**Files:**
- Create: `src/pages/onboarding/BodyAnalysisPage.tsx`(신규 버전), `src/pages/onboarding/BodyResultPage.tsx`, `src/features/onboarding/components/HangerIcon.tsx`
- Modify: `src/router/index.tsx`, `src/pages/onboarding/StyleConfirmPage.tsx`
- Delete: `StylePreferencePage.tsx`, `PhotoUploadPage.tsx`, 구 `BodyAnalysisPage.tsx`, `AvatarGeneratePage.tsx`, `StyleCard.tsx`

**HangerIcon:** SVG 옷걸이(고리+삼각형+가로바 단일 path). props `state: 'loading' | 'done'` — loading: 회색 path 위에 보라 path가 `stroke-dasharray` 차오르는 애니메이션(keyframes `hanger-fill`), done: 전체 보라 + 중앙 체크 원.

**BodyAnalysisPage (progress 0.9):**
- [ ] mount 시 `analyzeBody()` 실행 → 로딩: "AI가 체형을 분석하고 있어요" + HangerIcon loading → resolve 시 `setAnalysisResult` + "체형이 분석되었어요" + HangerIcon done → 1.5초 후 `/onboarding/body/result` (replace)

**BodyResultPage (progress 1.0):**
- [ ] `analysisResult` 없으면 `/onboarding/body`로 replace 리다이렉트
- [ ] 'measurements' phase: "분석이 완료되었어요" + 사진 카드(`bodyPhotoUrls[0]` 없으면 회색) 좌우로 치수 라벨 7개(측 정렬) + "다시 분석하기"(secondary pill → `/onboarding/body/photo`) / "다음"(pill → 'final')
- [ ] 'final' phase: "{닉네임}님의 체형은\n{typeName} 체형이에요" + 카드(선택 타입 일러스트 + "체형 유형"/typeName/typeDescription + "이 유형과 같은 체형의 연예인" + celebrities) + "체형 특징" 바 5개(라벨 + 보라 진행 바 + 값) + "다시 분석하기" + "분석 결과 저장하고 시작하기" → `completeOnboarding()` + `/home`
- [ ] `StyleConfirmPage.handleNext` → `navigate('/onboarding/body')`로 변경 (completeOnboarding 제거)
- [ ] 라우터: `/onboarding/body`, `/body/photo`, `/body/camera`, `/body/upload`, `/body/analysis`, `/body/result` 6개 추가 (모두 ProtectedRoute)
- [ ] 구 페이지 4개 + StyleCard 삭제
- [ ] `npm run build && npm run lint` 통과 확인
- [ ] 커밋 안내 (2건)

```bash
git add src/features/onboarding/components/HangerIcon.tsx src/pages/onboarding/BodyAnalysisPage.tsx src/pages/onboarding/BodyResultPage.tsx src/index.css
git commit -m "feat: 체형 분석 로딩·결과 화면 구현"
```

```bash
git add src/router/index.tsx src/pages/onboarding/StyleConfirmPage.tsx src/pages/onboarding/StylePreferencePage.tsx src/pages/onboarding/PhotoUploadPage.tsx src/pages/onboarding/AvatarGeneratePage.tsx src/features/onboarding/components/StyleCard.tsx src/assets/images/body
git commit -m "feat: 체형 온보딩 라우트 연결 및 구 온보딩 페이지 정리"
```

---

### Task 5: 전체 플로우 수동 검증

- [ ] dev 서버에서: 취향 확인 → 체형 인트로(lg 블롭) → 타입 선택/설명 오버레이 → 촬영(권한 허용/거부 fallback)·업로드 양 경로 → 분석 로딩 3초 → 수치 → 최종 결과 → 홈. 건너뛰기·다시 분석하기 동작. 재로그인 시 온보딩 스킵.
