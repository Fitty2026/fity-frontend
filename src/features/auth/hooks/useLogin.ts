import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import { getBodyProfile } from '@/features/onboarding/api/bodyProfileApi';
import { ApiError } from '@/lib/apiError';
import type { SocialProvider, User } from '@/types';
import { getMyProfile, login, socialLogin, type LoginResult } from '../api/authApi';

/** 로그인 응답(userId)으로 임시 User를 구성 - 이어지는 프로필 조회로 완성한다 */
const buildUser = ({ userId, nickname }: LoginResult): User => ({
  id: userId,
  username: '',
  email: '',
  name: nickname ?? '',
  styleTags: null,
  styleTagIds: [],
});

/** 이메일/소셜 로그인 + 인증 상태 저장 + 온보딩/홈 분기 */
const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const afterLogin = async (result: LoginResult) => {
    setToken(result.accessToken);
    setUser(buildUser(result)); // 임시 User (즉시 표시용)

    // mock 소셜 로그인 토큰으로 실서버를 조회하면 401 → 로그인 화면으로 튕기므로
    // 서버 상태 확인 없이 로컬 온보딩 상태로만 분기한다 (소셜 로그인 실연동 시 제거)
    if (result.accessToken.startsWith('mock-token-')) {
      const { isOnboardingComplete } = useOnboardingStore.getState();
      navigate(isOnboardingComplete ? '/home' : '/onboarding', { replace: true });
      return;
    }

    // 온보딩 진행 상태를 서버 기준으로 판단한다
    // - 취향(스타일): USER-04 프로필의 styleTagIds 존재 여부
    // - 체형: PROFILE-04 체형 프로필 존재 여부 (없으면 PROFILE404 계열 코드)
    const [profileResult, bodyResult] = await Promise.allSettled([getMyProfile(), getBodyProfile()]);

    let styleDone: boolean | null = null;
    if (profileResult.status === 'fulfilled') {
      setUser(profileResult.value); // 실제 정보로 완성
      styleDone = profileResult.value.styleTagIds.length > 0;
    }

    let bodyDone: boolean | null = null;
    if (bodyResult.status === 'fulfilled') {
      bodyDone = true;
    } else if (bodyResult.reason instanceof ApiError && bodyResult.reason.code.startsWith('PROFILE404')) {
      // 코드 표기가 백엔드에 따라 PROFILE4041 / PROFILE404_01로 갈려 접두사로 매칭한다
      bodyDone = false;
    }

    // 서버 확인이 불가능하면(네트워크 등) 기존 로컬 값으로 폴백
    const { isOnboardingComplete, completeOnboarding } = useOnboardingStore.getState();
    const complete =
      styleDone === null || bodyDone === null ? isOnboardingComplete : styleDone && bodyDone;

    if (complete) {
      completeOnboarding(); // 다른 기기에서 온보딩을 마친 경우 로컬 상태 동기화
      navigate('/home', { replace: true });
    } else if (styleDone) {
      // 취향까지 마쳤으면 체형 단계부터 이어서 진행
      navigate('/onboarding/body', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  };

  const emailMutation = useMutation({
    mutationFn: login,
    onSuccess: afterLogin,
  });

  const socialMutation = useMutation({
    mutationFn: socialLogin,
    onSuccess: afterLogin,
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
