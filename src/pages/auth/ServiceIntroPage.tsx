import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';

const SLIDES = [
  {
    number: '1',
    title: '내 옷으로\n완성하는\n코디',
    description: '이미 가지고 있는 옷만으로도\n가장 잘 어울리는 스타일을 추천해드려요',
  },
  {
    number: '2',
    title: '체형과\n취향에 맞는\n코디 추천',
    description: '스타일 취향과 체형을 분석해\n나에게 가장 잘 어울리는 코디를 찾아드려요',
  },
  {
    number: '3',
    title: '사진으로\n미리 보는\n실사 코디',
    description: '사진을 합성해\n실제처럼 미리 확인할 수 있어요',
  },
];

const ServiceIntroPage = () => {
  const [index, setIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();

  const isLast = index === SLIDES.length - 1;

  const goToLogin = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    navigate('/login');
  };

  const handleNext = () => {
    if (isLast) {
      goToLogin();
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
      {/* 슬라이드 영역 */}
      <Swiper
        className="w-full flex-1"
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.number}>
            <div className="flex h-full flex-col justify-end px-6 pb-7">
              <span className="text-[7rem] font-extrabold leading-none">{slide.number}</span>
              <h2 className="mt-8 whitespace-pre-line text-5xl font-extrabold leading-snug">
                {slide.title}
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-neutral-400">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* dots 인디케이터 */}
      <div className="mb-5 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.number}
            type="button"
            aria-label={`${i + 1}번째 슬라이드로 이동`}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? 'bg-black' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>

      {/* 다음 / 시작하기 */}
      <div className="px-6 pb-8">
        <Button
          label={isLast ? '시작하기' : '다음'}
          shape="pill"
          fullWidth
          onClick={handleNext}
        />
      </div>
    </PageLayout>
  );
};

export default ServiceIntroPage;
