import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetSearchField, ClosetTopBar, CtaButton } from '@/features/closet/components';
import { COLOR_COLUMNS, COLOR_OPTIONS, colorChipStyle } from '@/features/closet/colors';
import { SHOPPING_MALLS } from '@/features/closet/shoppingMalls';
import useClosetStore, { emptyOcrResult } from '@/store/closetStore';

/** 이미지 추가 — 56.44×56.44 원형 플러스 (Figma: inset 12.5%, 선 2.65 #F6F7F8) */
const AddPhotoIcon = () => (
  <svg width="56.44" height="56.44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="#9D98F0" />
    <path d="M12 8.25V15.75M8.25 12H15.75" stroke="#F6F7F8" strokeWidth="1.125" strokeLinecap="round" />
  </svg>
);

/** 상품명 편집 — 16×16 연필, stroke 1.2 #959BA7 */
const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <g clipPath="url(#closet-manual-pencil)">
      <path
        d="M11.2413 2.9915L12.366 1.86616C12.6005 1.63171 12.9184 1.5 13.25 1.5C13.5816 1.5 13.8995 1.63171 14.134 1.86616C14.3685 2.10062 14.5002 2.4186 14.5002 2.75016C14.5002 3.08173 14.3685 3.39971 14.134 3.63416L4.55467 13.2135C4.20222 13.5657 3.76758 13.8246 3.29 13.9668L1.5 14.5002L2.03333 12.7102C2.17552 12.2326 2.43442 11.7979 2.78667 11.4455L11.242 2.9915H11.2413ZM11.2413 2.9915L13 4.75016"
        stroke="#959BA7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="closet-manual-pencil">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/** 행 우측 화살표 — 16×16, stroke 1.2 #959BA7 */
const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M5.5 3L10.5 8L5.5 13" stroke="#959BA7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 태그 추가 + — 24×24, 원 1 / 십자 1.5 #959BA7 (아직 아무것도 없는 상태라 흐린 색) */
const AddTagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="11.5" stroke="#959BA7" />
    <path d="M12 7V17M7 12H17" stroke="#959BA7" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** 카테고리 — API enum(TOP/BOTTOM/OUTER/SHOES/BAG/ACCESSORY/ETC)의 한글 라벨과 1:1 */
const CATEGORY_OPTIONS = ['상의', '하의', '아우터', '신발', '가방', '액세서리', '기타'];

/** 세부 카테고리 — 시안에 '상의'만 있어 나머지는 목록 대기. 서버 미제공 필드 */
const SUB_CATEGORY_OPTIONS: Record<string, string[]> = {
  상의: ['반팔 셔츠', '나시', '조끼', '블라우스'],
};

/** 브랜드 — OCR이 지원하는 쇼핑몰 3곳 */
const BRAND_OPTIONS = SHOPPING_MALLS.map((mall) => mall.label);

/** 한 상품에 고를 수 있는 색상 수 */
const MAX_COLORS = 2;

/** 태그 추가 시트의 추천 태그 — 추천 API가 없어 시안 값 고정 */
const RECOMMENDED_TAGS = ['#데일리', '#출근', '#캐주얼', '#미니멀'];

/** 라벨 + 값 + 화살표 한 줄 — 327×26, 라벨 좌측 8 들여쓰기. 라벨·값 모두 흐린 색(시안) */
const SelectRow = ({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (option: string) => void;
}) => (
  <div className="relative flex h-[26px] items-center justify-between pl-2">
    {/* Body/B2 */}
    <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">{label}</span>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex cursor-pointer items-center gap-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]"
    >
      {value}
      <ChevronIcon />
    </button>

    {open && options.length > 0 && (
      <ul
        className="absolute right-0 top-[26px] z-20 w-[88px] overflow-hidden rounded bg-[#F6F7F8]"
        style={{ boxShadow: '0 4px 10px 0 rgba(0,0,0,0.24)' }}
      >
        {options.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => onSelect(option)}
              className={`flex h-[30px] w-full cursor-pointer items-center justify-center whitespace-nowrap border-b border-[#E6E8EA] px-2 py-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] ${
                option === value ? 'text-[#9D98F0]' : 'text-[#1F2124]'
              }`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/**
 * 직접 입력 — 인식이 안 된 옷을 손으로 채운다.
 * ?receipt=N이면 그 장(인식 실패분)을 덮어쓰고, 없으면 새 장으로 추가된다.
 * 화면 뼈대는 상품 수정(product-images/edit)과 같고, 값이 비어 있는 상태로 시작한다.
 * ※ 카테고리·세부 카테고리·메모는 서버에 없는 필드라 화면 안에서만 유지한다(저장 API 대기).
 */
const ClosetManualInputPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const results = useClosetStore((state) => state.ocrResults);
  const updateOcrResult = useClosetStore((state) => state.updateOcrResult);
  const addOcrResult = useClosetStore((state) => state.addOcrResult);
  const fileRef = useRef<HTMLInputElement>(null);

  // 화면의 '영수증 N'은 1부터 — 배열 index로 쓰려면 1을 뺀다
  const receipt = params.get('receipt');
  const targetIndex = receipt ? Number(receipt) - 1 : -1;
  const replacing = targetIndex >= 0 && targetIndex < results.length;

  const [photo, setPhoto] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [nameEditing, setNameEditing] = useState(false);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [colors, setColors] = useState<{ label: string; hex: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 태그 추가 바텀시트 — 검색/직접 입력 + 추천 태그 선택
  const [tagSheetOpen, setTagSheetOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [pickedTags, setPickedTags] = useState<string[]>([]);

  /** 시트에서 고른 태그 + 직접 입력한 값을 한 번에 반영 */
  const handleConfirmTags = () => {
    const typed = tagSearch.trim();
    const added = [...pickedTags, ...(typed ? [typed] : [])]
      .map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag))
      .filter((tag) => tag && !tags.includes(tag));
    if (added.length) setTags([...tags, ...new Set(added)]);
    setTagSheetOpen(false);
    setTagSearch('');
    setPickedTags([]);
  };

  const togglePickedTag = (tag: string) =>
    setPickedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  // 이미지·상품 이름·카테고리는 등록 전 반드시 채워야 한다
  const canConfirm = Boolean(photo) && name.trim().length > 0 && category.length > 0;

  /** 확인 — 실패분 자리를 덮어쓰거나 새 장으로 추가하고 이미지 등록 목록으로 */
  const handleConfirm = () => {
    const next = {
      ...emptyOcrResult,
      name: name.trim(),
      brand,
      photo,
      tags,
      colors,
      color: colors[0] ?? { label: '', hex: '' },
      category,
      subCategory,
    };
    if (replacing) updateOcrResult(targetIndex, next);
    else addOcrResult(next);
    navigate('/closet/register/product-images');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <ClosetTopBar />

        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pb-10">
          {/* 옷 이미지 256×256 — 상단 바 아래 24 (Figma top 127) */}
          <div className="mt-6 flex justify-center">
            {photo ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-[256px] w-[256px] cursor-pointer overflow-hidden rounded-[14.11px]"
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                // dash 5.29 = 1.76 × 3 이라 브라우저 기본 dashed 패턴과 같다
                className="flex h-[256px] w-[256px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14.11px] border-[1.76px] border-dashed border-[#9D98F0]"
              >
                <AddPhotoIcon />
                <span className="text-[24.69px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
                  옷 이미지 추가
                </span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setPhoto(URL.createObjectURL(file));
            }}
          />

          {/* 정보 블록 — 사진 아래 40, 안쪽 간격 16 (Figma top 423) */}
          <div className="mt-10 flex flex-col gap-4">
            {/* 상품명 36 — border 1 #E6E8EA r8, padding 4/12/4/8 */}
            <div className="flex h-9 items-center justify-between rounded-lg border border-[#E6E8EA] py-1 pl-2 pr-3">
              {nameEditing ? (
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onBlur={() => setNameEditing(false)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === 'Escape') setNameEditing(false);
                  }}
                  placeholder="제품명을 입력해주세요"
                  aria-label="제품명"
                  className="min-w-0 flex-1 text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124] outline-none placeholder:text-[#B2B8BD]"
                />
              ) : (
                // Body/B3 — 비어 있으면 안내 문구
                <span
                  className={`min-w-0 flex-1 truncate text-[16px] font-medium leading-[1.6] tracking-[-0.02em] ${
                    name ? 'text-[#1F2124]' : 'text-[#B2B8BD]'
                  }`}
                >
                  {name || '제품명을 입력해주세요'}
                </span>
              )}
              <button
                type="button"
                aria-label="제품명 입력"
                onClick={() => setNameEditing(true)}
                className="shrink-0 cursor-pointer"
              >
                <PencilIcon />
              </button>
            </div>

            {/* 선택 행 5줄 — 각 26, 간격 16 */}
            <div className="flex flex-col gap-4">
              <SelectRow
                label="카테고리"
                value={category || '-'}
                options={CATEGORY_OPTIONS}
                open={openRow === 'category'}
                onToggle={() => setOpenRow((prev) => (prev === 'category' ? null : 'category'))}
                onSelect={(option) => {
                  setCategory(option);
                  // 카테고리가 바뀌면 세부 카테고리는 새로 골라야 한다
                  if (option !== category) setSubCategory('');
                  setOpenRow(null);
                }}
              />
              <SelectRow
                label="세부 카테고리"
                value={subCategory || '-'}
                options={SUB_CATEGORY_OPTIONS[category] ?? []}
                open={openRow === 'subCategory'}
                onToggle={() => setOpenRow((prev) => (prev === 'subCategory' ? null : 'subCategory'))}
                onSelect={(option) => {
                  setSubCategory(option);
                  setOpenRow(null);
                }}
              />

              {/* 색상 — 안 고른 상태는 흰 원에 점선 테두리 (시안) */}
              <div className="relative flex h-[26px] items-center justify-between pl-2">
                <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                  색상
                </span>
                <button
                  type="button"
                  onClick={() => setOpenRow((prev) => (prev === 'color' ? null : 'color'))}
                  aria-expanded={openRow === 'color'}
                  aria-label="색상 선택"
                  className="flex cursor-pointer items-center gap-2"
                >
                  {colors.length ? (
                    colors.map((option) => (
                      <span
                        key={option.label}
                        className="h-6 w-6 rounded-full border-[0.8px] border-[#E6E8EA]"
                        style={colorChipStyle(option)}
                      />
                    ))
                  ) : (
                    <span className="h-6 w-6 rounded-full border-[0.8px] border-dashed border-[#959BA7] bg-white" />
                  )}
                </button>

                {openRow === 'color' && (
                  <>
                    <button
                      type="button"
                      aria-label="닫기"
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setOpenRow(null)}
                    />
                    {/* 드롭다운 228×120 — 76×30 칸을 3열로, radius 8, 그림자 (Figma) */}
                    <div
                      className="absolute right-0 top-[calc(100%+4px)] z-20 grid w-[228px] grid-cols-3 overflow-hidden rounded-lg"
                      style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.24))' }}
                    >
                      {COLOR_OPTIONS.map((option, index) => {
                        const picked = colors.some((c) => c.label === option.label);
                        return (
                          <button
                            key={option.code}
                            type="button"
                            // 이미 고른 색을 다시 누르면 빼고, 아니면 2개까지 더한다
                            disabled={!picked && colors.length >= MAX_COLORS}
                            onClick={() =>
                              setColors((prev) =>
                                picked
                                  ? prev.filter((c) => c.label !== option.label)
                                  : [...prev, { label: option.label, hex: option.hex }],
                              )
                            }
                            className={[
                              'flex h-[30px] items-center justify-center gap-1 border-b border-[#E6E8EA] bg-[#F6F7F8] text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]',
                              index % COLOR_COLUMNS === 1 ? 'border-x' : '',
                              picked ? 'text-[#9D98F0]' : 'text-[#1F2124]',
                              !picked && colors.length >= MAX_COLORS
                                ? 'cursor-not-allowed opacity-40'
                                : 'cursor-pointer',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span
                              className="h-4 w-4 shrink-0 rounded-full border-[0.8px] border-[#E6E8EA]"
                              style={colorChipStyle(option)}
                            />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <SelectRow
                label="브랜드"
                value={brand || '-'}
                options={BRAND_OPTIONS}
                open={openRow === 'brand'}
                onToggle={() => setOpenRow((prev) => (prev === 'brand' ? null : 'brand'))}
                onSelect={(option) => {
                  setBrand(option);
                  setOpenRow(null);
                }}
              />

              {/* 태그 — 한 번 누르면 선택(회색 + X), X를 누르면 삭제 */}
              <div className="flex h-[26px] items-center justify-between pl-2">
                <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                  태그
                </span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {tags.map((tag) => {
                      const selected = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(selected ? null : tag)}
                          className={`flex h-[26px] cursor-pointer items-center gap-2 rounded-[32px] border border-[#34363C] px-2 py-0.5 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] transition-colors ${
                            selected ? 'bg-[#B2B8BD]' : 'bg-transparent'
                          }`}
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                          {selected && (
                            <span
                              role="button"
                              aria-label={`${tag} 태그 삭제`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setTags(tags.filter((t) => t !== tag));
                                setSelectedTag(null);
                              }}
                              className="flex shrink-0 items-center"
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                                <path d="M1 1L7 7M7 1L1 7" stroke="#34363C" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    aria-label="태그 추가"
                    onClick={() => setTagSheetOpen(true)}
                    className="shrink-0 cursor-pointer"
                  >
                    <AddTagIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* 메모 48 — 입력 233×48, bg #F6F7F8 r4, padding 8/10/10 */}
            <div className="flex h-12 items-start justify-between pl-2">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                메모
              </span>
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="메모를 입력해주세요 (선택)"
                aria-label="메모"
                className="h-12 w-[233px] resize-none rounded-[4px] bg-[#F6F7F8] px-2.5 pt-2 pb-2.5 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124] outline-none placeholder:text-[#B2B8BD]"
              />
            </div>
          </div>
        </div>

        {/* 하단 CTA 327×58 — 사진·제품명이 채워져야 활성 */}
        <div className="w-full px-6 pt-8 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8] disabled:cursor-not-allowed disabled:bg-[#E6E8EA] disabled:text-[#959BA7]"
          >
            확인
          </button>
        </div>

        {/* 태그 추가 바텀시트 — radius 상단 56, padding 32/24/40, bg #F6F7F8 */}
        {tagSheetOpen && (
          <div className="fixed inset-0 z-40 flex justify-center" onClick={() => setTagSheetOpen(false)}>
            <div className="relative w-full max-w-[430px]">
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-[56px] bg-[#F6F7F8] px-6 pt-8 pb-10"
                style={{ boxShadow: '0 -1px 16px 0 rgba(0,0,0,0.16)' }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex flex-col gap-8">
                  {/* Title/T3 */}
                  <p className="text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
                    태그 추가
                  </p>

                  <div className="flex flex-col gap-6">
                    <ClosetSearchField
                      value={tagSearch}
                      onChange={setTagSearch}
                      placeholder="태그 검색 또는 직접 입력"
                    />

                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-3">
                        {/* Body/B2 */}
                        <p className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                          추천 태그
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {RECOMMENDED_TAGS.map((tag) => {
                            const picked = pickedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => togglePickedTag(tag)}
                                className={`flex h-[30px] cursor-pointer items-center rounded-[32px] border border-[#34363C] px-3 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] transition-colors ${
                                  picked ? 'bg-[#B2B8BD]' : 'bg-transparent'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <CtaButton label="완료" variant="dark" onClick={handleConfirmTags} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ClosetManualInputPage;
