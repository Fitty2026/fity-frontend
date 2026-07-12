import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { CategoryTabs, ClothingThumbnail } from '@/features/closet/components';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

const CATEGORIES = ['전체', '상의', '하의', '아우터', '신발'];

/** 하단 탭 (페이지-로컬 — shared BottomNav는 탭/높이가 이 화면과 달라 override).
 *  아이콘 fill이 상태별로 박혀 있음(비활성 회색, 옷장=활성 검정) */
const NAV_ITEMS = [
  {
    label: '홈',
    path: '/home',
    icon: (
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM0 18V6L8 0L16 6V18H9V12H7V18H0Z" fill="#A7A7AF"/>
      </svg>
    ),
  },
  {
    label: '스튜디오',
    path: '/styling',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10ZM2 6H6V2H2V6ZM12 6H16V2H12V6ZM12 16H16V12H12V16ZM2 16H6V12H2V16Z" fill="#A1A1AA"/>
      </svg>
    ),
  },
  {
    label: '옷장',
    path: '/closet',
    icon: (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 16C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15C0 14.8333 0.0333333 14.6792 0.1 14.5375C0.166667 14.3958 0.266667 14.2833 0.4 14.2L9 7.75V6C9 5.71667 9.1 5.47917 9.3 5.2875C9.5 5.09583 9.74167 5 10.025 5C10.4417 5 10.7917 4.85 11.075 4.55C11.3583 4.25 11.5 3.89167 11.5 3.475C11.5 3.05833 11.3542 2.70833 11.0625 2.425C10.7708 2.14167 10.4167 2 10 2C9.58333 2 9.22917 2.14583 8.9375 2.4375C8.64583 2.72917 8.5 3.08333 8.5 3.5H6.5C6.5 2.53333 6.84167 1.70833 7.525 1.025C8.20833 0.341667 9.03333 0 10 0C10.9667 0 11.7917 0.3375 12.475 1.0125C13.1583 1.6875 13.5 2.50833 13.5 3.475C13.5 4.25833 13.2708 4.95833 12.8125 5.575C12.3542 6.19167 11.75 6.61667 11 6.85V7.75L19.6 14.2C19.7333 14.2833 19.8333 14.3958 19.9 14.5375C19.9667 14.6792 20 14.8333 20 15C20 15.2833 19.9042 15.5208 19.7125 15.7125C19.5208 15.9042 19.2833 16 19 16H1ZM4 14H16L10 9.5L4 14Z" fill="black"/>
      </svg>
    ),
  },
  {
    label: '내 코디',
    path: '/myoutfit',
    icon: (
      <svg width="17.6" height="17.6" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.8 8.8C7.59 8.8 6.55417 8.36917 5.6925 7.5075C4.83083 6.64583 4.4 5.61 4.4 4.4C4.4 3.19 4.83083 2.15417 5.6925 1.2925C6.55417 0.430833 7.59 0 8.8 0C10.01 0 11.0458 0.430833 11.9075 1.2925C12.7692 2.15417 13.2 3.19 13.2 4.4C13.2 5.61 12.7692 6.64583 11.9075 7.5075C11.0458 8.36917 10.01 8.8 8.8 8.8ZM0 17.6V14.52C0 13.8967 0.160417 13.3238 0.48125 12.8013C0.802083 12.2787 1.22833 11.88 1.76 11.605C2.89667 11.0367 4.05167 10.6104 5.225 10.3263C6.39833 10.0421 7.59 9.9 8.8 9.9C10.01 9.9 11.2017 10.0421 12.375 10.3263C13.5483 10.6104 14.7033 11.0367 15.84 11.605C16.3717 11.88 16.7979 12.2787 17.1188 12.8013C17.4396 13.3238 17.6 13.8967 17.6 14.52V17.6H0Z" fill="#A7A7AF"/>
      </svg>
    ),
  },
];

/** 옷장 아이템 (와이어프레임용 목업 — 이미지 없이 비율만 다르게 masonry) */
const ITEMS = [
  { id: 1, ratio: 'aspect-[3/4]' },
  { id: 2, ratio: 'aspect-[3/2]' },
  { id: 3, ratio: 'aspect-[3/5]' },
  { id: 4, ratio: 'aspect-square' },
  { id: 5, ratio: 'aspect-[4/3]' },
  { id: 6, ratio: 'aspect-[4/3]' },
];

/**
 * 내 옷장 홈 (Closet Home, CLO-05)
 * - 카테고리 필터 + 아이템 masonry 그리드 + 추가 FAB
 */
const ClosetHomePage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('전체');

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
      {/* 헤더 (타이틀 중앙) */}
      <header className="relative flex items-center justify-center h-16 px-4 bg-white border-b border-[#E5E5E5]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 flex items-center justify-center w-10 h-10 -ml-2"
          aria-label="뒤로가기"
        >
          <BackIcon />
        </button>
        <h1 className="text-base font-medium leading-5 text-black">내 옷장</h1>
      </header>

      {/* 카테고리 필터 (헤더↔바 16, 좌우 20, 탭 gap 8) */}
      <div className="px-5 py-4 bg-[#F9F9F9]">
        <CategoryTabs categories={CATEGORIES} active={category} onChange={setCategory} />
      </div>

      {/* 아이템 masonry 그리드 (스크롤 영역) */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pt-2 pb-6">
        <div className="columns-2 gap-3">
          {ITEMS.map((item) => (
            <ClothingThumbnail
              key={item.id}
              ratio="auto"
              className={`w-full mb-3 break-inside-avoid ${item.ratio}`}
            />
          ))}
        </div>
      </div>

      {/* 하단 탭바 (Figma: 높이 80) — 옷장 active */}
      <nav className="shrink-0 h-20 bg-white border-t border-[#E5E5E5]">
        <ul className="flex items-center justify-around h-full">
          {NAV_ITEMS.map((item) => {
            const active = item.path === '/closet';
            return (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 min-w-[60px]"
                  aria-label={item.label}
                >
                  <span className="flex items-center justify-center h-[18px]">{item.icon}</span>
                  <span
                    className={`text-[10px] font-medium leading-[15px] tracking-[-0.5px] uppercase ${
                      active ? 'text-black' : 'text-[#A7A7AF]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 추가 FAB (Figma: 56×56 / bg #000 / 우26 / nav 위) */}
      <button
        type="button"
        onClick={() => navigate('/closet/register')}
        className="absolute bottom-[108px] right-[26px] flex items-center justify-center w-14 h-14 rounded-full bg-black! shadow-lg"
        aria-label="옷 추가"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="white" />
        </svg>
      </button>
      </div>
    </PageLayout>
  );
};

export default ClosetHomePage;
