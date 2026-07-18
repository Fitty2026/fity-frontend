# 온보딩 프로필 설정 4단계 설계

- 날짜: 2026-07-12
- 브랜치: `feature/profile-setup`
- 범위: `/onboarding`(스타일 선택), `/onboarding/photo`(체형 사진), `/onboarding/analysis`(체형 분석), `/onboarding/avatar`(아바타 결과) 4개 화면 + 로그인 후 온보딩 분기 연결
- 참고: Figma PREF-01 / Photo Upload / 분석 로딩 / AVA-01. 2번째 화면의 카피 모순(제목 "사진으로 옷 등록하기" vs 체형 촬영 가이드)은 **체형 사진용 카피로 통일**하기로 결정.
- 범위 제외: 실제 체형 분석/아바타 생성 API(전부 mock), 아바타 실사 이미지(placeholder)

## 1. 플로우

```
로그인 성공 ─┬─ isOnboardingComplete → /home
             └─ 미완료 → /onboarding
/onboarding ── 다음(1개 이상 선택 시 활성) → /onboarding/photo
/onboarding/photo ─┬─ 분석 시작하기(사진 있을 때 활성) → /onboarding/analysis
                   └─ 나중에 하기 → completeOnboarding() + /home
/onboarding/analysis ── 2.5초 mock 진행 후 자동 → /onboarding/avatar
/onboarding/avatar ─┬─ 다음 → completeOnboarding() + /home
                    └─ 추가 사진으로 정확도 올리기 → /onboarding/photo
```

## 2. 스토어 변경 (`src/store/onboardingStore.ts`)

- zustand `persist` 미들웨어 추가. localStorage 키 `fitty-onboarding`.
- `partialize`로 `selectedStyles`, `isOnboardingComplete`만 저장 (File/objectURL은 저장 불가·불필요).
- 기존 액션/필드는 그대로 유지.

## 3. useLogin 분기 (`src/features/auth/hooks/useLogin.ts`)

- `navigate('/home')` → 온보딩 완료 여부에 따라 분기:
  ```ts
  const isOnboardingComplete = useOnboardingStore.getState().isOnboardingComplete;
  navigate(isOnboardingComplete ? '/home' : '/onboarding', { replace: true });
  ```

## 4. 화면별 구현

### StylePreferencePage (`/onboarding`)

- 상단: 제목 "어떤 스타일을 좋아하세요?", 부제목 "마음에 드는 스타일을 선택해주세요. 많이 선택할수록 더 정확해져요." (Figma 문구 그대로)
- 이미지 그리드: **2열 masonry** (`columns-2 gap-3`, 각 카드 `break-inside-avoid`). 이미지 6장은 높이가 제각각(원본 비율 유지).
- `StyleCard` 컴포넌트 (`src/features/onboarding/components/StyleCard.tsx`):
  - props: `{ imageSrc: string; label: StyleTag; selected: boolean; onToggle: () => void }`
  - 이미지 + 선택 시 우상단에 체크 아이콘(`src/assets/icons/selected.png`, 28px) 오버레이. 라벨 텍스트는 표시하지 않음(Figma에 없음).
- 이미지→태그 매핑 (순서 임의, 추후 조정 가능):
  | 파일 | 태그 |
  |---|---|
  | style-1.png | 포멀 |
  | style-2.png | 페미닌 |
  | style-3.png | 미니멀 |
  | style-4.png | 캐주얼 |
  | style-5.png | 빈티지 |
  | style-6.png | 스트리트 |
- 선택 상태는 `onboardingStore.selectedStyles` + `toggleStyle` 그대로 사용.
- 하단 고정 "다음" 버튼: `selectedStyles.length === 0`이면 disabled. 클릭 → `/onboarding/photo`.
- 헤더/바텀네비 없음 (`PageLayout showHeader=false showBottomNav=false`).

### PhotoUploadPage (`/onboarding/photo`)

- 헤더: 뒤로가기 + 제목 "체형 사진 등록하기" (뒤로 → `/onboarding`).
- 업로드 박스(점선 테두리, rounded):
  - 사진 없음: 카메라 아이콘(원형 배경) + "전신 사진을 업로드해주세요" + "AI가 체형을 분석해 나에게 맞는 아바타를 만들어드려요"
  - 사진 있음: 선택한 이미지 미리보기(object-cover)
- 버튼 2개: "사진 촬영하기"(`<input type="file" accept="image/*" capture="environment">`), "갤러리에서 선택"(`<input type="file" accept="image/*">`) — 숨긴 input을 라벨 버튼으로 트리거. 파일 선택 시 `store.setBodyImage(file, URL.createObjectURL(file))`.
- "촬영 가이드" 카드 (Figma 문구 그대로): 전신이 보이도록 촬영해주세요 / 몸이 잘 보이는 옷을 입어주세요 / 밝은 배경에서 촬영해주세요
- "안심하세요" 카드 (Figma 문구 그대로): 업로드된 사진은 체형 분석에만 사용돼요. 외부에 공유되지 않아요
- 하단: "분석 시작하기" primary (사진 없으면 disabled) → `/onboarding/analysis`. 그 아래 "나중에 하기" 텍스트 버튼 → `completeOnboarding()` + `/home`.

### BodyAnalysisPage (`/onboarding/analysis`)

- 중앙: 업로드한 체형 사진(`bodyImageUrl`)을 `blur-md opacity-60`으로 표시, 없으면 회색 박스(`bg-neutral-200`). rounded 컨테이너.
- 제목 "체형을 분석하고 있어요", 부제 "비율을 계산하는 중이에요" (Figma 문구 그대로)
- 진행 바: 트랙(`bg-neutral-200`) 위에 검은 바가 2.5초 동안 0→100% (CSS `transition-[width] duration-[2500ms]`, 마운트 직후 width 전환 트리거).
- 하단 안내: "잠시만 기다려주세요, 곧 결과를 보여드릴게요"
- 마운트 2.5초 후 `/onboarding/avatar`로 자동 이동 (`replace: true`, 타이머 클린업 필수).

### AvatarGeneratePage (`/onboarding/avatar`)

- 중앙: 아바타 placeholder 회색 박스(Figma도 placeholder, `aspect-[3/4]`), `store.avatarImageUrl` 있으면 이미지 표시.
- "내 체형 기반 아바타" 칩(회색 pill), 설명 "체형 비율과 스타일 데이터를 기반으로 생성됐어요" (Figma 문구 그대로)
- 하단: "다음" primary → `completeOnboarding()` + `/home`(replace). "추가 사진으로 정확도 올리기" secondary → `/onboarding/photo`.

## 5. 검증

- `npm run build` + 작업 파일 eslint 통과.
- dev 서버 수동 확인:
  1. localStorage 비우고 mock 로그인 → `/onboarding` 자동 진입
  2. 스타일 미선택 시 다음 disabled → 선택 시 체크 오버레이 + 활성화
  3. 사진 선택 → 미리보기 + 분석 시작하기 활성화 → 분석 진행 바 → 아바타 → 다음 → `/home`
  4. 재로그인(로그아웃 후) 시 온보딩 스킵하고 `/home` 직행
  5. "나중에 하기"로도 완료 처리되는지 확인
