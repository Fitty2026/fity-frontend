import type { ReactNode } from 'react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8H1.2v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2a12 12 0 0 0 0 10.8l4.1-3.1Z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8L20 3.2A12 12 0 0 0 1.2 6.6l4.1 3.1A7.2 7.2 0 0 1 12 4.8Z" />
  </svg>
);

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6l-1.2 4.4c-.1.4.3.7.6.5l5.2-3.4c.2 0 .5.1.7.1 5.5 0 10-3.5 10-7.9S17.5 3 12 3Z" />
  </svg>
);

const PROVIDER_CONFIG: Record<string, { label: string; icon: ReactNode; className: string }> = {
  google: {
    label: 'Google로 시작하기',
    icon: <GoogleIcon />,
    className: 'bg-neutral-100 text-black hover:bg-neutral-200',
  },
  kakao: {
    label: 'Kakao로 시작하기',
    icon: <KakaoIcon />,
    className: 'bg-[#FEE500] text-black hover:bg-[#f5dc00]',
  },
};

interface SocialLoginButtonProps {
  provider: keyof typeof PROVIDER_CONFIG;
  onClick: () => void;
  disabled?: boolean;
}

const SocialLoginButton = ({ provider, onClick, disabled = false }: SocialLoginButtonProps) => {
  const { label, icon, className } = PROVIDER_CONFIG[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors',
        className,
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
};

export default SocialLoginButton;
