import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '@/store/authStore';
import { withdraw } from '../api/authApi';

const useWithdraw = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
};

export default useWithdraw;
