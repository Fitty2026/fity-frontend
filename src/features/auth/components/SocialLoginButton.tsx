const PROVIDER_LABELS = {
  google: 'Google로 계속하기',
  apple: 'Apple로 계속하기',
  kakao: 'Kakao로 계속하기',
} as const;

interface SocialLoginButtonProps {
  provider: keyof typeof PROVIDER_LABELS;
  onClick: () => void;
  disabled?: boolean;
}

const SocialLoginButton = ({ provider, onClick, disabled = false }: SocialLoginButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={[
      'h-12 w-full rounded-xl border border-neutral-300 bg-white text-sm font-medium text-black transition-colors',
      disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-neutral-50',
    ].join(' ')}
  >
    {PROVIDER_LABELS[provider]}
  </button>
);

export default SocialLoginButton;
