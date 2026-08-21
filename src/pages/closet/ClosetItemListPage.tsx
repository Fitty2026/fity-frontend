import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import BottomNav from '@/components/layout/BottomNav';
import { ClosetSearchField, ClosetTopBar } from '@/features/closet/components';
import { matchesQuery } from '@/features/closet/searchItems';
import useClosets from '@/features/closet/hooks/useClosets';

const FILTERS = ['전체', '상의', '하의', '아우터', '신발', '가방', '액세서리'];

/** 정렬 순서 옵션 (시안 확정) */
const ORDERS = ['최신순', '오래된순', '자주 입은 순', '이름순'] as const;
type OrderKey = (typeof ORDERS)[number];

/** 컬러명 → 스와치 hex (시안 팔레트). 실제 노출은 보유 아이템에 있는 색만 (데이터 축적 시 확장) */
const COLOR_SWATCHES: Record<string, string> = {
  화이트: '#FFFFFF',
  블랙: '#1F2124',
  그레이: '#C4C8CD',
  베이지: '#E7D5C0',
  블루: '#5B7FC7',
  네이비: '#2E3563',
  핑크: '#EBB7CB',
};
const COLOR_NAMES = Object.keys(COLOR_SWATCHES);

/** 드롭다운 옵션 — 값 + 선택형 스와치 */
type DropOption = { value: string; swatch?: string };

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
  allLabel,
  options,
  value,
  onSelect,
  open,
  onToggle,
}: {
  label: string;
  /** 지정 시 목록 최상단에 "전체 X" 초기화 행 노출 (선택 시 value=null) */
  allLabel?: string;
  options: DropOption[];
  value: string | null;
  onSelect: (option: string | null) => void;
  open: boolean;
  onToggle: () => void;
}) => {
  const active = value !== null;
  // 행 — h30, 좌우 16, 하단 구분선, B6 SemiBold 14
  const rowBase = 'flex h-[30px] w-full cursor-pointer items-center whitespace-nowrap border-b border-[#E6E8EA] px-4 text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]';
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={[
          'flex h-[30px] cursor-pointer items-center gap-2.5 rounded-[32px] border px-4 py-1 text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]',
          active ? 'border-[#1F2124] bg-[#1F2124] text-[#F6F7F8]' : 'border-[#E6E8EA] bg-[#F6F7F8] text-[#1F2124]',
        ].join(' ')}
      >
        {active ? value : label}
        <ChevronDown active={active} open={open} />
      </button>

      {open && (
        <ul className="absolute left-0 top-[34px] z-10 min-w-[88px] overflow-hidden rounded-lg bg-[#F6F7F8] shadow-[0_4px_10px_0_rgba(0,0,0,0.24)]">
          {/* 헤더(전체 X / 최신순) — 보라 #9D98F0, 중앙. 선택 시 필터 해제 */}
          {allLabel && (
            <li>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className={[rowBase, 'justify-center text-[#9D98F0]'].join(' ')}
              >
                {allLabel}
              </button>
            </li>
          )}
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onSelect(option.value === value ? null : option.value)}
                className={[rowBase, 'text-[#1F2124]', option.swatch ? 'justify-start gap-2.5' : 'justify-center'].join(' ')}
              >
                {option.swatch && (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-[#E6E8EA]" style={{ background: option.swatch }} />
                )}
                {option.value}
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
  // 목록은 서버(CLOSET-03)가 소스다. 못 받으면 빈 목록
  const { data } = useClosets();
  // 빈 목록 fallback을 매 렌더 새 배열로 만들지 않도록 메모이즈 (아래 useMemo 의존성 안정화)
  const items = useMemo(() => data?.items ?? [], [data]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [order, setOrder] = useState<OrderKey>('최신순');
  const [brand, setBrand] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'order' | 'brand' | 'color' | null>(null);

  // 드롭다운 옵션 — 보유 아이템에서 추출. items 바뀔 때만 재계산
  const brandOptions = useMemo(
    () =>
      [...new Set(items.map((item) => item.brand).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b, 'ko'),
      ),
    [items],
  );
  const colorOptions = useMemo(
    () => COLOR_NAMES.filter((name) => items.some((item) => item.tags.includes(name))),
    [items],
  );

  // 필터·정렬·행 분할 — 관련 입력이 바뀔 때만 재계산 (드롭다운 열림 토글 등에는 재실행 안 함)
  const rows = useMemo(() => {
    const filtered = items
      .filter((item) => filter === '전체' || item.category === filter)
      .filter((item) => !brand || item.brand === brand)
      .filter((item) => !color || item.tags.includes(color))
      .filter((item) => matchesQuery(item, search));

    const nameOf = (i: (typeof filtered)[number]) => i.subCategory || i.tags[0] || '';
    const sorted = filtered.sort((a, b) => {
      if (order === '오래된순') return a.createdAt.localeCompare(b.createdAt);
      if (order === '이름순') return nameOf(a).localeCompare(nameOf(b), 'ko');
      // 자주 입은 순: 착용 데이터 미보유 → 최신순 fallback (TODO: wearCount 연동)
      return b.createdAt.localeCompare(a.createdAt);
    });

    return chunk(sorted, 4);
  }, [items, filter, brand, color, search, order]);

  const toggleDropdown = (key: 'order' | 'brand' | 'color') =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        <ClosetTopBar height={53} />

        <div className="flex-1 min-h-0 overflow-y-auto pb-[92px]">
          {/* 타이틀 — 전체 아이템 + 보유 개수 */}
          <div className="px-6 pt-6">
            <h1 className="text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">전체 아이템</h1>
            <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em]">
              <span className="text-[#1F2124]">{items.length}</span>
              <span className="text-[#5A6169]">개 보유</span>
            </p>
          </div>

          {/* 검색바 — '개 보유' 아래 17 */}
          <div className="mt-[17px] px-6">
            <ClosetSearchField value={search} onChange={setSearch} />
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
              allLabel="최신순"
              options={ORDERS.slice(1).map((o) => ({ value: o }))}
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
              allLabel="전체 브랜드"
              options={brandOptions.map((b) => ({ value: b }))}
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
              allLabel="전체 컬러"
              options={colorOptions.map((c) => ({ value: c, swatch: COLOR_SWATCHES[c] }))}
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
                      onClick={() => navigate(`/closet/items/${item.id}`)}
                      className="shrink-0 cursor-pointer"
                    >
                      <img src={item.imageUrl} alt={item.tags.join(' ')} loading="lazy" className="h-[134px] w-[104px] rounded-2xl object-cover" />
                    </button>
                  ))}
                </div>
                <div className="mx-6 mt-5 border-b border-[#E6E8EA]" />
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-6 py-10 text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                {search.trim() ? '검색 결과가 없어요' : '조건에 맞는 아이템이 없어요'}
              </p>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </PageLayout>
  );
};

export default ClosetItemListPage;
