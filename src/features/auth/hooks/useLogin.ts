import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import type { SocialProvider, User } from '@/types';
import { getMyProfile, login, socialLogin, type LoginUser } from '../api/authApi';

/** 로그인 응답의 user로 임시 User를 구성 - 이어지는 프로필 조회로 완성한다 */
const buildUser = (user: LoginUser): User => ({
  ...user,
  styleTags: null,
  styleTagIds: [],
});

/** 이메일/소셜 로그인 + 인증 상태 저장 + 온보딩/홈 분기 */
const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const afterLogin = async (user: LoginUser, accessToken: string) => {
    setToken(accessToken);
    setUser(buildUser(user)); // 임시 User (즉시 표시용)
    // 프로필(USER-04)로 실제 정보 완성 - 실패해도 로그인은 유지
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
    onSuccess: (result) => afterLogin(result.user, result.accessToken),
  });

  const socialMutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: (result) => afterLogin(result.user, result.accessToken),
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
