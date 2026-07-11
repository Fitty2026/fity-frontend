interface LoadingScreenProps {
  message?: string;
}

/** 데이터 로딩 대기 화면 - 부모 영역을 채우고 중앙에 스피너를 표시 */
const LoadingScreen = ({ message = '불러오는 중...' }: LoadingScreenProps) => (
  <div className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center gap-4">
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black"
      role="status"
      aria-label="로딩 중"
    />
    <p className="text-sm text-neutral-500">{message}</p>
  </div>
);

export default LoadingScreen;
