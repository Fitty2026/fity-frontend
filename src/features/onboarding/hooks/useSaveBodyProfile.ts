import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveBodyProfile } from '../api/bodyProfileApi';

/** PROFILE-03 체형 분석 결과 저장 mutation */
const useSaveBodyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveBodyProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['body-profiles', 'me'] });
    },
  });
};

export default useSaveBodyProfile;
