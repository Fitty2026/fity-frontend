import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import PageLayout from '@/features/myoutfit/components/MyOutfitPageLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { ClosetSearchField } from '@/features/closet/components';
import useClosets from '@/features/closet/hooks/useClosets';
import { matchesQuery } from '@/features/closet/searchItems';
import { regenerateMyOutfitWithReplacement } from '@/features/myoutfit/api/myOutfitApi';
import { useMyOutfit } from '@/features/myoutfit/hooks/useMyOutfits';
import type { Outfit } from '@/types';

import '@/features/myoutfit/styles/addItemDropdown.css';

const CATEGORIES = [
  { label: '전체', value: '전체' },
  { label: '상의', value: '상의' },
  { label: '하의', value: '하의' },
  { label: '신발', value: '신발' },
  { label: '액세서리', value: '액세서리' },
  { label: '기타', value: '기타' },
] as const;

const COLOR_GROUP_SWATCHES: Record<string, string> = {
  화이트: '#FFFFFF',
  블랙: '#000000',
  그레이: '#CED1D5',
  베이지: '#E3DACD',
  브라운: '#7B4A32',
  레드: '#D83A3A',
  오렌지: '#F28C28',
  옐로: '#F2D64B',
  그린: '#3E9B62',
  블루: '#0876DD',
  네이비: '#052D78',
  퍼플: '#8358B8',
  핑크: '#F4CAE4',
};

const getColorGroup = (hexColor: string) => {
  const normalized = hexColor.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return '기타';

  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (lightness >= 0.92) return '화이트';
  if (lightness <= 0.12) return '블랙';
  if (saturation <= 0.12) return '그레이';

  let hue = 0;
  if (delta !== 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;

  if (lightness >= 0.78 && (hue < 55 || hue >= 330)) return '핑크';
  if (hue < 15 || hue >= 345) return '레드';
  if (hue < 45) return lightness < 0.42 ? '브라운' : '오렌지';
  if (hue < 70) return lightness >= 0.72 ? '베이지' : '옐로';
  if (hue < 165) return '그린';
  if (hue < 255) return lightness < 0.32 ? '네이비' : '블루';
  if (hue < 290) return '퍼플';
  return '핑크';
};

const chunk = <T,>(items: T[], size: number) => {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size)
    rows.push(items.slice(index, index + size));
  return rows;
};

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={open ? 'rotate-180' : ''}
    aria-hidden="true"
  >
    <path d="M13 5.5L8 10.5L3 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FilterDropdown = ({
  label,
  options,
  value,
  open,
  onToggle,
  onSelect,
  defaultOption,
  optionSwatches,
}: {
  label: string;
  options: string[];
  value: string | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string | null) => void;
  defaultOption?: string;
  optionSwatches?: Record<string, string>;
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className={`${value ? 'border-[#1F2124] bg-[#1F2124] text-white' : 'border-[#E6E8EA] bg-[#F6F7F8] text-[#1F2124]'} flex h-[30px] items-center gap-[8px] rounded-[32px] border px-[14px] text-[14px] font-[500] tracking-[-2%]`}
    >
      {value ?? label}
      <ChevronDown open={open} />
    </button>
    {open && (
      <div
        className={`${optionSwatches ? 'w-[76px]' : 'w-[88px]'} add-item-dropdown-enter absolute left-0 top-[36px] z-30 max-h-[240px] overflow-y-auto rounded-[8px] bg-[#F6F7F8] shadow-[0_4px_10px_rgba(0,0,0,0.24)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option === (value ?? defaultOption) ? null : option)}
            className={`${option === (value ?? defaultOption ?? label) ? 'text-[#9D98F0]' : 'text-[#1F2124]'} flex h-[30px] w-full items-center whitespace-nowrap border-b border-[#E6E8EA] text-[14px] font-[600] leading-[160%] tracking-[-2%] last:border-b-0 ${optionSwatches?.[option] ? 'justify-start gap-[4px] px-[6px]' : 'justify-center px-[4px] text-center'}`}
          >
            {optionSwatches?.[option] && (
              <span
                className="h-[16px] w-[16px] shrink-0 rounded-full border border-[#E6E8EA]"
                style={{ backgroundColor: optionSwatches[option] }}
              />
            )}
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
);

const MyOutfitAddItemPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { outfitId } = useParams();
  const outfitQuery = useMyOutfit(outfitId);
  const closetQuery = useClosets();
  const draftOutfit = (location.state as { draftOutfit?: Outfit } | null)?.draftOutfit;
  const outfit = draftOutfit?.id === outfitId ? draftOutfit : outfitQuery.data;
  const items = useMemo(() => closetQuery.data?.items ?? [], [closetQuery.data?.items]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [order, setOrder] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'order' | 'brand' | 'color' | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const regenerateMutation = useMutation({
    mutationFn: (newItemId: string) => {
      const newItem = items.find((item) => item.id === newItemId);
      if (!outfit || !newItem) throw new Error('선택한 아이템을 찾을 수 없어요.');
      return regenerateMyOutfitWithReplacement({ original: outfit, newItem });
    },
    onSuccess: (regeneratedOutfit) => {
      navigate(`/myoutfit/edit/${regeneratedOutfit.id}`, {
        replace: true,
        state: { draftOutfit: regeneratedOutfit },
      });
    },
  });

  const brandOptions = useMemo(
    () =>
      [...new Set(items.map((item) => item.brand).filter(Boolean) as string[])].sort(
        (first, second) => first.localeCompare(second, 'ko'),
      ),
    [items],
  );
  const colorOptions = useMemo(
    () => [
      '전체 컬러',
      ...Object.keys(COLOR_GROUP_SWATCHES).filter((group) =>
        items.some((item) => item.colors?.some((hexColor) => getColorGroup(hexColor) === group)),
      ),
    ],
    [items],
  );

  const rows = useMemo(() => {
    const filteredItems = items
      .filter((item) => category === '전체' || item.category === category)
      .filter((item) => !brand || item.brand === brand)
      .filter(
        (item) => !color || item.colors?.some((hexColor) => getColorGroup(hexColor) === color),
      )
      .filter((item) => matchesQuery(item, search));

    const sortedItems = [...filteredItems].sort((first, second) => {
      if (order === '오래된순') return first.createdAt.localeCompare(second.createdAt);
      if (order === '이름순') {
        return (first.subCategory ?? first.category).localeCompare(
          second.subCategory ?? second.category,
          'ko',
        );
      }
      if (order === '자주 입은 순') return 0;
      return second.createdAt.localeCompare(first.createdAt);
    });

    return chunk(sortedItems, 3);
  }, [brand, category, color, items, order, search]);

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((selectedIds) => (selectedIds.includes(itemId) ? [] : [itemId]));
  };

  const toggleDropdown = (dropdown: 'order' | 'brand' | 'color') => {
    setOpenDropdown((current) => (current === dropdown ? null : dropdown));
  };

  if (outfitQuery.isPending || closetQuery.isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="아이템 추가">
        <LoadingScreen message="코디와 옷장 아이템을 불러오는 중이에요." />
      </PageLayout>
    );
  }

  const queryError = outfitQuery.error ?? closetQuery.error;
  if (queryError || !outfit) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="아이템 추가">
        <ErrorScreen
          title="아이템을 불러오지 못했어요."
          description={queryError?.message ?? '코디 정보를 찾을 수 없어요.'}
          onRetry={() => {
            void outfitQuery.refetch();
            void closetQuery.refetch();
          }}
        />
      </PageLayout>
    );
  }

  const addSelectedItems = () => {
    const selectedItemId = selectedItemIds[0];
    if (!selectedItemId || regenerateMutation.isPending) return;
    regenerateMutation.mutate(selectedItemId);
  };

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="아이템 추가"
      className="flex min-h-0 flex-col select-none"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-[124px] shrink-0 items-center gap-[16px] overflow-x-auto px-[24px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <img
            src={outfit.imageUrl}
            alt="현재 코디"
            className="h-[99px] w-[99px] shrink-0 rounded-[8px] object-cover"
          />
          {outfit.items.map((item) => (
            <img
              key={item.id}
              src={item.imageUrl}
              alt={item.category}
              className="h-[70px] w-[70px] shrink-0 object-contain"
            />
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-[104px]">
          <div className="mt-[24px] px-[24px]">
            <ClosetSearchField value={search} onChange={setSearch} />
          </div>

          <div className="mt-[12px] flex gap-[8px] overflow-x-auto px-[24px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setCategory(filter.value)}
                className={`${category === filter.value ? 'border-[#1F2124] bg-[#1F2124] text-white' : 'border-[#E6E8EA] bg-[#F6F7F8] text-[#1F2124]'} h-[30px] shrink-0 rounded-[32px] border px-[12px] text-[14px] font-[500] tracking-[-2%] transition-colors duration-200 ease-out motion-reduce:transition-none`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative z-20 mt-[12px] flex gap-[8px] px-[24px]">
            <FilterDropdown
              label="최신순"
              options={['최신순', '오래된순', '자주 입은 순', '이름순']}
              value={order}
              open={openDropdown === 'order'}
              onToggle={() => toggleDropdown('order')}
              onSelect={(value) => {
                setOrder(value);
                setOpenDropdown(null);
              }}
            />
            <FilterDropdown
              label="브랜드"
              options={brandOptions}
              value={brand}
              open={openDropdown === 'brand'}
              onToggle={() => toggleDropdown('brand')}
              onSelect={(value) => {
                setBrand(value);
                setOpenDropdown(null);
              }}
            />
            <FilterDropdown
              label="컬러"
              options={colorOptions}
              value={color}
              defaultOption="전체 컬러"
              optionSwatches={COLOR_GROUP_SWATCHES}
              open={openDropdown === 'color'}
              onToggle={() => toggleDropdown('color')}
              onSelect={(value) => {
                setColor(value === '전체 컬러' ? null : value);
                setOpenDropdown(null);
              }}
            />
          </div>

          <div className="mt-[24px] px-[24px]">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="border-b border-[#B2B8BD] py-[18px] first:pt-0">
                <div className="grid grid-cols-3 gap-x-[12px]">
                  {row.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleItem(item.id)}
                        className={`${isSelected ? 'ring-2 ring-[#1F2124]' : ''} relative flex h-[110px] items-center justify-center overflow-hidden rounded-[8px] bg-white`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.tags.join(' ')}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                        {isSelected && (
                          <span className="absolute right-[6px] top-[6px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#1F2124] text-[12px] text-white">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="py-[48px] text-center text-[14px] text-[#959BA7]">
                조건에 맞는 아이템이 없어요
              </p>
            )}
          </div>
        </div>

        <div className="fixed bottom-[40px] left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 px-[24px]">
          {regenerateMutation.isError && (
            <p className="mb-[8px] text-center text-[13px] text-red-500">
              {regenerateMutation.error.message}
            </p>
          )}
          <button
            type="button"
            disabled={selectedItemIds.length === 0 || regenerateMutation.isPending}
            onClick={addSelectedItems}
            className="w-full rounded-[32px] bg-[#1F2124] py-[16px] text-[16px] font-[600] text-white disabled:bg-[#E6E8EA] disabled:text-[#959BA7]"
          >
            {regenerateMutation.isPending ? '재생성 중...' : '확인'}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyOutfitAddItemPage;
