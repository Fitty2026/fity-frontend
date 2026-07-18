import { forwardRef, useState } from 'react';
import Input, { type InputProps } from '@/components/ui/Input';

/** 눈 아이콘으로 표시/숨김을 토글하는 비밀번호 입력 필드 */
const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'rightElement'>>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightElement={
          <button
            type="button"
            aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
            onClick={() => setVisible((v) => !v)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            {visible ? (
              // 눈 아이콘 (표시 중)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // 빗금 눈 아이콘 (숨김 중)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="4" y1="20" x2="20" y2="4" />
              </svg>
            )}
          </button>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
