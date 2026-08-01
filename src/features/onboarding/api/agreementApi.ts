import api from '@/lib/axios';

export interface AgreementsRequest {
  termsOfService: boolean;
  privacyPolicy: boolean;
  aiUsage: boolean;
  marketing: boolean;
}

// 백엔드는 agreements를 { target, isAgreed } 배열로 요구한다 (문서: docs/user-profile-api.md).
// aiUsage는 원 계약에 없던 항목이라 백엔드에 AI_USAGE 선택 항목을 임시로 추가해 대응함(후속 이슈에서 정리 예정).
const AGREEMENT_TARGET_MAP: Record<keyof AgreementsRequest, string> = {
  termsOfService: 'TERMS_OF_SERVICE',
  privacyPolicy: 'PRIVACY_POLICY',
  aiUsage: 'AI_USAGE',
  marketing: 'MARKETING',
};

/** USER-01 약관 동의 저장 (POST /api/v1/users/agreements) */
export const saveAgreements = async (agreements: AgreementsRequest): Promise<void> => {
  const payload = Object.entries(agreements).map(([key, isAgreed]) => ({
    target: AGREEMENT_TARGET_MAP[key as keyof AgreementsRequest],
    isAgreed,
  }));
  await api.post('/api/v1/users/agreements', { agreements: payload });
};
