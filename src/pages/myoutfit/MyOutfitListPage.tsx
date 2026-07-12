import { useMemo, useRef, useState } from 'react';

import PageLayout from '@/components/layout/PageeLayout';
import Badge from '@/components/ui/Badge';
import MyOutfitCard from '../../features/myoutfit/components/MyOutfitCard';
import Input from '@/components/ui/Input';

import { mockOutfits } from '@/mocks/data/outfit';

import type { Outfit } from '@/types';

type FilterItem = {
  category: string;
  value: string;
};

const normalizeText = (value?: string) => value?.toLowerCase().trim() ?? '';

const matchesSearchKeyword = (outfit: Outfit, keyword: string) => {
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) return true;

  const itemText = outfit.items.flatMap((item) => [
    item.category,
    item.brand,
    item.purchasedFrom,
    ...item.tags,
  ]);
  const searchableText = [outfit.context, outfit.memo, ...outfit.styleTags, ...itemText]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchableText.includes(normalizedKeyword);
};

const MyOutfitListPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredOutfits = useMemo(
    () =>
      mockOutfits.filter((outfit) => {
        const matchesFilter =
          selectedFilter === 'all' || outfit.styleTags.includes(`#${selectedFilter}`);
        const matchesSearch = matchesSearchKeyword(outfit, searchKeyword);

        return matchesFilter && matchesSearch;
      }),
    [selectedFilter, searchKeyword],
  );

  const filterList = useMemo<FilterItem[]>(() => {
    const uniqueStyleTags = new Set<string>();
    mockOutfits.forEach((outfit) => {
      outfit.styleTags.forEach((tag) => uniqueStyleTags.add(tag));
    });

    const filters = Array.from(uniqueStyleTags).map((tag) => ({
      category: tag.slice(1),
      value: tag.slice(1),
    }));
    filters.unshift({ category: '전체', value: 'all' });

    return filters;
  }, []);

  const displayOutfits = useMemo(() => [...filteredOutfits], [filteredOutfits]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    el.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchKeyword('');
    }

    setSearchOpen(!searchOpen);
  };

  return (
    <PageLayout
      showBottomNav={true}
      showHeader={true}
      showBack={true}
      title="내 코디"
      headerRight={
        <div onClick={handleSearchToggle} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="cursor-pointer"
          >
            <path
              d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
              className="fill-black hover:fill-"
            />
          </svg>
        </div>
      }
      className="justify-center max-h-[calc(100vh-64px)] scrollbar-hide overflow-y-hidden"
    >
      {searchOpen && (
        <div className="SearchSection my-[20px] mx-[20px] flex items-center justify-center">
          <Input
            placeholder="Search..."
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      )}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="FilterSection  ml-[20px] mt-[27px] pr-[40px] flex gap-[5px] overflow-x-auto whitespace-nowrap cursor-grab select-none"
      >
        {filterList.map((filter) => (
          <Badge
            key={filter.value}
            label={filter.category}
            selected={selectedFilter === filter.value}
            className="h-[32px] shrink-0 px-[20px]"
            onClick={() => setSelectedFilter(filter.value)}
          />
        ))}
      </div>
      <div
        className={`MyOutfitListSection  max-h-[calc(100vh-160px)] overflow-y-auto mx-[20px] mt-[27px] ${searchOpen ? 'pb-[140px]' : 'pb-[70px]'} grid grid-cols-2 gap-[16px] `}
      >
        {displayOutfits.map((outfit, index) => (
          <MyOutfitCard
            key={`${outfit.id}-${index}`}
            context={outfit.context}
            createdAt={outfit.createdAt}
            imageUrl={outfit.imageUrl}
            isSaved={outfit.isSaved}
          />
        ))}
        {displayOutfits.length === 0 && (
          <p className="col-span-2 py-[40px] text-center text-sm text-neutral-400">
            검색 결과가 없습니다.
          </p>
        )}
      </div>
      <div
        onClick={() => console.log('AddButton clicked')}
        className="AddButton bg-black w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[80px] right-[20px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="white" />
        </svg>
      </div>
    </PageLayout>
  );
};
export default MyOutfitListPage;
