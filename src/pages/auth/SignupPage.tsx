import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { signup } from '@/features/auth/api/authApi';
import PasswordInput from '@/features/auth/components/PasswordInput';

const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  username: z
    .string()
    .min(4, '아이디는 4자 이상이어야 해요')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문과 숫자만 사용할 수 있어요'),
  email: z.email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 해요'),
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signup(data);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col px-6 pb-10">
        <h1 className="py-10 text-center text-lg font-semibold">회원가입</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="이름"
            placeholder="이름을 입력해주세요"
            autoComplete="name"
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요"
            autoComplete="username"
            errorMessage={errors.username?.message}
            {...register('username')}
          />
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
            autoComplete="new-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            label={isLoading ? '가입 중...' : '회원가입'}
            shape="pill"
            disabled={isLoading}
            fullWidth
            size="md"
            className="mt-2"
          />
        </form>

        {/* 로그인 이동 */}
        <p className="mt-8 text-center text-sm text-neutral-400">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-black"
          >
            로그인하기
          </button>
        </p>
      </div>
    </PageLayout>
  );
};

export default SignupPage;
