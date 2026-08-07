import api from '@/lib/axios';

export interface AgreementsRequest {
  termsOfService: boolean;
  privacyPolicy: boolean;
  aiUsage: boolean;
  marketing: boolean;
}

/** USER-01 약관 동의 저장 (POST /api/v1/users/agreements) */
export const saveAgreements = async (agreements: AgreementsRequest): Promise<void> => {
  await api.post('/api/v1/users/agreements', { agreements });
};
