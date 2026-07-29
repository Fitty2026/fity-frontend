import { useMutation } from '@tanstack/react-query';
import { saveBodyProfile } from '../api/bodyProfileApi';

/** PROFILE-03 체형 분석 결과 저장 mutation */
const useSaveBodyProfile = () => useMutation({ mutationFn: saveBodyProfile });

export default useSaveBodyProfile;
