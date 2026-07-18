import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/features/auth/components/PasswordInput';
import SocialLoginButton from '@/features/auth/components/SocialLoginButton';
import useLogin from '@/features/auth/hooks/useLogin';

const loginSchema = z.object({
  email: z.email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요'),
});

type LoginForm = z.infer<typeof loginSchema>;

const SOCIAL_PROVIDERS = ['google', 'apple', 'kakao'] as const;

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useLogin();
  // TODO: API 연동 시 "로그인 상태 유지" 여부를 토큰 저장 방식에 반영
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => handleLogin('email', data.email, data.password);

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col px-6 pb-10">
        <h1 className="py-10 text-center text-lg font-semibold">로그인</h1>

        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <PasswordInput
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          {/* 로그인 상태 유지 / 비밀번호 찾기 */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 accent-black"
              />
              로그인 상태 유지
            </label>
            {/* 비밀번호 찾기 - 페이지 미구현, 추후 제거 가능성 있어 표시만 */}
            <span className="text-neutral-600">비밀번호 찾기</span>
          </div>

          <Button
            type="submit"
            label={isLoading ? '로그인 중...' : '로그인'}
            shape="pill"
            disabled={isLoading}
            fullWidth
            size="md"
            className="mt-2"
          />
        </form>

        {/* 구분선 */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">또는</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        {/* 소셜 로그인 */}
        <div className="flex flex-col gap-3">
          {SOCIAL_PROVIDERS.map((provider) => (
            <SocialLoginButton
              key={provider}
              provider={provider}
              onClick={() => handleLogin(provider)}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* 회원가입 이동 */}
        <p className="mt-8 text-center text-sm text-neutral-400">
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-semibold text-black"
          >
            회원가입하기
          </button>
        </p>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
