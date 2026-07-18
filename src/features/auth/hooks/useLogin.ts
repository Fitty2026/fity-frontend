import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import type { SocialProvider } from '@/types';
import { login } from '../api/authApi';

/** 로그인 실행 + 인증 상태 저장 + 온보딩/홈 분기를 담당하는 훅 */
const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async (provider: SocialProvider, email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const { user, accessToken } = await login({ provider, email, password });
      setUser(user);
      setToken(accessToken);
      // 온보딩을 마친 사용자는 홈으로, 처음인 사용자는 온보딩으로.
      // TODO: API 연동 시 서버가 주는 온보딩 완료 여부로 판단
      const { isOnboardingComplete } = useOnboardingStore.getState();
      navigate(isOnboardingComplete ? '/home' : '/onboarding', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};

export default useLogin;
