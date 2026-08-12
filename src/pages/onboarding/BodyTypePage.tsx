import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import type { ServerBodyType } from '@/features/onboarding/api/bodyProfileApi';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { BODY_TYPES, type BodyTypeOption } from '@/features/onboarding/bodyConstants';
import useSaveBodyType from '@/features/onboarding/hooks/useSaveBodyType';
import { getErrorMessage } from '@/lib/apiError';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2500;
/** 이보다 오래 누르고 있으면 선택 대신 타입 설명을 보여준다 */
const LONG_PRESS_MS = 450;

const BodyTypePage = () => {
  const navigate = useNavigate();
  const setBodyType = useOnboardingStore((s) => s.setBodyType);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const { mutate: saveBodyType, isPending, error } = useSaveBodyType();
  const [showIntro, setShowIntro] = useState(true);
  const [selected, setSelected] = useState<BodyTypeOption | null>(null);
  /** 꾹 누르고 있는 동안 설명을 보여줄 타입 (놓으면 null로 복귀) */
  const [described, setDescribed] = useState<BodyTypeOption | null>(null);
  const pressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => {
      clearTimeout(timer);
      if (pressTimer.current !== null) clearTimeout(pressTimer.current);
    };
  }, []);

  const handleSkip = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  // 꾹 누름: LONG_PRESS_MS 지나면 설명 표시. 짧은 탭: 놓을 때 선택.
  const startPress = (option: BodyTypeOption) => {
    longPressed.current = false;
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      setDescribed(option);
    }, LONG_PRESS_MS);
  };

  /** 손을 떼거나 벗어났을 때. option이 있으면(버튼 위에서 뗌) 짧은 탭을 선택으로 처리 */
  const endPress = (option?: BodyTypeOption) => {
    if (pressTimer.current !== null) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setDescribed(null);
    if (!longPressed.current && option) setSelected(option);
    longPressed.current = false;
  };

  const handleConfirm = () => {
    if (!selected) return;
    setBodyType(selected.type);
    // 서버 저장(PROFILE-01) 성공 시에만 다음 화면으로
    saveBodyType(selected.type.toUpperCase() as ServerBodyType, {
      onSuccess: () => navigate('/onboarding/body/photo'),
    });
  };

  return (
    <OnboardingLayout progress={0.7} onSkip={showIntro ? undefined : handleSkip}>
      {showIntro ? (
        <BlobIntro message="이번엔 체형을 알아볼게요" size="lg" />
      ) : (
        <div className="relative flex flex-1 flex-col px-6 pb-8 pt-10">
          <h2 className="text-center text-lg font-semibold">체형을 선택해주세요</h2>
          <p className="mt-1 text-center text-xs text-neutral-400">
            이미지를 꾹 누르면 자세한 정보를 알 수 있어요
          </p>

          {/* 타입 3택 - 짧은 탭은 선택, 꾹 누르면 누르는 동안만 설명 표시 */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {BODY_TYPES.map((option) => (
              <button
                key={option.type}
                type="button"
                onPointerDown={() => startPress(option)}
                onPointerUp={() => endPress(option)}
                onPointerLeave={() => endPress()}
                onPointerCancel={() => endPress()}
                onContextMenu={(e) => e.preventDefault()}
                className={`flex select-none flex-col items-center gap-2 rounded-xl p-2 transition-colors ${
                  selected?.type === option.type ? 'bg-violet-50' : ''
                }`}
              >
                <img
                  src={option.imageSrc}
                  alt={option.label}
                  draggable={false}
                  className="w-full object-contain"
                />
                <span className="text-xs text-neutral-600">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            {error && (
              <p className="mb-2 text-center text-sm text-red-500">{getErrorMessage(error)}</p>
            )}
            <Button
              label={isPending ? '저장 중...' : '확인'}
              shape="pill"
              fullWidth
              disabled={!selected || isPending}
              onClick={handleConfirm}
            />
          </div>

          {/* 타입 설명 오버레이 - 꾹 누르고 있는 동안만 표시 (이벤트는 버튼이 계속 받도록 통과) */}
          {described && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60 px-6">
              <div className="w-full rounded-2xl bg-neutral-50 px-6 py-8 text-center shadow-lg">
                <h3 className="text-base font-semibold">{described.label}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {described.description}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </OnboardingLayout>
  );
};

export default BodyTypePage;
