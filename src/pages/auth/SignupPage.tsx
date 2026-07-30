import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/features/auth/components/PasswordInput';
import useSignup from '@/features/auth/hooks/useSignup';
import { getErrorMessage } from '@/lib/apiError';

const signupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  loginId: z.string().regex(/^[a-z0-9]{4,20}$/, '아이디는 영문 소문자와 숫자 4~20자여야 해요'),
  email: z.email('올바른 이메일 형식이 아니에요'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 해요',
    ),
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = (data: SignupForm) => {
    // 가입 성공 시 로그인 화면으로 이동
    signup(data, { onSuccess: () => navigate('/login') });
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
            errorMessage={errors.loginId?.message}
            {...register('loginId')}
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

          {/* 서버 에러 (이메일/아이디 중복 등) */}
          {error && <p className="text-center text-sm text-red-500">{getErrorMessage(error)}</p>}

          <Button
            type="submit"
            label={isPending ? '가입 중...' : '회원가입'}
            shape="pill"
            disabled={isPending}
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
