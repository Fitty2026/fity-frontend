import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { StudioHeader, SelectableImageCard } from '@/features/styling/components';
import topImg from '@/assets/images/items/top.jpg';
import pantsImg from '@/assets/images/items/pants.jpg';
import outerImg from '@/assets/images/items/outer.jpg';
import shoesImg from '@/assets/images/items/shoes.jpg';
import top2Img from '@/assets/images/items/top2.jpg';

const CATEGORIES = ['전체', '상의', '하의', '아우터', '신발'];

/** 아이템 목업 (균일 그리드 — 전부 169×225.33 = 3/4) */
const ITEMS = [
  { id: 1, label: 'TOP', img: topImg, category: '상의' },
  { id: 2, label: 'PANTS', img: pantsImg, category: '하의' },
  { id: 3, label: 'OUTER', img: outerImg, category: '아우터' },
  { id: 4, label: 'SHOES', img: shoesImg, category: '신발' },
  { id: 5, label: 'TOP', img: top2Img, category: '상의' },
];

/** 검색 아이콘 (17×17, #727272) */
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 6.62402C0 5.71094 0.171549 4.85596 0.514648 4.05908C0.857747 3.25667 1.33366 2.55111 1.94238 1.94238C2.55111 1.33366 3.25391 0.857747 4.05078 0.514648C4.85319 0.171549 5.71094 0 6.62402 0C7.53711 0 8.39209 0.171549 9.18896 0.514648C9.99137 0.857747 10.6969 1.33366 11.3057 1.94238C11.9144 2.55111 12.3903 3.25667 12.7334 4.05908C13.0765 4.85596 13.248 5.71094 13.248 6.62402C13.248 7.38216 13.1263 8.10156 12.8828 8.78223C12.6449 9.46289 12.3128 10.0799 11.8867 10.6333L15.9458 14.7173C16.0343 14.8058 16.1007 14.9082 16.145 15.0244C16.1948 15.1406 16.2197 15.2651 16.2197 15.3979C16.2197 15.5806 16.1782 15.7466 16.0952 15.896C16.0177 16.0454 15.9071 16.1616 15.7632 16.2446C15.6193 16.3332 15.4533 16.3774 15.2651 16.3774C15.1323 16.3774 15.005 16.3525 14.8833 16.3027C14.7671 16.2585 14.6592 16.1893 14.5596 16.0952L10.4756 12.0029C9.93327 12.3903 9.33561 12.6947 8.68262 12.916C8.02962 13.1374 7.34342 13.248 6.62402 13.248C5.71094 13.248 4.85319 13.0765 4.05078 12.7334C3.25391 12.3903 2.55111 11.9144 1.94238 11.3057C1.33366 10.6969 0.857747 9.99414 0.514648 9.19727C0.171549 8.39486 0 7.53711 0 6.62402ZM1.41943 6.62402C1.41943 7.34342 1.55225 8.01855 1.81787 8.64941C2.08903 9.27474 2.46257 9.82536 2.93848 10.3013C3.41992 10.7772 3.97331 11.1507 4.59863 11.4219C5.22949 11.693 5.90462 11.8286 6.62402 11.8286C7.34342 11.8286 8.01579 11.693 8.64111 11.4219C9.27197 11.1507 9.82536 10.7772 10.3013 10.3013C10.7772 9.82536 11.1507 9.27474 11.4219 8.64941C11.693 8.01855 11.8286 7.34342 11.8286 6.62402C11.8286 5.90462 11.693 5.23226 11.4219 4.60693C11.1507 3.97607 10.7772 3.42269 10.3013 2.94678C9.82536 2.46533 9.27197 2.0918 8.64111 1.82617C8.01579 1.55501 7.34342 1.41943 6.62402 1.41943C5.90462 1.41943 5.22949 1.55501 4.59863 1.82617C3.97331 2.0918 3.41992 2.46533 2.93848 2.94678C2.46257 3.42269 2.08903 3.97607 1.81787 4.60693C1.55225 5.23226 1.41943 5.90462 1.41943 6.62402Z" fill="#727272" />
  </svg>
);
/** 마이크 아이콘 (12×18, #727272) */
const MicIcon = () => (
  <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.94336 11.563C5.38997 11.563 4.90576 11.4357 4.49072 11.1812C4.07568 10.9266 3.75195 10.5752 3.51953 10.127C3.28711 9.67318 3.1709 9.15023 3.1709 8.55811V3.00488C3.1709 2.41276 3.28711 1.89258 3.51953 1.44434C3.75195 0.99056 4.07568 0.636393 4.49072 0.381836C4.90576 0.127279 5.38997 0 5.94336 0C6.49121 0 6.97266 0.127279 7.3877 0.381836C7.80827 0.636393 8.132 0.99056 8.35889 1.44434C8.59131 1.89258 8.70752 2.41276 8.70752 3.00488V8.55811C8.70752 9.15023 8.59131 9.67318 8.35889 10.127C8.132 10.5752 7.80827 10.9266 7.3877 11.1812C6.97266 11.4357 6.49121 11.563 5.94336 11.563ZM5.94336 14.5098C5.05794 14.5098 4.25 14.3714 3.51953 14.0947C2.7946 13.8125 2.16927 13.4141 1.64355 12.8994C1.11784 12.3792 0.7111 11.765 0.42334 11.0566C0.141113 10.3428 0 9.5542 0 8.69092V7.00586C0 6.83431 0.0608724 6.68766 0.182617 6.56592C0.304362 6.44417 0.451009 6.3833 0.622559 6.3833C0.799642 6.3833 0.949056 6.44417 1.0708 6.56592C1.19255 6.68766 1.25342 6.83431 1.25342 7.00586V8.64111C1.25342 9.58187 1.4471 10.4064 1.83447 11.1147C2.22184 11.8231 2.76693 12.3737 3.46973 12.7666C4.17253 13.154 4.99707 13.3477 5.94336 13.3477C6.88965 13.3477 7.71143 13.154 8.40869 12.7666C9.11149 12.3737 9.65658 11.8231 10.0439 11.1147C10.4313 10.4064 10.625 9.58187 10.625 8.64111V7.00586C10.625 6.83431 10.6859 6.68766 10.8076 6.56592C10.9294 6.44417 11.0788 6.3833 11.2559 6.3833C11.4274 6.3833 11.5741 6.44417 11.6958 6.56592C11.8175 6.68766 11.8784 6.83431 11.8784 7.00586V8.69092C11.8784 9.5542 11.7345 10.3428 11.4468 11.0566C11.1646 11.765 10.7606 12.3792 10.2349 12.8994C9.70915 13.4141 9.08105 13.8125 8.35059 14.0947C7.62565 14.3714 6.82324 14.5098 5.94336 14.5098ZM2.23291 17.6807C2.05583 17.6807 1.90641 17.6198 1.78467 17.498C1.66292 17.3763 1.60205 17.2297 1.60205 17.0581C1.60205 16.881 1.66292 16.7316 1.78467 16.6099C1.90641 16.4881 2.05583 16.4272 2.23291 16.4272H9.64551C9.82259 16.4272 9.97201 16.4881 10.0938 16.6099C10.2155 16.7316 10.2764 16.881 10.2764 17.0581C10.2764 17.2297 10.2155 17.3763 10.0938 17.498C9.97201 17.6198 9.82259 17.6807 9.64551 17.6807H2.23291ZM5.94336 17.4067C5.76628 17.4067 5.61686 17.3459 5.49512 17.2241C5.37337 17.1024 5.3125 16.953 5.3125 16.7759V14.2275C5.3125 14.0505 5.37337 13.901 5.49512 13.7793C5.61686 13.6576 5.76628 13.5967 5.94336 13.5967C6.11491 13.5967 6.26156 13.6576 6.3833 13.7793C6.50505 13.901 6.56592 14.0505 6.56592 14.2275V16.7759C6.56592 16.953 6.50505 17.1024 6.3833 17.2241C6.26156 17.3459 6.11491 17.4067 5.94336 17.4067Z" fill="#727272" />
  </svg>
);
/** FAB + 아이콘 (원래 16의 70% = 11.2) */
const PlusIcon = () => (
  <svg width="11.2" height="11.2" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="white" />
  </svg>
);

/**
 * 아이템 선택 (Item Selection, ITEM-01)
 * - 매치할 아이템 선택(카테고리/검색) → AI 코디 생성
 * ※ 정확한 px(탭·검색·카드·FAB·하단바)는 Figma 속성 패널 캡쳐로 확정 예정
 */
const StylingItemSelectPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('전체');
  const [selected, setSelected] = useState<number[]>([1]);

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        <StudioHeader title="스튜디오" starCount={100} onBack={() => navigate(-1)} />

        {/* 스크롤 영역 */}
        <div className="relative flex-1 overflow-y-auto min-h-0 px-5 pt-8 pb-6">
          {/* 타이틀 + 서브 */}
          <h1 className="text-2xl font-medium leading-8 tracking-[-0.24px] text-black whitespace-pre-line">
            {'매치하고 싶은\n아이템을 골라주세요'}
          </h1>
          <p className="mt-2 text-sm font-medium leading-5 text-[#5E5E5E]">
            자동으로 어울리는 코디를 만들어줘요.
          </p>

          {/* 카테고리 탭 */}
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  /* Figma: padding 8/20, radius full, text 12/500/lh16/tracking 0.6px */
                  className={`shrink-0 py-2 px-5 rounded-full text-xs font-medium leading-4 tracking-[0.6px] ${
                    active ? 'bg-black text-white' : 'bg-[#EEEEEE] text-[#5E5E5E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 검색 바 (Search Field): Fill 350 × Hug 44, radius100, padding 11, fill #787880 16% */}
          <div className="mt-3 flex items-center gap-2 p-[11px] rounded-full bg-[#787880]/16">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm font-medium text-[#1A1C1C] placeholder:text-[#8A8A8A]"
            />
            <MicIcon />
          </div>

          {/* 아이템 균일 그리드 (2열, 전 카드 동일 크기 169×225.33=3/4). 카테고리 필터(전체=전부) */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ITEMS.filter((item) => category === '전체' || item.category === category).map((item) => (
              <SelectableImageCard
                key={item.id}
                src={item.img}
                label={item.label}
                selected={selected.includes(item.id)}
                onClick={() => toggle(item.id)}
                aspectRatio="169/225.33"
                labelPosition="overlay-bottom-left"
                selectedFrameClassName="border-2 border-black"
                checkSize={25}
                overlayClassName="bg-black/40"
              />
            ))}
          </div>
        </div>

        {/* FAB (+) — 하단바 위에 고정 (스크롤해도 안 움직임) */}
        <button
          type="button"
          aria-label="아이템 추가"
          className="absolute right-5 bottom-[calc(191px+env(safe-area-inset-bottom))] z-10 flex items-center justify-center w-14 h-14 rounded-full bg-black shadow-lg"
        >
          <PlusIcon />
        </button>

        {/* 하단 고정 액션바: padding20, gap16, bg #FFF 95%, border-top 1px #F4F4F5, blur12 */}
        <div className="shrink-0 flex flex-col gap-4 bg-white/95 backdrop-blur-[12px] px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] border-t border-[#F4F4F5]">
          {/* 선택 아이템 프리뷰 — 썸네일 48×48 radius8 #EEEEEE + 우상단 삭제 배지 */}
          <div className="flex items-center gap-2">
            {ITEMS.filter((it) => selected.includes(it.id)).map((it) => (
              <div key={it.id} className="relative w-12 h-12 shrink-0 rounded-lg bg-[#EEEEEE]">
                <img src={it.img} alt={it.label} className="w-full h-full object-cover rounded-lg" />
                {/* 삭제 배지: ~11.59 원, top4/right4, bg #D9D9D9, border 1px #000 */}
                <button
                  type="button"
                  aria-label={`${it.label} 제거`}
                  onClick={() => toggle(it.id)}
                  className="absolute top-1 right-1 flex items-center justify-center w-3 h-3 rounded-full bg-[#D9D9D9] border border-black"
                >
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/styling/loading')}
            className="w-full h-14 rounded-lg bg-black! text-white text-base font-medium leading-6 cursor-pointer"
          >
            15스타로 코디 만들기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default StylingItemSelectPage;
