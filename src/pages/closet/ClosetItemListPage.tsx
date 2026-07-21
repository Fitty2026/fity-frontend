import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetBottomNav } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

const FILTERS = ['전체', '상의', '하의', '아우터', '신발', '가방', '액세서리'];

/** 정렬 순서 옵션 (임시 — 시안 미확정) */
const ORDERS = ['최신순', '오래된순'] as const;
type OrderKey = (typeof ORDERS)[number];

/** 컬러 후보 — 태그에 색상명이 들어있어 이를 기준으로 분류 (임시 — 시안 미확정) */
const COLOR_NAMES = ['화이트', '블랙', '그레이', '베이지', '연청', '아이보리'];

/** 뒤로가기 — 24×24 */
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

/** 정렬 활성 표시 화살표 — 16×16 (열림 시 위로 회전) */
const ChevronDown = ({ active, open }: { active: boolean; open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
  >
    <path d="M13 5.5L8 10.5L3 5.5" stroke={active ? '#F6F7F8' : '#1F2124'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 정렬/필터 드롭다운 칩 — 라벨 클릭 시 아래로 옵션 목록.
 * (임시 구현 — 드롭다운 UI/옵션 구성 시안 미확정)
 */
const DropdownChip = ({
  label,
  options,
  value,
  onSelect,
  open,
  onToggle,
}: {
  label: string;
  options: string[];
  value: string | null;
  onSelect: (option: string | null) => void;
  open: boolean;
  onToggle: () => void;
}) => {
  const active = value !== null;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={[
          'flex h-[30px] cursor-pointer items-center gap-2.5 rounded-[32px] border px-4 py-1 text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]',
          active ? 'border-[#1F2124] bg-[#1F2124] text-[#F6F7F8]' : 'border-[#E6E8EA] bg-white text-[#1F2124]',
        ].join(' ')}
      >
        {active ? value : label}
        <ChevronDown active={active} open={open} />
      </button>

      {open && (
        <ul className="absolute left-0 top-[34px] z-10 min-w-[104px] overflow-hidden rounded-2xl border border-[#E6E8EA] bg-white py-1 shadow-[0_4px_16px_0_rgba(0,0,0,0.08)]">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => onSelect(option === value ? null : option)}
                className={[
                  'w-full cursor-pointer px-4 py-2 text-left text-[14px] font-medium leading-[1.6] tracking-[-0.02em]',
                  option === value ? 'bg-[#F6F7F8] text-[#1F2124]' : 'text-[#5A6169]',
                ].join(' ')}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** 배열을 n개씩 행으로 자르기 */
const chunk = <T,>(arr: T[], size: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
};

/**
 * 아이템 목록 — 옷장 홈 '전체보기' 진입.
 * 검색(카테고리/태그/브랜드) + 카테고리 필터 + 정렬(최신순/브랜드/컬러) 적용, 클릭 시 상세 이동.
 */
const ClosetItemListPage = () => {
  const navigate = useNavigate();
  const items = useClosetStore((state) => state.items);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [order, setOrder] = useState<OrderKey>('최신순');
  const [brand, setBrand] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'order' | 'brand' | 'color' | null>(null);

  // 드롭다운 옵션 — 보유 아이템에서 추출 (임시)
  const brandOptions = [...new Set(items.map((item) => item.brand).filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b, 'ko'),
  );
  const colorOptions = COLOR_NAMES.filter((name) => items.some((item) => item.tags.includes(name)));

  const query = search.trim();
  const filtered = items
    .filter((item) => filter === '전체' || item.category === filter)
    .filter((item) => !brand || item.brand === brand)
    .filter((item) => !color || item.tags.includes(color))
    .filter(
      (item) =>
        !query || [item.category, item.brand ?? '', ...item.tags].some((text) => text.includes(query)),
    );

  const sorted = [...filtered].sort((a, b) =>
    order === '오래된순' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt),
  );

  const rows = chunk(sorted, 4);
  const toggleDropdown = (key: 'order' | 'brand' | 'color') =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        {/* 상단바 — back / 옷장 / 카운트 */}
        <div className="relative flex h-[53px] shrink-0 items-center justify-center border-b border-[#B2B8BD]">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-5 cursor-pointer" aria-label="뒤로가기">
            <BackIcon />
          </button>
          <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">옷장</span>
          <span className="absolute right-5 flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">
            <CountIcon />
            {items.length}개
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* 타이틀 — 전체 아이템 + 보유 개수 */}
          <div className="px-6 pt-6">
            <h1 className="text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">전체 아이템</h1>
            <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em]">
              <span className="text-[#1F2124]">{items.length}</span>
              <span className="text-[#5A6169]">개 보유</span>
            </p>
          </div>

          {/* 검색바 — 327×36, '개 보유' 아래 17 */}
          <div className="mt-[17px] px-6">
            <div className="flex h-9 items-center gap-2.5 rounded-[32px] border border-[#959BA7] bg-white py-2 pl-3 pr-3">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="검색어를 입력해주세요"
                className="w-full bg-transparent text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124] placeholder-[#B2B8BD] outline-none"
              />
            </div>
          </div>

          {/* 필터 칩 — 가로 스크롤, 카테고리 필터 적용 */}
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

          {/* 정렬/필터 드롭다운 (임시 — 옵션 구성 시안 미확정) */}
          <div className="relative z-10 mt-3 flex gap-2 px-6">
            <DropdownChip
              label="최신순"
              options={[...ORDERS]}
              value={order === '최신순' ? null : order}
              onSelect={(option) => {
                setOrder((option as OrderKey) ?? '최신순');
                setOpenDropdown(null);
              }}
              open={openDropdown === 'order'}
              onToggle={() => toggleDropdown('order')}
            />
            <DropdownChip
              label="브랜드"
              options={brandOptions}
              value={brand}
              onSelect={(option) => {
                setBrand(option);
                setOpenDropdown(null);
              }}
              open={openDropdown === 'brand'}
              onToggle={() => toggleDropdown('brand')}
            />
            <DropdownChip
              label="컬러"
              options={colorOptions}
              value={color}
              onSelect={(option) => {
                setColor(option);
                setOpenDropdown(null);
              }}
              open={openDropdown === 'color'}
              onToggle={() => toggleDropdown('color')}
            />
          </div>

          {/* 아이템 행 — 4개씩, 가로 스크롤 + 구분선. 클릭 시 상세 이동 */}
          <div className="mt-5 flex flex-col gap-5 pb-6">
            {rows.map((row, r) => (
              <div key={r}>
                <div className="flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {row.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(`/closet/${item.id}`)}
                      className="shrink-0 cursor-pointer"
                    >
                      <img src={item.imageUrl} alt={item.tags.join(' ')} className="h-[134px] w-[104px] rounded-2xl object-cover" />
                    </button>
                  ))}
                </div>
                <div className="mx-6 mt-5 border-b border-[#E6E8EA]" />
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-6 py-10 text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                {query ? '검색 결과가 없어요' : '조건에 맞는 아이템이 없어요'}
              </p>
            )}
          </div>
        </div>

        <ClosetBottomNav />
      </div>
    </PageLayout>
  );
};

export default ClosetItemListPage;
