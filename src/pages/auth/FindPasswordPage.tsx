import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/features/auth/components/PasswordInput';

/**
 * 비밀번호 찾기 — 이메일 → 인증번호 → 새 비밀번호 → 완료 4단계 (Figma 시안 기준).
 * 아직 비밀번호 찾기 API가 없어 화면 플로우만 구현한다.
 * (발송/재발송은 표시만, 인증번호는 MOCK_CODE 고정 검증 — API 나오면 각 단계 제출 핸들러만 교체)
 */
type Step = 'email' | 'verify' | 'reset' | 'done';

/** API 연동 전 임시 인증번호 */
const MOCK_CODE = '123456';
/** 인증 유효 시간(초) — 시안 02:59부터 시작 */
const CODE_TTL_SEC = 179;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** 영문, 숫자, 특수문자 포함 6자 이상 (시안 문구 기준) */
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

/** 초 → M:SS 표기 (02:59) */
const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

/** 단계 상단 타이틀 + 보조 문구 */
const StepTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="pt-10 text-center">
    <h1 className="text-lg font-semibold">{title}</h1>
    <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
  </div>
);

/** 하단 보조 이동 링크 (로그인으로/이전으로 돌아가기) */
const BackLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mx-auto mt-4 text-sm text-neutral-500 underline-offset-2 hover:underline"
  >
    {label}
  </button>
);

/** 인증번호 발송 종이비행기 아이콘 */
const SendIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-auto text-neutral-800"
    aria-hidden
  >
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
);

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');

  // 1단계 — 이메일
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  // 2단계 — 인증번호 + 카운트다운
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(CODE_TTL_SEC);
  const expired = secondsLeft <= 0;

  // 3단계 — 새 비밀번호
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const passwordValid = PASSWORD_PATTERN.test(password);
  const confirmTouched = passwordConfirm.length > 0;
  const passwordsMatch = confirmTouched && password === passwordConfirm;

  // 인증 단계에서만 1초 간격 카운트다운
  useEffect(() => {
    if (step !== 'verify') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const handleEmailNext = () => {
    if (!EMAIL_PATTERN.test(email)) {
      setEmailError('올바른 이메일 형식이 아니에요');
      return;
    }
    setEmailError(null);
    // TODO: 인증번호 발송 API 연동
    setSecondsLeft(CODE_TTL_SEC);
    setCode('');
    setCodeError(null);
    setStep('verify');
  };

  const handleResend = () => {
    // TODO: 인증번호 재발송 API 연동
    setSecondsLeft(CODE_TTL_SEC);
    setCode('');
    setCodeError(null);
  };

  const handleVerifyNext = () => {
    // TODO: 인증번호 검증 API 연동 (현재는 고정 코드)
    if (code !== MOCK_CODE) {
      setCodeError('인증번호가 올바르지 않아요');
      return;
    }
    setPassword('');
    setPasswordConfirm('');
    setStep('reset');
  };

  const handleResetConfirm = () => {
    // TODO: 비밀번호 변경 API 연동
    setStep('done');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
      <div className="flex flex-1 flex-col px-6 pb-10">
        {step === 'email' && (
          <>
            <StepTitle title="비밀번호 찾기" subtitle="가입 시 등록한 이메일을 입력해 주세요" />
            <div className="mt-10">
              <Input
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                errorMessage={emailError ?? undefined}
              />
            </div>
            <div className="mt-auto flex flex-col pt-10">
              <Button
                label="다음"
                shape="pill"
                fullWidth
                size="md"
                disabled={!email}
                onClick={handleEmailNext}
              />
              <BackLink label="로그인으로 돌아가기" onClick={() => navigate('/login')} />
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="pt-16">
              <SendIcon />
              <h1 className="mt-4 text-center text-lg font-semibold">인증번호를 발송했어요</h1>
              <p className="mt-1 text-center text-sm text-neutral-400">
                입력하신 이메일로 인증번호를 발송했어요
                <br />
                메일함을 확인해 주세요
              </p>
            </div>

            <div className="mt-10">
              <Input
                label="인증번호"
                // number 타입은 브라우저 증감 스피너가 생겨서 tel + 숫자 필터로 처리
                type="tel"
                placeholder="인증번호를 입력해주세요"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (codeError) setCodeError(null);
                }}
                errorMessage={
                  expired ? '인증시간이 만료되었어요' : (codeError ?? undefined)
                }
                rightElement={
                  <span className={`text-sm ${expired ? 'text-red-500' : 'text-neutral-400'}`}>
                    {formatTime(secondsLeft)}
                  </span>
                }
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-neutral-500 underline underline-offset-2"
                >
                  인증번호 재발송
                </button>
              </div>
            </div>

            {/* 미수신 안내 */}
            <div className="mt-6 rounded-xl bg-neutral-100 px-4 py-4 text-sm">
              <p className="font-medium text-neutral-700">ⓘ 인증번호가 오지 않나요?</p>
              <p className="mt-1 leading-relaxed text-neutral-500">
                스팸 메일함을 확인해 주세요
                <br />
                이메일 주소가 정확한지 확인해 주세요
              </p>
            </div>

            <div className="mt-auto flex flex-col pt-10">
              <Button
                label="다음"
                shape="pill"
                fullWidth
                size="md"
                disabled={!code || expired}
                onClick={handleVerifyNext}
              />
              <BackLink label="이전으로 돌아가기" onClick={() => setStep('email')} />
            </div>
          </>
        )}

        {step === 'reset' && (
          <>
            <StepTitle title="새 비밀번호 설정하기" subtitle="새로운 비밀번호를 입력해 주세요" />
            <div className="mt-10 flex flex-col gap-4">
              <div>
                <PasswordInput
                  label="새 비밀번호"
                  placeholder="새 비밀번호를 입력해주세요"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p
                  className={`mt-1 text-xs ${
                    password && !passwordValid ? 'text-red-500' : 'text-neutral-400'
                  }`}
                >
                  영문, 숫자, 특수문자 포함 6자 이상
                </p>
              </div>
              <div>
                <PasswordInput
                  label="새 비밀번호 확인"
                  placeholder="새 비밀번호를 확인해주세요"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  errorMessage={
                    confirmTouched && !passwordsMatch ? '비밀번호가 일치하지 않아요' : undefined
                  }
                />
                {passwordsMatch && (
                  <p className="mt-1 text-xs text-green-600">✓ 비밀번호가 일치해요</p>
                )}
              </div>
            </div>
            <div className="mt-auto flex flex-col pt-10">
              <Button
                label="확인"
                shape="pill"
                fullWidth
                size="md"
                disabled={!passwordValid || !passwordsMatch}
                onClick={handleResetConfirm}
              />
              <BackLink label="이전으로 돌아가기" onClick={() => setStep('verify')} />
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <div className="flex flex-1 flex-col items-center justify-center">
              {/* 완료 체크 아이콘 */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <h1 className="mt-4 text-lg font-semibold">비밀번호가 변경되었어요</h1>
              <p className="mt-1 text-sm text-neutral-400">새로운 비밀번호로 로그인해 주세요</p>
            </div>
            <Button
              label="로그인하기"
              shape="pill"
              fullWidth
              size="md"
              onClick={() => navigate('/login', { replace: true })}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default FindPasswordPage;
