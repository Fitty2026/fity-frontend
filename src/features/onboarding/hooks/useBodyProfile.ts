import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import { getBodyProfile } from '../api/bodyProfileApi';

/** PROFILE-04 체형 프로필 조회 (로그인 상태일 때만). 미등록 시 404 → 재진입/마이페이지 판단용 */
const useBodyProfile = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: ['body-profiles', 'me'],
    queryFn: getBodyProfile,
    enabled: isLoggedIn,
    retry: false,
  });
};

export default useBodyProfile;
