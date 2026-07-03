import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  onBack?: () => void;
}

const Header = ({ title, showBack = false, rightElement, onBack }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100">
      {/* 왼쪽 - 뒤로가기 */}
      <div className="w-10">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* 가운데 - 타이틀 */}
      {title && (
        <h1 className="text-base font-semibold text-black tracking-tight">{title}</h1>
      )}

      {/* 오른쪽 - 커스텀 요소 */}
      <div className="w-10 flex justify-end">{rightElement}</div>
    </header>
  );
};

export default Header;