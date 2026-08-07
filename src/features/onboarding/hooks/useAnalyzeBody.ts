import { useMutation } from '@tanstack/react-query';
import { analyzeBody } from '../api/bodyProfileApi';

interface AnalyzeBodyParams {
  front: Blob;
  side: Blob;
  back: Blob;
}

/** PROFILE-02 체형 사진 AI 분석 mutation (정면/측면/후면 3장) */
const useAnalyzeBody = () =>
  useMutation({
    mutationFn: ({ front, side, back }: AnalyzeBodyParams) => analyzeBody(front, side, back),
  });

export default useAnalyzeBody;
