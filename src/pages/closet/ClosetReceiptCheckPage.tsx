import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 업로드 가능한 영수증 이미지 최대 장수 (OCR API 스펙) */
const MAX_FILES = 5;

/** 선택 체크 — 16×16, 원 #1F2124 / 체크 #F6F7F8 */
const CheckBadge = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <g clipPath="url(#clip0_2487_12444)">
      <path
        d="M15.391 11.0615C15.7931 10.0909 16 9.05058 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 9.05058 0.206926 10.0909 0.608964 11.0615C1.011 12.0321 1.60028 12.914 2.34315 13.6569C3.08601 14.3997 3.96793 14.989 4.93853 15.391C5.90914 15.7931 6.94943 16 8 16C9.05058 16 10.0909 15.7931 11.0615 15.391C12.0321 14.989 12.914 14.3997 13.6569 13.6569C14.3997 12.914 14.989 12.0321 15.391 11.0615Z"
        fill="#1F2124"
      />
      <path
        d="M5.33333 8.66667L7.33333 10.6667L10.6667 6M16 8C16 9.05058 15.7931 10.0909 15.391 11.0615C14.989 12.0321 14.3997 12.914 13.6569 13.6569C12.914 14.3997 12.0321 14.989 11.0615 15.391C10.0909 15.7931 9.05058 16 8 16C6.94943 16 5.90914 15.7931 4.93853 15.391C3.96793 14.989 3.08601 14.3997 2.34315 13.6569C1.60028 12.914 1.011 12.0321 0.608964 11.0615C0.206926 10.0909 -1.56548e-08 9.05058 0 8C3.16163e-08 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8Z"
        stroke="#F6F7F8"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2487_12444">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/** 사진 추가 — 32×32, 원 채움 #9D98F0 / 십자 #F6F7F8 */
const AddIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M27.0866 20.5922C27.6896 19.1363 28 17.5759 28 16C28 12.8174 26.7357 9.76516 24.4853 7.51472C22.2348 5.26428 19.1826 4 16 4C12.8174 4 9.76515 5.26428 7.51472 7.51472C5.26428 9.76516 4 12.8174 4 16C4 17.5759 4.31039 19.1363 4.91345 20.5922C5.5165 22.0481 6.40042 23.371 7.51472 24.4853C8.62902 25.5996 9.95189 26.4835 11.4078 27.0866C12.8637 27.6896 14.4241 28 16 28C17.5759 28 19.1363 27.6896 20.5922 27.0866C22.0481 26.4835 23.371 25.5996 24.4853 24.4853C25.5996 23.371 26.4835 22.0481 27.0866 20.5922Z"
      fill="#9D98F0"
    />
    <path
      d="M16 12V20M20 16H12M28 16C28 17.5759 27.6896 19.1363 27.0866 20.5922C26.4835 22.0481 25.5996 23.371 24.4853 24.4853C23.371 25.5996 22.0481 26.4835 20.5922 27.0866C19.1363 27.6896 17.5759 28 16 28C14.4241 28 12.8637 27.6896 11.4078 27.0866C9.95189 26.4835 8.62902 25.5996 7.51472 24.4853C6.40042 23.371 5.5165 22.0481 4.91345 20.5922C4.31039 19.1363 4 17.5759 4 16C4 12.8174 5.26428 9.76516 7.51472 7.51472C9.76516 5.26428 12.8174 4 16 4C19.1826 4 22.2348 5.26428 24.4853 7.51472C26.7357 9.76516 28 12.8174 28 16Z"
      stroke="#F6F7F8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 업로드한 영수증 확인 — 고른 사진을 늘어놓고 인식할 것만 남긴다.
 * ※ 썸네일 간격·체크 배지 위치는 시안 값 미수급이라 임시.
 */
const ClosetReceiptCheckPage = () => {
  const navigate = useNavigate();
  const images = useClosetStore((state) => state.receiptImages);
  const setImages = useClosetStore((state) => state.setReceiptImages);
  const fileRef = useRef<HTMLInputElement>(null);
  // 인식에 쓸 사진 — 처음엔 전부 선택
  const [excluded, setExcluded] = useState<Set<number>>(new Set());

  const toggle = (index: number) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const handleAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    if (picked.length === 0) return;
    const urls = picked.map((file) => URL.createObjectURL(file));
    setImages([...images, ...urls].slice(0, MAX_FILES));
    event.target.value = '';
  };

  const selectedCount = images.length - excluded.size;

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 타이틀 — 375×30 (Title/T3) */}
          <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            업로드한 영수증이 다음과 같아요?
          </h1>

          {/* 썸네일 100×184, 3열. 타이틀 아래 88, 세로 간격 16.
              좌우 여백 24를 지키려면 가로 간격은 (327 - 300) / 2 = 13.5 */}
          <div className="mt-[88px] grid grid-cols-3 gap-x-[13.5px] gap-y-4 px-6">
            {images.map((src, index) => {
              const on = !excluded.has(index);
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => toggle(index)}
                  className={[
                    'relative h-[184px] w-[100px] cursor-pointer overflow-hidden rounded-2xl',
                    on ? 'border border-[#1F2124]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <img src={src} alt={`업로드한 영수증 ${index + 1}`} className="h-full w-full object-cover" />
                  {/* 배지 16×16 — 위 8 / 오른쪽 12 (Figma) */}
                  {on && (
                    <span className="absolute right-[12px] top-2">
                      <CheckBadge />
                    </span>
                  )}
                </button>
              );
            })}

            {/* 사진 추가 — 최대 장수 전까지 노출 */}
            {images.length < MAX_FILES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-[184px] w-[100px] cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#9D98F0]"
              >
                <AddIcon />
                {/* Body/B6 — 14px SemiBold */}
                <span className="text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
                  사진추가
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 하단 고정 CTA — 327×58 */}
        <div className="px-6 pt-4 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAdd}
          />
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => navigate('/closet/register/receipt-recognizing')}
            className={[
              'h-[58px] w-full rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
              selectedCount > 0
                ? 'cursor-pointer bg-[#1F2124] text-[#F6F7F8]'
                : 'cursor-not-allowed bg-[#E6E8EA] text-[#959BA7]',
            ].join(' ')}
          >
            확인
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptCheckPage;
