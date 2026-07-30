import { useMutation } from '@tanstack/react-query';
import { saveBodyType } from '../api/bodyProfileApi';

/** PROFILE-01 온보딩 체형 타입 저장 mutation */
const useSaveBodyType = () => useMutation({ mutationFn: saveBodyType });

export default useSaveBodyType;
