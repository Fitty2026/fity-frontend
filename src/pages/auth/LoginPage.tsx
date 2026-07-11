import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => handleLogin('email', data.email, data.password);

  return (
    <PageLayout
      title="로그인"
      showBack
      onBack={() => navigate('/intro')}
      showBottomNav={false}
    >
      <div className="flex flex-col gap-6 px-6 py-8">
        {/* 로고 */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-lg font-bold">
          F
        </div>

        <p className="text-sm text-neutral-600">빠르게 시작하고 내 옷으로 코디를 완성해보세요</p>

        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />
          <Button
            type="submit"
            label={isLoading ? '로그인 중...' : '이메일로 로그인'}
            disabled={isLoading}
            fullWidth
            size="md"
          />
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3">
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

        {/* 회원가입 - 페이지 미구현으로 표시만 */}
        <p className="mt-2 text-center text-sm text-neutral-500">
          계정이 없으신가요?{' '}
          <span className="font-semibold text-black underline">회원가입</span>
        </p>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
