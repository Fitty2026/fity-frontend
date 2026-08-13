import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
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

/** 삭제 — 16×16, 원 안의 X. stroke #F6F7F8 (Figma) */
const RemoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M6.5 6.5L9.5 9.5M9.5 6.5L6.5 9.5M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.0241 13.2417 10.2961 13.5433C9.56815 13.8448 8.78793 14 8 14C7.21207 14 6.43185 13.8448 5.7039 13.5433C4.97595 13.2417 4.31451 12.7998 3.75736 12.2426C3.20021 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.5913 2 11.1174 2.63214 12.2426 3.75736C13.3679 4.88258 14 6.4087 14 8Z"
      stroke="#F6F7F8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
  const files = useClosetStore((state) => state.receiptFiles);
  const setReceipts = useClosetStore((state) => state.setReceipts);
  const registerEntry = useClosetStore((state) => state.registerEntry);
  const fileRef = useRef<HTMLInputElement>(null);
  // 인식에 쓸 사진 — 처음엔 전부 선택
  const [excluded, setExcluded] = useState<Set<number>>(new Set());

  // 새로고침 가드 — 갈래 값이 사라진 채 진행하면 구매내역이 영수증으로 전송된다 (업로드 안내와 같은 이유)
  if (!registerEntry) return <Navigate to="/closet/register" replace />;

  const toggle = (index: number) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  /** 사진 자체를 뺀다 — 뒤 사진들의 번호가 당겨지므로 제외 표시도 같이 옮긴다 */
  const remove = (index: number) => {
    setReceipts(
      images.filter((_, i) => i !== index),
      files.filter((_, i) => i !== index),
    );
    setExcluded((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const handleAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    if (picked.length === 0) return;
    const urls = picked.map((file) => URL.createObjectURL(file));
    setReceipts([...images, ...urls].slice(0, MAX_FILES), [...files, ...picked].slice(0, MAX_FILES));
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

          {/* 장수 30×27 — 타이틀 아래 8 (Figma top 197). 18px SemiBold, 고른 수만 Point 색 */}
          <p className="mt-2 text-center text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#34363C]">
            <span className="text-[#9D98F0]">{selectedCount}</span>/{MAX_FILES}
          </p>

          {/* 썸네일 100×184, 3열. 장수 아래 53 (Figma top 277), 세로 간격 16.
              좌우 여백 24를 지키려면 가로 간격은 (327 - 300) / 2 = 13.5 */}
          <div className="mt-[53px] grid grid-cols-3 gap-x-[13.5px] gap-y-4 px-6">
            {images.map((src, index) => {
              const on = !excluded.has(index);
              return (
                // 삭제 버튼이 안에 들어가야 해서 바깥은 div (버튼 안에 버튼은 못 넣는다)
                <div
                  key={src}
                  className="relative h-[184px] w-[100px] overflow-hidden rounded-2xl border border-[#E6E8EA]"
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-pressed={on}
                    aria-label={`영수증 ${index + 1} 선택`}
                    className="block h-full w-full cursor-pointer"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>

                  {/* 선택 배지 16×16 — 위 8 / 왼쪽 12 (Figma) */}
                  {on && (
                    <span className="pointer-events-none absolute left-3 top-2">
                      <CheckBadge />
                    </span>
                  )}

                  {/* 삭제 16×16 — 위 8 / 오른쪽 8 (Figma) */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`영수증 ${index + 1} 삭제`}
                    className="absolute right-2 top-2 cursor-pointer"
                  >
                    <RemoveIcon />
                  </button>
                </div>
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
            // 체크를 뺀 장은 인식에 보내지 않는다 — 남길 장의 위치를 넘긴다
            onClick={() =>
              navigate('/closet/register/receipt-recognizing', {
                // 인식을 시작하면 이전 화면으로 돌아가지 못하게 한다 (같은 요청이 두 번 나간다)
                replace: true,
                state: { keep: images.map((_, i) => i).filter((i) => !excluded.has(i)) },
              })
            }
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
