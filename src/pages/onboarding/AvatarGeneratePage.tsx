import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import useOnboardingStore from '@/store/onboardingStore';

const AvatarGeneratePage = () => {
  const navigate = useNavigate();
  const avatarImageUrl = useOnboardingStore((s) => s.avatarImageUrl);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const finishOnboarding = () => {
    completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col items-center px-6 py-10">
        {/* 아바타 placeholder - 실제 생성 API 연동 시 이미지 표시 */}
        <div className="aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-2xl bg-neutral-200">
          {avatarImageUrl && (
            <img src={avatarImageUrl} alt="내 아바타" className="h-full w-full object-cover" />
          )}
        </div>
        <span className="mt-6 rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-600">
          내 체형 기반 아바타
        </span>
        <p className="mt-4 whitespace-pre-line text-center text-sm text-neutral-500">
          {'체형 비율과 스타일 데이터를 기반으로\n생성됐어요'}
        </p>
        <div className="mt-10 flex w-full flex-col gap-3">
          <Button label="다음" fullWidth onClick={finishOnboarding} />
          <Button
            label="추가 사진으로 정확도 올리기"
            variant="secondary"
            fullWidth
            onClick={() => navigate('/onboarding/photo')}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AvatarGeneratePage;
