import { analyzeBody } from './api/bodyProfileApi';
import useOnboardingStore from '@/store/onboardingStore';

/**
 * 체형 분석 시작 — 컴포넌트 밖의 일반 함수라 화면을 이동해도 진행되고,
 * 결과/실패는 onboardingStore.analysisStatus로 어느 화면에서든 구독한다.
 * (완료 화면에서 실패가 확인되면 옷걸이 화면 없이 바로 에러 화면으로 전환하기 위한 구조)
 */
export const startBodyAnalysis = async (photoUrls: string[]) => {
  const { setAnalysisStatus, setAnalysisResult } = useOnboardingStore.getState();
  setAnalysisStatus('pending');
  try {
    const [front, side, back] = await Promise.all(
      photoUrls.map((url) => fetch(url).then((res) => res.blob())),
    );
    const result = await analyzeBody(front, side, back);
    setAnalysisResult(result); // status도 'success'로 바뀐다
  } catch {
    useOnboardingStore.getState().setAnalysisStatus('error');
  }
};
