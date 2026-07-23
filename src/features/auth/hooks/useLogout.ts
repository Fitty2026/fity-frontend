import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { logout } from '../api/authApi';

/** 로그아웃 - 서버 호출 성공/실패와 무관하게 로컬 세션을 정리하고 로그인으로 이동 */
const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      logoutStore();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
};

export default useLogout;
