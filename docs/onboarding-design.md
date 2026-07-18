# 온보딩 1차 설계 (동의 + 스타일 취향)

- 날짜: 2026-07-18
- 브랜치: `feature/onboarding` (develop 기반, 진입/계정 리디자인 포함)
- 범위: 로그인 후 최초 1회 온보딩 중 **동의 → 스타일 취향 선택/확인**까지. 각 단계 진입 전 블롭(물풍선) 인트로 포함.
- 범위 제외: 체형 입력 단계(다음 차수), 실제 백엔드 연동(취향 수집 API 등), 약관 본문

## 1. 플로우 & 라우팅

```
로그인 성공 (isOnboardingComplete=false) → /onboarding
/onboarding               ConsentPage      : 블롭 인트로 "이제 시작해요"(2초) → 동의 화면
/onboarding/style         StyleSwipePage   : 블롭 인트로 "취향을 알아볼게요"(2초, 더 큰 블롭) → 카드 스와이프
/onboarding/style/confirm StyleConfirmPage : "OO님의 취향을 모아왔어요!" → 다음
```

- 블롭 인트로는 별도 라우트가 아니라 **각 단계 페이지 안의 phase**로 구현한다. 약 2초 후 본 내용으로 자동 전환. 상단 진행 바는 끊기지 않는다.
- 취향 확인의 "다음"은 체형 단계가 아직 없으므로 **온보딩 완료 처리(`completeOnboarding`) 후 `/home` 이동**. 체형 단계 구현 시 블롭 인트로 3("이번엔 체형을 알아볼게요")으로 연결하도록 TODO 주석을 남긴다.
- 기존 `/onboarding/photo`, `/onboarding/analysis`, `/onboarding/avatar` 라우트는 새 플로우에서 제거한다. 페이지 파일(PhotoUploadPage 등) 삭제는 체형 단계 구현 때 일괄 정리한다. `/onboarding`의 기존 StylePreferencePage 라우팅은 ConsentPage로 교체된다.

## 2. 공용 컴포넌트 (`src/features/onboarding/components/`)

### OnboardingLayout

- 상단 중앙 "Fitty" 타이틀 + 그 아래 보라색 진행 바.
- props: `progress` (0~1, 단계별 진행률), `children`.
- 진행률: 동의 0.15 → 취향 선택 0.4 → 취향 확인 0.55 (체형 단계에서 이어서 채움).

### BlobIntro

- props: `message` (안내 문구), `size` ('sm' | 'md' | 'lg' — 단계가 진행될수록 커짐).
- 꿀렁꿀렁: 여러 겹의 div에 유기적인 `border-radius` 변형 keyframes + 보라 계열 반투명 그라데이션/블러 하이라이트로 구현.
- 등장 시 이전 단계 크기에서 현재 크기로 커지는 scale 트랜지션 (sm→기본 등장, md는 sm 크기에서, lg는 md 크기에서 확대).
- 피그마의 홀로그램 질감을 CSS로 100% 재현하기 어려우면 디자이너 영상(webm/Lottie)으로 교체 예정 — 블롭 비주얼 부분만 분리해 교체가 쉽게 만든다.

## 3. 동의 화면 (ConsentPage, `/onboarding`)

- 검정 라운드 사각형 F 로고 + "Fitty를 원활하게 이용하기 위해서는 아래 권한이 필요해요" (중앙 정렬 2줄).
- "약관 전체 동의" 1줄(연회색 배경 라운드 박스) + 항목 4개 박스:
  1. (필수) 이용 약관 동의 `>`
  2. (필수) 개인정보 수집 및 이용 동의 `>`
  3. (필수) AI 생성 및 이미지 활용 동의서 `>`
  4. (선택) 마케팅 정보 수집 및 수신 동의 — 아래 소문구 "다양한 이벤트 및 혜택, 서비스 소식 정보를 보내 드립니다"
- 체크 동작: 전체 동의 토글 시 4개 일괄 체크/해제. 개별 체크가 4개 모두 되면 전체 동의도 체크, 하나라도 해제되면 전체 동의 해제.
- `>` 클릭 → 기존 `BottomSheet` 컴포넌트로 더미 약관 텍스트 표시 (본문은 placeholder).
- "다음" pill 버튼: **필수 3개 체크 시 활성**, 미충족 시 회색 비활성 → `/onboarding/style` 이동.
- 마케팅 동의 여부는 `onboardingStore.marketingAgreed`로 저장 (추후 API 전달용, persist 포함).

## 4. 취향 선택 (StyleSwipePage, `/onboarding/style`)

- 상단 문구: "선호하는 스타일을 아래로 스와이프해주세요" + 소문구 "많이 모을 수록 더 정확해져요" (+ 손가락 힌트 아이콘).
- **Swiper 캐러셀**: 가운데 카드 크게, 좌우 카드 일부 보임(centeredSlides + slidesPerView auto).
- **좌우 무한 루프**: Swiper `loop` 모드. 남은 카드가 2장 이하가 되면 루프를 끄고 일반 스와이프로 전환한다(동일 카드가 양옆에 중복 표시되는 문제 방지).
- 카드 데이터: 기존 `style-1~6.png` 타일 6장 + StyleTag 매핑(포멀/페미닌/미니멀/캐주얼/빈티지/스트리트) 재사용.
- **아래로 스와이프 = 수집**: 카드에서 세로 드래그(터치/마우스)를 감지해 임계값(약 80px) 초과 시 카드가 아래로 빠지는 애니메이션과 함께 수집 처리. 수집된 카드는 **즉시 캐러셀에서 제거**되고 다음 카드가 이어진다. 수집 = `onboardingStore.selectedStyles`에 해당 태그 추가 (백엔드 전송은 추후 API 연동 시).
- 6장 모두 수집하면 캐러셀 자리에 "모든 스타일을 모았어요" 안내 문구를 표시한다.
- 하단 "다음" pill 버튼: **1장 이상 수집 시 활성** → `/onboarding/style/confirm`.

## 5. 취향 확인 (StyleConfirmPage, `/onboarding/style/confirm`)

- "{닉네임}님의 취향을 모아왔어요!" (authStore `user.nickname`, 없으면 "회원") + 소문구 "이런 스타일을 추구하시는 군요".
- 수집한 타일만 같은 캐러셀 UI로 표시 (좌우 넘기기만, 스와이프 다운 없음, 루프 없음).
- 직접 URL 진입 등으로 수집 카드가 0장이면 `/onboarding/style`로 돌려보낸다.
- "다음" pill 버튼 → `completeOnboarding()` + `/home` 이동 (체형 단계 연결 TODO).

## 6. 상태 (onboardingStore 변경)

- 유지: `selectedStyles`(StyleTag[]), `isOnboardingComplete`, `toggleStyle`, `completeOnboarding`, `reset`.
- 추가: `marketingAgreed: boolean` + `setMarketingAgreed(agreed: boolean)` (persist 대상).
- `bodyImageFile`/`bodyImageUrl`/`avatarImageUrl` 등 기존 체형 관련 필드는 체형 단계 재설계 때 정리하므로 이번에는 건드리지 않는다.

## 7. 검증

- 자동화 테스트 프레임워크 부재로 테스트 제외. `npm run build` / `npm run lint` 통과 확인.
- dev 서버 수동 확인 플로우:
  1. 로그인(온보딩 미완료 상태) → `/onboarding` 블롭 인트로 2초 → 동의 화면
  2. 전체 동의/개별 체크 동기화, `>` 바텀시트, 필수 3개 체크 시 다음 활성
  3. `/onboarding/style` 블롭 인트로(더 큰 크기) → 카드 무한 루프 스와이프, 아래로 스와이프 시 수집·제거, 1장 이상 수집 시 다음 활성
  4. 확인 화면에서 닉네임 + 수집 타일 표시 → 다음 → `/home`, 이후 재로그인 시 온보딩 스킵
- 커밋/푸시는 사용자가 직접 수행하며, 작업 단위마다 복붙용 명령을 제공한다.
