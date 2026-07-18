# 온보딩 2차 설계 (체형 입력)

- 날짜: 2026-07-18
- 브랜치: `feature/onboarding`
- 범위: 체형 타입 선택 → 사진 촬영/업로드 → AI 분석(mock) → 결과 확인까지의 체형 온보딩 전체. 취향 확인 "다음"을 체형 플로우로 연결하고, 미사용 기존 온보딩 코드 정리.
- 범위 제외: 실제 체형 분석 API(3초 mock), 사진 백엔드 업로드

## 1. 플로우 & 라우팅

```
/onboarding/style/confirm "다음" → /onboarding/body (기존: 완료 후 홈 → 변경)

/onboarding/body           BodyTypePage     블롭 인트로3 "이번엔 체형을 알아볼게요"(lg) → 체형 타입 3택 + 설명 오버레이 → 확인
/onboarding/body/photo     BodyPhotoGuidePage  안내 1("카메라를 고정하고 전신을 촬영해주세요") → 안내 2("밝은 배경에서 촬영해주세요", 사진 업로드/촬영하기 분기)
/onboarding/body/camera    BodyCameraPage   "천천히 한 바퀴 돌아주세요" → 실제 카메라(getUserMedia) + 보라 점 원형 프로그레스 + 셔터 → "사진이 업로드되었어요"
/onboarding/body/upload    BodyUploadPage   "정면, 측면, 후면 사진을 업로드 해주세요"(최대 3장) → "사진이 업로드되었어요" → "업로드한 사진이 다음과 같나요?" 확인 캐러셀
/onboarding/body/analysis  BodyAnalysisPage "AI가 체형을 분석하고 있어요"(옷걸이 차오름) → "체형이 분석되었어요" → 자동 이동
/onboarding/body/result    BodyResultPage   수치 결과(치수 7개) → 최종 결과(유형 카드 + 체형 특징 바) → 완료
```

- **건너뛰기**(체형 화면 우상단, OnboardingLayout의 옵션): `completeOnboarding()` 후 `/home`.
- **다시 분석하기**(수치/최종 결과): `/onboarding/body/photo`로 복귀.
- **분석 결과 저장하고 시작하기**: `completeOnboarding()` 후 `/home`.
- 진행 바: 체형 선택 0.7 → 사진(가이드/카메라/업로드) 0.8 → 분석 0.9 → 결과 1.0.
- 분석 결과 없이 `/onboarding/body/result` 직접 진입 시 `/onboarding/body`로 돌려보낸다.

## 2. 체형 타입 선택 (BodyTypePage)

- 에셋: `src/assets/images/body/straight.png · wave.png · natural.png` (일러스트), 라벨 "스트레이트 타입 / 웨이브 타입 / 내추럴 타입".
- 3열 배치. 타입 클릭 시 해당 일러스트 위로 반투명 설명 카드 오버레이(피그마 문구 그대로), 바깥 클릭으로 닫힘.
- 선택 후 "확인" 활성(회색→검정 pill) → `bodyType` 저장 → `/onboarding/body/photo`.

## 3. 사진 단계

- 안내 화면들의 본문 이미지는 `body/mannequin.png` 사용, 하단에 안심 문구 "사진은 분석 후 즉시 삭제되며, 안전하게 보호돼요".
- **카메라**: `getUserMedia`(전면) 프리뷰 + 보라 점 원형 프로그레스 오버레이 + 셔터(canvas 캡처). 좌상단 X → 가이드로 복귀, 좌하단 갤러리 아이콘 → 파일 선택. 권한 거부/실패 시 파일 선택 fallback 안내. 언마운트 시 스트림 정리.
- **업로드**: 파일 선택(image, 최대 3장) → 완료 체크 화면 → 실제 업로드 사진 캐러셀로 확인.
- 결과물은 objectURL 배열로 `bodyPhotoUrls`에 저장 (persist 제외, 백엔드 전송은 추후).

## 4. 분석 mock & 결과

- `src/features/onboarding/api/bodyAnalysisApi.ts` — `analyzeBody(): Promise<BodyAnalysisResult>`, 3초 지연 후 고정 결과. 추후 이 파일 내부만 실제 API로 교체.
- 결과(피그마 그대로): 치수 어깨너비 38 / 가슴둘레 85 / 허리둘레 67 / 엉덩이둘레 92 / 상체길이 61 / 하체길이 61 / 다리길이 61 (cm). 유형 "슬림 스트레이트" — "전체적으로 균형이 좋고 슬림한 체형이에요", 연예인 강민경·크리스탈·차정원. 특징: 상체 비율 47% / 하체 비율 53% / 체형 밸런스 균형형 / 골격 중간 / 근육량 보통.
- 결과는 `onboardingStore.analysisResult`(persist 제외)에 저장.
- 옷걸이는 SVG로 그리고, 로딩 중 보라색 stroke가 차오르는 애니메이션, 완료 시 보라 옷걸이 + 체크.
- 최종 결과 카드의 좌측 일러스트는 선택한 체형 타입 이미지 재사용. 피그마의 우상단 "88개" 뱃지는 온보딩 범위 밖이라 생략.

## 5. 상태 (onboardingStore 개편)

- 추가: `bodyType: 'straight' | 'wave' | 'natural' | null`(persist), `bodyPhotoUrls: string[]`, `analysisResult: BodyAnalysisResult | null` + 각 setter.
- 제거: `bodyImageFile`, `bodyImageUrl`, `avatarImageUrl`, `setBodyImage`, `setAvatarImage` (사용처는 삭제 대상 페이지뿐).
- `types/index.ts`의 구식 `OnboardingState` 인터페이스도 실제 store와 맞게 정리.

## 6. 정리 작업

- 삭제: `StylePreferencePage.tsx`, `PhotoUploadPage.tsx`, `BodyAnalysisPage.tsx`(구버전), `AvatarGeneratePage.tsx`, `features/onboarding/components/StyleCard.tsx`.
- `StyleConfirmPage`의 "다음"을 `/onboarding/body`로 변경 (완료 처리 제거).
- `OnboardingLayout`에 `onSkip` 옵션 추가 (우상단 "건너뛰기 >").

## 7. 검증

- `npm run build` / `npm run lint` 통과 (기존 7건 외 신규 에러 0건).
- dev 서버 수동 확인: 타입 선택·설명 오버레이, 촬영/업로드 양 경로, 카메라 권한 거부 fallback, 분석 로딩→완료→수치→최종 결과, 다시 분석하기, 건너뛰기, 완료 후 홈 이동과 재로그인 시 온보딩 스킵.
- 커밋/푸시는 사용자가 직접, 작업 단위별 복붙 명령 제공.
