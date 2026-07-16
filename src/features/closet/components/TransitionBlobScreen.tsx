interface TransitionBlobScreenProps {
  /** 중앙 안내 문구 */
  message: string;
  /** 문구를 blob 위에 둘지(top) 아래(bottom). 기본 top */
  messagePosition?: 'top' | 'bottom';
}

/**
 * 그라디언트 blob 전환 화면.
 * 사용처: "거의 다 왔어요", "Fitty를 이용할 준비가 다 됐어요".
 */
const TransitionBlobScreen = ({ message, messagePosition = 'top' }: TransitionBlobScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 h-full px-6">
      {messagePosition === 'top' && (
        <p className="text-lg font-medium text-neutral-800 text-center">{message}</p>
      )}
      <div className="relative w-56 h-56">
        <div
          className="absolute inset-0 blur-2xl opacity-90"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #C9B8FF 0%, #E7D9FF 35%, #BFD8FF 70%, #F3E9FF 100%)',
            borderRadius: '46% 54% 60% 40% / 52% 44% 56% 48%',
          }}
        />
        <div
          className="absolute inset-4"
          style={{
            background:
              'radial-gradient(circle at 40% 35%, #D8C9FF 0%, #C6E0FF 60%, #EBDBFF 100%)',
            borderRadius: '46% 54% 60% 40% / 52% 44% 56% 48%',
          }}
        />
      </div>
      {messagePosition === 'bottom' && (
        <p className="text-lg font-medium text-neutral-800 text-center">{message}</p>
      )}
    </div>
  );
};

export default TransitionBlobScreen;
