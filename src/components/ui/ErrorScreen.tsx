import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface ErrorScreenProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** 에러 안내 화면 - onRetry가 있으면 "다시 시도" 버튼, "홈으로"는 항상 표시 */
const ErrorScreen = ({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해주세요',
  onRetry,
}: ErrorScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center px-6">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="mb-4 text-neutral-300"
      >
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" />
        <path d="M24 14v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="33" r="2" fill="currentColor" />
      </svg>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-center text-sm text-neutral-500">
        {description}
      </p>
      <div className="mt-8 flex w-full max-w-[280px] flex-col gap-2">
        {onRetry && <Button label="다시 시도" fullWidth size="md" onClick={onRetry} />}
        <Button label="홈으로" variant="ghost" fullWidth size="md" onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default ErrorScreen;
