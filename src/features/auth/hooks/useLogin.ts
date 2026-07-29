import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import type { SocialProvider, User } from '@/types';
import { getMyProfile, login, socialLogin } from '../api/authApi';

/** 로그인 응답(최소 정보)으로 임시 User를 구성 - 이어지는 프로필/마이홈 조회로 완성한다 */
const buildUser = (userId: number, nickname: string): User => ({
  id: userId,
  nickname,
  profileImageUrl: null,
  starBalance: 0,
  bodyTypeName: null,
  styleTags: [],
  stats: { month: 0, registeredClothesCount: 0, generatedOutfitsCount: 0, savedOutfitsCount: 0 },
});

/** 이메일/소셜 로그인 + 인증 상태 저장 + 온보딩/홈 분기 */
const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const afterLogin = async (userId: number, nickname: string, accessToken: string) => {
    setToken(accessToken);
    setUser(buildUser(userId, nickname)); // 임시 User (즉시 표시용)
    // 프로필(PROFILE-01)로 실제 정보 완성 - 실패해도 로그인은 유지
    try {
      setUser(await getMyProfile());
    } catch {
      // 프로필 조회 실패는 무시하고 임시 User로 진행
    }
    // TODO: 서버가 온보딩 완료 여부를 내려주면 그 값으로 판단 (현재는 로컬 상태 기준)
    const { isOnboardingComplete } = useOnboardingStore.getState();
    navigate(isOnboardingComplete ? '/home' : '/onboarding', { replace: true });
  };

  const emailMutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => afterLogin(result.userId, result.nickname, result.accessToken),
  });

  const socialMutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: (result) => afterLogin(result.userId, result.nickname, result.accessToken),
  });

  return {
    loginWithEmail: (email: string, password: string) => emailMutation.mutate({ email, password }),
    loginWithSocial: (provider: SocialProvider) => socialMutation.mutate(provider),
    isLoading: emailMutation.isPending || socialMutation.isPending,
    // 화면에 표시할 로그인 실패 메시지는 이메일 로그인 기준
    error: emailMutation.error,
  };
};

export default useLogin;
