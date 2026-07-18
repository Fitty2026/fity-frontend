import { useState } from 'react';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetBottomNav } from '@/features/closet/components';
import mock1 from '@/assets/images/closet/tag-mock.png';
import mock2 from '@/assets/images/closet/tag-mock2.png';
import mock3 from '@/assets/images/closet/tag-mock3.png';

/** 아이템 목록 목 데이터 — 행 3개 (임시) */
const MOCK_ROWS = [
  [mock1, mock2, mock3, mock1],
  [mock3, mock1, mock2, mock3],
  [mock2, mock3, mock1, mock2],
];

const FILTERS = ['전체', '상의', '하의', '신발', '악세사리', '기타'];
const SORTS = ['최신순', '브랜드', '컬러'];

/** 카운트 옷걸이 — 16×16, #1F2124 */
const CountIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.0982 10.7L8.83321 6L10.2995 4.9C10.3617 4.85349 10.4122 4.79313 10.447 4.7237C10.4818 4.65427 10.5 4.57768 10.5001 4.5C10.5001 3.83696 10.2367 3.20107 9.76785 2.73223C9.29901 2.26339 8.66312 2 8.00008 2C7.33704 2 6.70115 2.26339 6.23231 2.73223C5.76347 3.20107 5.50008 3.83696 5.50008 4.5C5.50008 4.63261 5.55276 4.75979 5.64653 4.85355C5.7403 4.94732 5.86747 5 6.00008 5C6.13269 5 6.25987 4.94732 6.35363 4.85355C6.4474 4.75979 6.50008 4.63261 6.50008 4.5C6.50109 4.12339 6.64374 3.76094 6.89968 3.48466C7.15561 3.20837 7.50612 3.03848 7.88155 3.00872C8.25699 2.97896 8.62988 3.09152 8.92615 3.32403C9.22242 3.55655 9.42038 3.892 9.48071 4.26375L7.70883 5.59312L7.69133 5.60625L0.901955 10.7C0.734177 10.8258 0.610207 11.0012 0.54758 11.2014C0.484953 11.4015 0.48684 11.6163 0.552974 11.8153C0.619107 12.0144 0.74614 12.1876 0.916103 12.3104C1.08607 12.4333 1.29036 12.4996 1.50008 12.5H14.5001C14.71 12.5 14.9145 12.434 15.0848 12.3112C15.2551 12.1885 15.3824 12.0153 15.4488 11.8162C15.5151 11.6171 15.5172 11.4022 15.4546 11.2018C15.392 11.0015 15.268 10.8259 15.1001 10.7H15.0982ZM14.5001 11.5H1.50008L8.00008 6.625L14.5001 11.5Z" fill="#1F2124" />
  </svg>
);

/** 검색 돋보기 — 16×16, #959BA7 */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9995 13.9995L10.5349 10.5349M10.5349 10.5349C11.4726 9.59716 11.9994 8.32534 11.9994 6.99921C11.9994 5.67308 11.4726 4.40126 10.5349 3.46354C9.59716 2.52583 8.32534 1.99902 6.99921 1.99902C5.67308 1.99902 4.40126 2.52583 3.46354 3.46354C2.52583 4.40126 1.99902 5.67308 1.99902 6.99921C1.99902 8.32534 2.52583 9.59716 3.46354 10.5349C4.40126 11.4726 5.67308 11.9994 6.99921 11.9994C8.32534 11.9994 9.59716 11.4726 10.5349 10.5349Z" stroke="#959BA7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 정렬 드롭다운 화살표 — 16×16 */
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 5.5L8 10.5L3 5.5" stroke="#1F2124" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 아이템 목록 — 옷장 홈 '전체보기' 진입. 필터/정렬 + 전체 아이템 행. (러프 — 세부 스펙 대기)
 */
const ClosetItemListPage = () => {
  const [filter, setFilter] = useState('전체');

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        {/* 상단바 — back / 옷장 / 카운트 */}
        <div className="relative flex h-[53px] shrink-0 items-center justify-center border-b border-[#B2B8BD]">
          <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">옷장</span>
          <span className="absolute right-5 flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">
            <CountIcon />
            88개
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* 타이틀 — 전체 아이템 + 보유 개수 */}
          <div className="px-6 pt-6">
            <h1 className="text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">전체 아이템</h1>
            <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em]">
              <span className="text-[#1F2124]">88</span>
              <span className="text-[#5A6169]">개 보유</span>
            </p>
          </div>

          {/* 검색바 — 327×36, '88개 보유' 아래 17 */}
          <div className="mt-[17px] px-6">
            <div className="flex h-9 items-center gap-2.5 rounded-[32px] border border-[#959BA7] bg-white py-2 pl-3 pr-3">
              <SearchIcon />
              <input
                type="text"
                placeholder="검색어를 입력해주세요"
                className="w-full bg-transparent text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124] placeholder-[#B2B8BD] outline-none"
              />
            </div>
          </div>

          {/* 필터 칩 — 가로 스크롤 */}
          <div className="mt-3 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={[
                  'h-[30px] shrink-0 cursor-pointer rounded-[32px] border px-3 py-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em]',
                  filter === f ? 'border-[#1F2124] bg-[#1F2124] text-[#F6F7F8]' : 'border-[#E6E8EA] bg-[#F6F7F8] text-[#1F2124]',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>

          {/* 정렬 드롭다운 (임시 — 동작 없음) */}
          <div className="mt-3 flex gap-2 px-6">
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                className="flex h-[30px] cursor-pointer items-center gap-2.5 rounded-[32px] border border-[#E6E8EA] bg-white px-4 py-1 text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
              >
                {s}
                <ChevronDown />
              </button>
            ))}
          </div>

          {/* 아이템 행 — 가로 스크롤, 구분선 (위아래 20) */}
          <div className="mt-5 flex flex-col gap-5 pb-6">
            {MOCK_ROWS.map((items, r) => (
              <div key={r}>
                <div className="flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {items.map((src, i) => (
                    <img key={i} src={src} alt="" className="h-[134px] w-[104px] shrink-0 rounded-2xl object-cover" />
                  ))}
                </div>
                <div className="mx-6 mt-5 border-b border-[#E6E8EA]" />
              </div>
            ))}
          </div>
        </div>

        <ClosetBottomNav />
      </div>
    </PageLayout>
  );
};

export default ClosetItemListPage;
