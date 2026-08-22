import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import Button from '@/components/ui/Button';
import BlobIntro from '@/features/onboarding/components/BlobIntro';
import OnboardingLayout from '@/features/onboarding/components/OnboardingLayout';
import { STYLE_TILES } from '@/features/onboarding/constants';
import useSaveOnboardingStyle from '@/features/onboarding/hooks/useSaveOnboardingStyle';
import { getErrorMessage } from '@/lib/apiError';
import useOnboardingStore from '@/store/onboardingStore';

const INTRO_DURATION_MS = 2500;
/** 아래로 이만큼(px) 이상 끌면 수집으로 판정 */
const COLLECT_THRESHOLD_PX = 80;
/** 수집 애니메이션(카드가 아래로 빠지는) 시간 */
const COLLECT_ANIMATION_MS = 300;

const StyleSwipePage = () => {
  const navigate = useNavigate();
  const selectedStyles = useOnboardingStore((s) => s.selectedStyles);
  const toggleStyle = useOnboardingStore((s) => s.toggleStyle);
  const { mutate: saveStyle, isPending, error } = useSaveOnboardingStyle();

  const handleNext = () => {
    // 선택한 태그를 서버 tagId로 변환해 저장, 성공 시에만 다음 화면으로 이동
    const styleTagIds = STYLE_TILES.filter((tile) => selectedStyles.includes(tile.tag)).map(
      (tile) => tile.tagId,
    );
    saveStyle(styleTagIds, {
      onSuccess: () => navigate('/onboarding/style/confirm'),
    });
  };

  const [showIntro, setShowIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // 아직 수집하지 않은 타일만 캐러셀에 남긴다
  const remaining = STYLE_TILES.filter((tile) => !selectedStyles.includes(tile.tag));
  // 루프는 3장 이상일 때만 - 2장 이하에서 loop를 켜면 같은 카드가 양옆에 중복 표시됨
  const loopEnabled = remaining.length > 2;

  const handlePointerDown = (x: number, y: number) => {
    dragStart.current = { x, y };
    setDragging(true);
  };

  const handlePointerMove = (x: number, y: number) => {
    if (!dragStart.current || leavingId) return;
    const dx = x - dragStart.current.x;
    const dy = y - dragStart.current.y;
    // 세로 의도(아래 방향)일 때만 카드를 따라 내린다
    if (dy > 0 && dy > Math.abs(dx)) setDragY(dy);
  };

  const handlePointerUp = (tileId: string, tag: (typeof STYLE_TILES)[number]['tag']) => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setDragging(false);

    if (dragY > COLLECT_THRESHOLD_PX) {
      // 수집 확정 - 카드가 아래로 빠진 뒤 스토어에 반영되며 캐러셀에서 제거된다
      setLeavingId(tileId);
      setTimeout(() => {
        toggleStyle(tag);
        setLeavingId(null);
        setDragY(0);
      }, COLLECT_ANIMATION_MS);
    } else {
      setDragY(0);
    }
  };

  return (
    <OnboardingLayout progress={0.2}>
      {showIntro ? (
        <BlobIntro message="취향을 알아볼게요" size="md" />
      ) : (
        <div className="flex flex-1 flex-col pb-8 pt-10">
          <div className="px-6 text-center">
            <h2 className="text-lg font-semibold leading-relaxed">
              선호하는 스타일을
              <br />
              아래로 스와이프해주세요
            </h2>
            <p className="mt-1 text-xs text-neutral-400">많이 모을 수록 더 정확해져요</p>
          </div>

          {/* 카드 캐러셀 */}
          <div className="mt-6 flex flex-1 items-center overflow-hidden overscroll-contain">
            {remaining.length === 0 ? (
              <p className="w-full text-center text-sm text-neutral-500">
                모든 스타일을 모았어요!
              </p>
            ) : (
              <Swiper
                // 카드 수가 변할 때 loop 재계산을 위해 재마운트
                key={remaining.map((t) => t.id).join('-')}
                className="h-full w-full"
                slidesPerView="auto"
                centeredSlides
                spaceBetween={16}
                loop={loopEnabled}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  // 카드 수집으로 재마운트되면 activeIndex를 다시 맞춘다
                  setActiveIndex(swiper.realIndex);
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              >
                {remaining.map((tile, i) => {
                  const isActive = i === activeIndex;
                  const isLeaving = leavingId === tile.id;
                  const offsetY = isLeaving ? 480 : isActive ? dragY : 0;
                  return (
                    <SwiperSlide key={tile.id} className="!w-[62%]">
                      <div
                        className="mx-auto h-full max-h-[420px] overflow-hidden rounded-2xl bg-neutral-100"
                        style={{
                          transform: `translateY(${offsetY}px)`,
                          opacity: isLeaving ? 0 : 1,
                          transition: dragging
                            ? 'none'
                            : `transform ${COLLECT_ANIMATION_MS}ms ease-in, opacity ${COLLECT_ANIMATION_MS}ms ease-in`,
                          // 카드 위 터치는 브라우저에 넘기지 않는다.
                          // 안드로이드 크롬은 화면 최상단에서 아래로 끄는 제스처를 당겨서 새로고침으로 처리하는데,
                          // 이 화면의 수집 동작이 정확히 그 제스처라 카드를 내리려다 새로고침이 걸렸다.
                          // React가 touchmove를 passive로 붙여 preventDefault가 안 먹으므로 CSS로 막는다.
                          // iOS는 당겨서 새로고침이 없지만 홈 화면에 추가한 경우엔 생기고, 고무줄 스크롤도 같은 자리에서 걸린다
                          touchAction: 'none',
                          overscrollBehavior: 'contain',
                          // 길게 누를 때 뜨는 이미지 메뉴·텍스트 선택이 드래그를 끊는다 (iOS 사파리)
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          userSelect: 'none',
                        }}
                        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
                        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
                        onTouchEnd={() => handlePointerUp(tile.id, tile.tag)}
                        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                        onMouseUp={() => handlePointerUp(tile.id, tile.tag)}
                        onMouseLeave={() => handlePointerUp(tile.id, tile.tag)}
                      >
                        <img
                          src={tile.imageSrc}
                          alt={`${tile.tag} 스타일`}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>

          <div className="mt-6 px-6">
            {error && (
              <p className="mb-2 text-center text-sm text-red-500">{getErrorMessage(error)}</p>
            )}
            <Button
              label={isPending ? '저장 중...' : '다음'}
              shape="pill"
              fullWidth
              disabled={selectedStyles.length === 0 || isPending}
              onClick={handleNext}
            />
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default StyleSwipePage;
