import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import { getMyProfile } from '../api/authApi';

/** 내 프로필 조회 (PROFILE-01). 로그인 상태일 때만 실행한다. */
const useMyProfile = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getMyProfile,
    enabled: isLoggedIn,
  });
};

export default useMyProfile;
