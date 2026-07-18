import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2000;

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

/** 약관 본문은 아직 없어 더미 텍스트를 보여준다 */
const DUMMY_TERMS_BODY =
  '약관 본문이 준비 중이에요.\n서비스 오픈 전에 실제 약관 내용으로 교체될 예정입니다.';

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
  const [showIntro, setShowIntro] = useState(true);
  const [agreed, setAgreed] = useState<Record<ConsentKey, boolean>>({
    terms: false,
    privacy: false,
    aiImage: false,
    marketing: false,
  });
  const [openedTerms, setOpenedTerms] = useState<(typeof CONSENT_ITEMS)[number] | null>(null);

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

  const handleNext = () => {
    setMarketingAgreed(agreed.marketing);
    navigate('/onboarding/style');
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
                  <button
                    type="button"
                    aria-label={`${item.label} 상세 보기`}
                    onClick={() => setOpenedTerms(item)}
                    className="px-1 text-neutral-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                {'description' in item && (
                  <p className="pl-9 text-xs text-neutral-400">{item.description}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button
              label="다음"
              shape="pill"
              fullWidth
              disabled={!requiredAgreed}
              onClick={handleNext}
            />
          </div>

          {/* 약관 상세 더미 바텀시트 */}
          <BottomSheet
            isOpen={openedTerms !== null}
            onClose={() => setOpenedTerms(null)}
            title={openedTerms?.label}
          >
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
              {DUMMY_TERMS_BODY}
            </p>
          </BottomSheet>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default ConsentPage;
