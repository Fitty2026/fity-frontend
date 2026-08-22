import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import useClosetStore from '@/store/closetStore';
import useStylingStore from '@/store/stylingStore';
import useOutfitLikeStore from '@/features/styling/hooks/useOutfitLikes';
import { INTRO_SEEN_KEY } from '../constants';
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

      // 토큰·응답 캐시만 지우면 persist된 값이 남아 다음 로그인에 이전 계정 흔적이 비친다.
      // 진행 중이던 플로우 값과 기기에만 저장하는 찜까지 함께 비운다
      useOnboardingStore.getState().reset();
      useClosetStore.getState().reset();
      useStylingStore.getState().reset();
      useOutfitLikeStore.setState({ likedIds: [] });

      // persist 키가 바뀌거나 새 스토어가 늘어도 따라오도록 훑어서 지운다.
      // 서비스 소개를 봤는지(fitty-intro-seen)는 계정이 아니라 기기 기준이라 남긴다
      Object.keys(localStorage)
        .filter((key) => key.startsWith('fitty-') && key !== INTRO_SEEN_KEY)
        .forEach((key) => localStorage.removeItem(key));
      sessionStorage.clear();

      navigate('/login', { replace: true });
    },
  });
};

export default useLogout;
