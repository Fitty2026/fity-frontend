import api from '@/lib/axios';

/**
 * USER-01 온보딩 스타일 저장.
 * 스타일 선택 화면의 "다음"에서 호출하고, 성공 시 다음 화면으로 이동한다.
 */
export const saveOnboardingStyle = async (styleTagIds: number[]): Promise<void> => {
  await api.post('/api/v1/users/onboarding/style', { styleTagIds });
};
