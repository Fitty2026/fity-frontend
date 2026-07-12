import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import type { SocialProvider } from '@/types';
import { login } from '../api/authApi';

/** 로그인 실행 + 인증 상태 저장 + /home 이동을 담당하는 훅 */
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
      navigate('/home', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};

export default useLogin;
