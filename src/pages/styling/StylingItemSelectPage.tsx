import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudioHeader, ScreenTitle, SearchField, FilterChips, SortChip, BottomCTA } from '@/features/styling/components';
import topImg from '@/assets/images/items/top.jpg';
import top2Img from '@/assets/images/items/top2.jpg';
import outerImg from '@/assets/images/items/outer.jpg';
import pantsImg from '@/assets/images/items/pants.jpg';
import shoesImg from '@/assets/images/items/shoes.jpg';

const CATEGORIES = ['전체', '상의', '하의', '신발', '악세사리', '기타'];
const SORTS = ['최신순', '브랜드', '컬러'];

/** 아이템 목업 — ※ 임시(기존 items 이미지 재사용), 실제 에셋 오면 교체 */
const ITEM_ROWS: { id: number; image: string }[][] = [
  [
    { id: 1, image: topImg },
    { id: 2, image: outerImg },
    { id: 3, image: top2Img },
    { id: 4, image: topImg },
  ],
  [
    { id: 5, image: pantsImg },
    { id: 6, image: pantsImg },
    { id: 7, image: pantsImg },
    { id: 8, image: pantsImg },
  ],
  [
    { id: 9, image: shoesImg },
    { id: 10, image: shoesImg },
    { id: 11, image: shoesImg },
    { id: 12, image: shoesImg },
  ],
];

/**
 * 기준 아이템 선택
 * - 헤더(뒤로·88개) + 타이틀 + 검색 + 카테고리/정렬 칩 + 아이템 행(가로 스크롤) + 생성 CTA
 * ※ 세부 px/타이포/선택 동작은 Figma 스펙으로 확정 예정 (스캐폴드)
 */
const StylingItemSelectPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleItem = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] h-screen bg-white flex flex-col overflow-hidden">
        <StudioHeader onBack={() => navigate(-1)} count={88} />

        <div className="flex-1 overflow-y-auto pb-32">
          {/* 타이틀 (375×52) */}
          {/* 헤더↔타이틀 56 */}
          <ScreenTitle
            className="mt-14"
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
            {ITEM_ROWS.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="flex gap-2 ml-6 overflow-x-auto border-b border-[#B2B8BD] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                {row.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="relative shrink-0 w-[104px] h-[134px] overflow-hidden rounded bg-white"
                    >
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                      {/* 선택 표시 — 이미지 위 검정 20% 오버레이 */}
                      {selected && <span className="absolute inset-0 bg-[#00000033]" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 생성 CTA — 그리드 위 플로팅, 선택 전 disabled */}
        <div className="absolute inset-x-0 bottom-0">
          <BottomCTA
            label="88 퍼즐로 코디 생성하기"
            disabled={selectedIds.length === 0}
            onClick={() => navigate('/styling/loading')}
          />
        </div>
      </div>
    </div>
  );
};

export default StylingItemSelectPage;
