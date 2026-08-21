import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import { STYLE_TILES } from '@/features/onboarding/constants';
import type { StyleTag } from '@/types';

const COLLECT_THRESHOLD_PX = 80;
const COLLECT_ANIMATION_MS = 300;

const StyleSelectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile } = useMyProfile();
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const navigationStyleIds = (location.state as { styleTagIds?: number[] } | null)?.styleTagIds;
  const initialStyleIds = navigationStyleIds ?? profile?.styleTagIds;
  const initialStyles = STYLE_TILES.filter((tile) => initialStyleIds?.includes(tile.tagId)).map(
    (tile) => tile.tag,
  );
  const currentStyles = selectedStyles ?? initialStyles;
  const initialized = navigationStyleIds !== undefined || !!profile;

  const remaining = STYLE_TILES.filter((tile) => !currentStyles.includes(tile.tag));
  const loopEnabled = remaining.length > 2;

  const handlePointerDown = (x: number, y: number) => {
    dragStart.current = { x, y };
    setDragging(true);
  };

  const handlePointerMove = (x: number, y: number) => {
    if (!dragStart.current || leavingId) return;

    const dx = x - dragStart.current.x;
    const dy = y - dragStart.current.y;
    if (dy > 0 && dy > Math.abs(dx)) setDragY(dy);
  };

  const handlePointerUp = (tileId: string, tag: StyleTag) => {
    if (!dragStart.current) return;

    dragStart.current = null;
    setDragging(false);

    if (dragY > COLLECT_THRESHOLD_PX) {
      setLeavingId(tileId);
      window.setTimeout(() => {
        setSelectedStyles((styles) => [...(styles ?? currentStyles), tag]);
        setLeavingId(null);
        setDragY(0);
      }, COLLECT_ANIMATION_MS);
      return;
    }

    setDragY(0);
  };

  const handleComplete = () => {
    const styleTagIds = STYLE_TILES.filter((tile) => currentStyles.includes(tile.tag)).map(
      (tile) => tile.tagId,
    );

    navigate('/mypage/profile/style', {
      replace: true,
      state: { styleTagIds },
    });
  };

  return (
    <MyPageScaffold
      title="스타일 수정"
      contentClassName="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      footer={
        <MyPageButton
          disabled={!initialized || currentStyles.length === 0}
          onClick={handleComplete}
        >
          선택 완료
        </MyPageButton>
      }
    >
      <div className="flex h-full min-h-[560px] flex-col pb-8 pt-10">
        <div className="px-6 text-center">
          <h2 className="text-lg font-semibold leading-relaxed">
            선호하는 스타일을
            <br />
            아래로 스와이프해주세요
          </h2>
          <p className="mt-1 text-xs text-neutral-400">많이 모을 수록 더 정확해져요</p>
        </div>

        <div className="mt-6 flex flex-1 items-center overflow-hidden">
          {remaining.length === 0 ? (
            <p className="w-full text-center text-sm text-neutral-500">모든 스타일을 모았어요!</p>
          ) : (
            <Swiper
              key={remaining.map((tile) => tile.id).join('-')}
              className="h-full w-full"
              slidesPerView="auto"
              centeredSlides
              spaceBetween={16}
              loop={loopEnabled}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setActiveIndex(swiper.realIndex);
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {remaining.map((tile, index) => {
                const isActive = index === activeIndex;
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
                      }}
                      onTouchStart={(event) =>
                        handlePointerDown(event.touches[0].clientX, event.touches[0].clientY)
                      }
                      onTouchMove={(event) =>
                        handlePointerMove(event.touches[0].clientX, event.touches[0].clientY)
                      }
                      onTouchEnd={() => handlePointerUp(tile.id, tile.tag)}
                      onMouseDown={(event) => handlePointerDown(event.clientX, event.clientY)}
                      onMouseMove={(event) => handlePointerMove(event.clientX, event.clientY)}
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
      </div>
    </MyPageScaffold>
  );
};

export default StyleSelectPage;
