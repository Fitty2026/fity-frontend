import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import IntroSlide from '@/features/auth/components/IntroSlide';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';

const SLIDES = [
  {
    title: '내 옷으로 코디를\n완성하세요',
    description: '이미 가지고 있는 옷만으로도 가장 잘 어울리는\n스타일을 추천해드려요',
  },
  {
    title: '취향과 체형에\n맞는 코디 추천',
    description: '스타일 취향과 체형을 분석해 나에게 가장 잘\n어울리는 코디를 찾아드려요',
    badges: ['캐주얼', '미니멀', '스트릿'],
  },
  {
    title: '아바타로 미리 입어보세요',
    description: '내 체형에 맞는 아바타에 코디를 적용해 실제\n착용 모습을 미리 확인할 수 있어요',
  },
];

const SWIPE_THRESHOLD_PX = 50;

const ServiceIntroPage = () => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  const goToLogin = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    navigate('/login');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -SWIPE_THRESHOLD_PX) {
      setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
    } else if (diff > SWIPE_THRESHOLD_PX) {
      setIndex((i) => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
      {/* 건너뛰기 */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={goToLogin}
          className="text-sm text-neutral-400 hover:text-neutral-600"
        >
          건너뛰기
        </button>
      </div>

      {/* 슬라이드 영역 */}
      <div
        className="flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <IntroSlide key={slide.title} {...slide} />
          ))}
        </div>
      </div>

      {/* dots 인디케이터 */}
      <div className="mb-5 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`${i + 1}번째 슬라이드로 이동`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? 'bg-black' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>

      {/* 시작하기 */}
      <div className="px-6 pb-8">
        <Button label="시작하기" fullWidth onClick={goToLogin} />
      </div>
    </PageLayout>
  );
};

export default ServiceIntroPage;
