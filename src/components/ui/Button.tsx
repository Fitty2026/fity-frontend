interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900',
  secondary: 'bg-white text-black border border-black hover:bg-neutral-100',
  ghost: 'bg-transparent text-black hover:bg-neutral-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-12 px-6 text-sm rounded-xl',
  lg: 'h-14 px-8 text-base rounded-xl',
};

const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'font-medium transition-colors duration-150 focus:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
};

export default Button;