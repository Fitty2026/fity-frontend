import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

/**
 * 정면/측면/후면 안내·확인용 캐러셀 — 가운데 카드가 크게, 양옆이 살짝 보이는 형태.
 * 카드는 Figma 비율(246:420) 고정이라 화면 높이와 무관하게 시안 크기로 보인다.
 */
const PhotoCarousel = ({
  imageSrcs,
  initialSlide = 0,
  fit = 'contain',
  highlighted,
}: {
  imageSrcs: string[];
  initialSlide?: number;
  /** contain: 마네킹 일러스트용(기본) / cover: 실사 촬영본용 */
  fit?: 'contain' | 'cover';
  /** true인 사진은 빨간 테두리로 강조 (분석 실패 안내용) */
  highlighted?: boolean[];
}) => (
  <Swiper
    className="w-full"
    slidesPerView="auto"
    centeredSlides
    spaceBetween={12}
    initialSlide={initialSlide}
  >
    {imageSrcs.map((src, i) => (
      <SwiperSlide key={`${src}-${i}`} className="!w-[64%] max-w-[270px]">
        <div
          className={`flex aspect-[246/420] w-full items-center justify-center overflow-hidden rounded-3xl border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] ${
            highlighted?.[i] ? 'border-red-400' : 'border-neutral-100'
          }`}
        >
          <img
            src={src}
            alt={`체형 사진 ${i + 1}`}
            className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain p-3'}`}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default PhotoCarousel;
