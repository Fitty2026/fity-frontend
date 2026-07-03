import { forwardRef } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      value,
      onChange,
      errorMessage,
      disabled = false,
      className = '',
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-neutral-700">{label}</label>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full h-12 px-4 text-sm bg-white border rounded-xl outline-none transition-colors',
            'placeholder:text-neutral-400',
            errorMessage
              ? 'border-red-400 focus:border-red-500'
              : 'border-neutral-300 focus:border-black',
            disabled ? 'opacity-40 cursor-not-allowed bg-neutral-100' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;