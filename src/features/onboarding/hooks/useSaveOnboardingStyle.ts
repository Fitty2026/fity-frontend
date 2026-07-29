import { useMutation } from '@tanstack/react-query';
import { saveOnboardingStyle } from '../api/onboardingApi';

/** USER-01 온보딩 스타일 저장 mutation */
const useSaveOnboardingStyle = () =>
  useMutation({
    mutationFn: saveOnboardingStyle,
  });

export default useSaveOnboardingStyle;
