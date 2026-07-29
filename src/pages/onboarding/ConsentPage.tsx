import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import TermsDetailView from '@/features/onboarding/components/TermsDetailView';
import { TERMS_DOCS, type TermsKey } from '@/features/onboarding/termsData';
import useSaveAgreements from '@/features/onboarding/hooks/useSaveAgreements';
import { ApiError, getErrorMessage } from '@/lib/apiError';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2500;

const CONSENT_ITEMS = [
  { key: 'terms', label: '(필수) 이용 약관 동의', required: true },
  { key: 'privacy', label: '(필수) 개인정보 수집 및 이용 동의', required: true },
  { key: 'aiImage', label: '(필수) AI 생성 및 이미지 활용 동의서', required: true },
  {
    key: 'marketing',
    label: '(선택) 마케팅 정보 수집 및 수신 동의',
    required: false,
    description: '다양한 이벤트 및 혜택, 서비스 소식 정보를 보내 드립니다',
  },
] as const;

type ConsentKey = (typeof CONSENT_ITEMS)[number]['key'];

/** 원형 체크 아이콘 */
const CheckCircle = ({ checked }: { checked: boolean }) => (
  <span
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
      checked ? 'border-black bg-black text-white' : 'border-neutral-300 bg-white text-transparent'
    }`}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L19 7" />
    </svg>
  </span>
);

const ConsentPage = () => {
  const navigate = useNavigate();
  const setMarketingAgreed = useOnboardingStore((s) => s.setMarketingAgreed);
  const { mutate: saveAgreements, isPending, error } = useSaveAgreements();
  const [showIntro, setShowIntro] = useState(true);
  const [agreed, setAgreed] = useState<Record<ConsentKey, boolean>>({
    terms: false,
    privacy: false,
    aiImage: false,
    marketing: false,
  });
  const [openedTerms, setOpenedTerms] = useState<TermsKey | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const allAgreed = CONSENT_ITEMS.every((item) => agreed[item.key]);
  const requiredAgreed = CONSENT_ITEMS.filter((i) => i.required).every((i) => agreed[i.key]);

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreed({ terms: next, privacy: next, aiImage: next, marketing: next });
  };

  const toggleOne = (key: ConsentKey) => {
    setAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const goNext = () => navigate('/onboarding/style');

  const handleNext = () => {
    setMarketingAgreed(agreed.marketing);
    // 약관 동의 저장(USER-01) 성공 시 다음으로. 이미 동의 완료한 회원(409)도 통과
    saveAgreements(
      {
        termsOfService: agreed.terms,
        privacyPolicy: agreed.privacy,
        aiUsage: agreed.aiImage,
        marketing: agreed.marketing,
      },
      {
        onSuccess: goNext,
        onError: (err) => {
          if (err instanceof ApiError && err.code === 'USER409_01') goNext();
        },
      },
    );
  };

  return (
    <OnboardingLayout progress={0.15}>
      {showIntro ? (
        <BlobIntro message="이제 시작해요" size="sm" />
      ) : (
        <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
          {/* F 로고 */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-extrabold text-white">
            F
          </div>

          <p className="mt-6 text-center text-base font-semibold leading-relaxed">
            Fitty를 원활하게 이용하기 위해서는
            <br />
            아래 권한이 필요해요
          </p>

          {/* 전체 동의 */}
          <button
            type="button"
            onClick={toggleAll}
            className="mt-8 flex w-full items-center gap-3 rounded-xl bg-neutral-100 px-4 py-4"
          >
            <CheckCircle checked={allAgreed} />
            <span className="text-sm font-semibold">약관 전체 동의</span>
          </button>

          {/* 개별 항목 */}
          <div className="mt-3 flex flex-col gap-4 rounded-xl border border-neutral-100 px-4 py-4">
            {CONSENT_ITEMS.map((item) => (
              <div key={item.key} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => toggleOne(item.key)} aria-label={item.label}>
                    <CheckCircle checked={agreed[item.key]} />
                  </button>
                  <span className="flex-1 text-sm text-neutral-700">{item.label}</span>
                  {item.required && (
                    <button
                      type="button"
                      aria-label={`${item.label} 상세 보기`}
                      onClick={() => setOpenedTerms(item.key as TermsKey)}
                      className="px-1 text-neutral-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  )}
                </div>
                {'description' in item && (
                  <p className="pl-9 text-xs text-neutral-400">{item.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            {error && (
              <p className="mb-2 text-center text-sm text-red-500">{getErrorMessage(error)}</p>
            )}
            <Button
              label={isPending ? '저장 중...' : '다음'}
              shape="pill"
              fullWidth
              disabled={!requiredAgreed || isPending}
              onClick={handleNext}
            />
          </div>

          {/* 약관 상세 풀스크린 오버레이 */}
          {openedTerms && (
            <TermsDetailView doc={TERMS_DOCS[openedTerms]} onClose={() => setOpenedTerms(null)} />
          )}
        </div>
      )}
    </OnboardingLayout>
  );
};

export default ConsentPage;
