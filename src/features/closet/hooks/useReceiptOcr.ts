import { useMutation } from '@tanstack/react-query';
import { recognizeReceipts, type RecognizeReceiptsRequest } from '../api/ocrApi';

/**
 * 영수증 OCR 인식 — 이미지 여러 장을 한 번에 보내 상품을 읽어온다.
 * 성공/실패 후 화면 이동은 호출부가 정한다.
 */
const useReceiptOcr = () => {
  const mutation = useMutation({
    mutationFn: (params: RecognizeReceiptsRequest) => recognizeReceipts(params),
  });

  return {
    recognize: mutation.mutate,
    recognizeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};

export default useReceiptOcr;
