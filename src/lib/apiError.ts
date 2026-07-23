/**
 * 서버가 내려주는 실패 응답({ isSuccess:false, code, message })을 표현하는 에러.
 * axios 인터셉터에서 던지고, 각 화면/훅에서 code·message로 처리한다.
 */
export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/** unknown 에러에서 사용자에게 보여줄 메시지를 안전하게 추출 */
export const getErrorMessage = (error: unknown, fallback = '잠시 후 다시 시도해 주세요.'): string => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
