import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Button from '@/components/ui/Button';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { STYLE_TILES } from '@/features/onboarding/constants';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';

const StyleConfirmPage = () => {
  const navigate = useNavigate();
  const nickname = useAuthStore((s) => s.user?.name) ?? '회원';
  const selectedStyles = useOnboardingStore((s) => s.selectedStyles);

  const collected = STYLE_TILES.filter((tile) => selectedStyles.includes(tile.tag));

  // 수집한 카드 없이 직접 진입하면 선택 화면으로 돌려보낸다
  useEffect(() => {
    if (collected.length === 0) navigate('/onboarding/style', { replace: true });
  }, [collected.length, navigate]);

  const handleNext = () => navigate('/onboarding/body');

  return (
    <OnboardingLayout progress={0.55}>
      <div className="flex flex-1 flex-col pb-8 pt-10">
        <div className="px-6 text-center">
          <h2 className="text-lg font-semibold">{nickname}님의 취향을 모아왔어요!</h2>
          <p className="mt-1 text-xs text-neutral-400">이런 스타일을 추구하시는 군요</p>
        </div>

        {/* 수집한 타일 캐러셀 */}
        <div className="mt-6 flex flex-1 items-center overflow-hidden">
          <Swiper
            className="h-full w-full"
            slidesPerView="auto"
            centeredSlides
            spaceBetween={16}
          >
            {collected.map((tile) => (
              <SwiperSlide key={tile.id} className="!w-[62%]">
                <div className="mx-auto h-full max-h-[420px] overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={tile.imageSrc}
                    alt={`${tile.tag} 스타일`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-6 px-6">
          <Button label="확인" shape="pill" fullWidth onClick={handleNext} />
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default StyleConfirmPage;
