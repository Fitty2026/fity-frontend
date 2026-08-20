import { useMutation } from '@tanstack/react-query';
import { login } from '../api/authApi';
import useAfterLogin from './useAfterLogin';

/** 이메일 로그인 + 인증 상태 저장 + 온보딩/홈 분기 (소셜 로그인은 OAuthCallbackPage에서 처리) */
const useLogin = () => {
  const afterLogin = useAfterLogin();

  const emailMutation = useMutation({
    mutationFn: login,
    onSuccess: afterLogin,
  });

  return {
    loginWithEmail: (email: string, password: string) => emailMutation.mutate({ email, password }),
    isLoading: emailMutation.isPending,
    error: emailMutation.error,
  };
};

export default useLogin;
