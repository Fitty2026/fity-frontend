import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudioHeader, ScreenTitle, SearchField, FilterChips, SortChip, BottomCTA, PuzzleShortageOverlay } from '@/features/styling/components';
import useStudioBack from '@/features/styling/hooks/useStudioBack';
import useClosets from '@/features/closet/hooks/useClosets';
import usePuzzleBalance from '@/features/puzzle/hooks/usePuzzleBalance';
import { GENERATION_COST } from '@/features/puzzle/api/puzzleApi';
import type { OutfitJobInput } from '@/features/styling/types';
import type { ClothingCategory } from '@/types';

const CATEGORIES = ['전체', '상의', '하의', '신발', '악세사리', '기타'];
const SORTS = ['최신순', '브랜드', '컬러'];

/** 화면 칩 ↔ 옷장 카테고리. 상의는 아우터를, 악세사리는 가방을 함께 묶는다 */
const CHIP_CATEGORIES: Record<string, ClothingCategory[]> = {
  상의: ['상의', '아우터'],
  하의: ['하의'],
  신발: ['신발'],
  악세사리: ['액세서리', '가방'],
  기타: ['기타'],
};

/** 아이템 행 노출 순서 (해당 옷이 있을 때만 행 표시) */
const ROW_CHIPS = ['상의', '하의', '신발', '악세사리', '기타'];

/** 좋아요 하트 — 16×16, stroke #1F2124. 누르면 채워진다 (옷장 홈과 동일) */
const HeartIcon = ({ liked }: { liked: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 5.5C14 3.84333 12.6007 2.5 10.8747 2.5C9.58467 2.5 8.47667 3.25067 8 4.322C7.52333 3.25067 6.41533 2.5 5.12467 2.5C3.4 2.5 2 3.84333 2 5.5C2 10.3133 8 13.5 8 13.5C8 13.5 14 10.3133 14 5.5Z"
      fill={liked ? '#1F2124' : 'none'}
      stroke="#1F2124"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 기준 아이템 선택
 * - 헤더(뒤로·보유 개수) + 타이틀 + 검색 + 카테고리/정렬 칩 + 아이템 행(가로 스크롤) + 생성 CTA
 * - 옷장 목록(CLOSET-03)을 카테고리 행으로 나눠 표시, 선택한 item_id를 코디 생성 입력값으로 전달
 * ※ 정렬(최신순/브랜드/컬러)은 API에 브랜드·컬러가 없어 미동작 (스펙 확정 대기)
 */
const StylingItemSelectPage = () => {
  const navigate = useNavigate();
  const goBack = useStudioBack();
  // 앞 화면(날짜·날씨·상황)에서 넘어온 값을 그대로 실어 보낸다
  const { state } = useLocation() as { state: Partial<OutfitJobInput> | null };
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // 좋아요 — 저장 API가 없어 화면 안에서만 유지 (TODO: 옷장 API에 좋아요 붙으면 연동)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const { data } = useClosets();
  const items = useMemo(() => data?.items ?? [], [data]);
  const puzzleBalance = usePuzzleBalance();
  const [shortageOpen, setShortageOpen] = useState(false);

  /** 코디 생성으로 이동 — 잔량이 비용보다 적으면 부족 안내부터 띄운다 */
  const goLoading = (closetItemIds: number[]) => {
    // 잔량 조회 전(undefined)에는 막지 않는다 — 부족 여부는 서버 응답을 받은 뒤에만 판단
    if (puzzleBalance !== undefined && puzzleBalance < GENERATION_COST) {
      setShortageOpen(true);
      return;
    }
    navigate('/styling/loading', { state: { ...state, closetItemIds } });
  };

  /** 건너뛰기 — 기준 아이템을 고르지 않고 날짜·날씨·상황만으로 생성한다.
   *  빈 배열은 서버가 받아주지 않아 옷장 전체 id를 실어 보낸다 (서버가 그 안에서 조합) */
  const goWithoutItems = () => goLoading(items.map((item) => Number(item.id)));

  const toggleItem = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const toggleLike = (id: string) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // 검색(카테고리·태그·브랜드) → 칩 필터 → 카테고리 행으로 분할
  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const matched = keyword
      ? items.filter((item) =>
          [item.category, item.brand ?? '', ...(item.tags ?? [])]
            .join(' ')
            .toLowerCase()
            .includes(keyword),
        )
      : items;

    const built = ROW_CHIPS.filter((chip) => category === '전체' || category === chip).map((chip) => ({
      chip,
      items: matched.filter((item) => CHIP_CATEGORIES[chip].includes(item.category)),
    }));

    // 검색 중에는 결과가 없어도 행(구분선)을 유지한다. 평소엔 옷이 없는 카테고리 행을 숨김
    return keyword ? built : built.filter((row) => row.items.length > 0);
  }, [items, search, category]);

  return (
    <div className="h-screen overflow-hidden bg-neutral-100 flex justify-center" style={{ height: '100dvh' }}>
      <div className="relative w-full max-w-[430px] h-full bg-white flex flex-col overflow-hidden">
        <StudioHeader onBack={goBack} count={puzzleBalance} />

        <div className="flex-1 min-h-0 overflow-y-auto pb-32">
          {/* 건너뛰기 — 헤더 우측은 퍼즐 잔량이 차지해 헤더 아래 별도 행 (헤더↔버튼 13, 우 24) */}
          <div className="mt-[13px] pr-6 flex justify-end">
            {/* Figma: 59×26, padding 2/8, border 1 #B2B8BD, radius 32 / Pretendard 400 12px lh165% -2% #959BA7 */}
            <button
              type="button"
              onClick={goWithoutItems}
              className="flex h-[26px] w-[59px] items-center justify-center rounded-[32px] border border-[#B2B8BD] px-2 py-[2px] text-[12px] font-normal leading-[1.65] tracking-[-0.02em] text-[#959BA7]"
            >
              건너뛰기
            </button>
          </div>

          {/* 타이틀 (375×52) — 건너뛰기↔타이틀 38 */}
          <ScreenTitle
            className="mt-[38px]"
            title="매치하고 싶은 아이템을 골라주세요"
            subtitle="자동으로 어울리는 코디를 생성해요"
          />

          {/* 검색 (327×36, 서브↔검색 48, 좌우 24) */}
          <SearchField className="mt-12 mx-6" value={search} onChange={setSearch} />

          {/* 카테고리 칩 (352×30, 검색↔칩 24) */}
          <FilterChips className="mt-6 px-6" options={CATEGORIES} active={category} onChange={setCategory} />

          {/* 정렬 칩 (268×30, 카테고리↔정렬 8, 칩 간 8) */}
          <div className="mt-2 px-6 flex gap-2">
            {SORTS.map((sort) => (
              <SortChip key={sort} label={sort} />
            ))}
          </div>

          {/* 아이템 행 — 가로 스크롤 (행 440×134, 셀 104×134, gap 8, 행 간 8, border-b #B2B8BD, 좌 24) */}
          <div className="mt-7 flex flex-col gap-2">
            {rows.map((row) => (
              <div
                key={row.chip}
                // 빈 행에서도 구분선 간격이 유지되도록 카드 높이(134)를 최소 높이로 둔다
                className="flex gap-2 ml-6 min-h-[134px] overflow-x-auto border-b border-[#B2B8BD] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                {row.items.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  const liked = likedIds.has(item.id);
                  return (
                    <div key={item.id} className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="relative block w-[104px] h-[134px] overflow-hidden rounded bg-white"
                      >
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        {/* 선택 표시 — 이미지 위 검정 20% 오버레이 */}
                        {selected && <span className="absolute inset-0 bg-[#00000033]" />}
                      </button>
                      {/* 좋아요 — 카드 우상단, 위·오른쪽 8 (하트 16×16) */}
                      <button
                        type="button"
                        onClick={() => toggleLike(item.id)}
                        className="absolute right-2 top-2 cursor-pointer"
                        aria-label={liked ? '좋아요 취소' : '좋아요'}
                        aria-pressed={liked}
                      >
                        <HeartIcon liked={liked} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 생성 CTA — 그리드 위 플로팅, 선택 전 disabled. 잔량이 비용 미만이면 부족 안내 */}
        <div className="absolute inset-x-0 bottom-0">
          <BottomCTA
            label={`${GENERATION_COST} 퍼즐로 코디 생성하기`}
            disabled={selectedIds.length === 0}
            // 선택한 아이템 id를 로딩 화면으로 전달 (OUTFIT-01은 숫자 배열을 받는다)
            onClick={() => goLoading(selectedIds.map(Number))}
          />
        </div>

        {/* 퍼즐 부족 오버레이 */}
        {shortageOpen && (
          <PuzzleShortageOverlay balance={puzzleBalance ?? 0} onClose={() => setShortageOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default StylingItemSelectPage;
