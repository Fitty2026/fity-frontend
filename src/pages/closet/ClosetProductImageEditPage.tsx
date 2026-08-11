import { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import {
  ClosetSearchField,
  ClosetTopBar,
  CtaButton,
  PhotoSourceSheet,
} from '@/features/closet/components';
import { COLOR_COLUMNS, COLOR_OPTIONS, colorChipStyle } from '@/features/closet/colors';
import { SHOPPING_MALLS } from '@/features/closet/shoppingMalls';
import useClosetStore, { receiptProducts } from '@/store/closetStore';

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
    <g clipPath="url(#closet-product-edit-pencil)">
      <path
        d="M11.2413 2.9915L12.366 1.86616C12.6005 1.63171 12.9184 1.5 13.25 1.5C13.5816 1.5 13.8995 1.63171 14.134 1.86616C14.3685 2.10062 14.5002 2.4186 14.5002 2.75016C14.5002 3.08173 14.3685 3.39971 14.134 3.63416L4.55467 13.2135C4.20222 13.5657 3.76758 13.8246 3.29 13.9668L1.5 14.5002L2.03333 12.7102C2.17552 12.2326 2.43442 11.7979 2.78667 11.4455L11.242 2.9915H11.2413ZM11.2413 2.9915L13 4.75016"
        stroke="#959BA7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="closet-product-edit-pencil">
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

/** 사진 시트 카메라 — 32×32, stroke 2.2 #34363C */
const SheetCameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M9.10267 8.23361C8.86265 8.61349 8.54243 8.93625 8.16445 9.17925C7.78647 9.42225 7.3599 9.57961 6.91467 9.64027C6.408 9.71227 5.90533 9.78961 5.40267 9.87361C3.99867 10.1069 3 11.3429 3 12.7656V24.0003C3 24.7959 3.31607 25.559 3.87868 26.1216C4.44129 26.6842 5.20435 27.0003 6 27.0003H26C26.7957 27.0003 27.5587 26.6842 28.1213 26.1216C28.6839 25.559 29 24.7959 29 24.0003V12.7656C29 11.3429 28 10.1069 26.5973 9.87361C26.0943 9.78979 25.5902 9.71201 25.0853 9.64027C24.6403 9.57942 24.214 9.42198 23.8363 9.17899C23.4586 8.936 23.1385 8.61333 22.8987 8.23361L21.8027 6.47894C21.5565 6.07907 21.2176 5.7444 20.8147 5.50325C20.4118 5.26211 19.9567 5.1216 19.488 5.09361C17.1643 4.9688 14.8357 4.9688 12.512 5.09361C12.0433 5.1216 11.5882 5.26211 11.1853 5.50325C10.7824 5.7444 10.4435 6.07907 10.1973 6.47894L9.10267 8.23361Z"
      stroke="#34363C"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 17C22 18.5913 21.3679 20.1174 20.2426 21.2426C19.1174 22.3679 17.5913 23 16 23C14.4087 23 12.8826 22.3679 11.7574 21.2426C10.6321 20.1174 10 18.5913 10 17C10 15.4087 10.6321 13.8826 11.7574 12.7574C12.8826 11.6321 14.4087 11 16 11C17.5913 11 19.1174 11.6321 20.2426 12.7574C21.3679 13.8826 22 15.4087 22 17ZM25 14H25.0107V14.0107H25V14Z"
      stroke="#34363C"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 사진 시트 앨범 — 32×32, stroke 2 #1F2124 */
const SheetAlbumIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M3 21L9.87867 14.1213C10.1572 13.8428 10.488 13.6218 10.8519 13.471C11.2159 13.3202 11.606 13.2426 12 13.2426C12.394 13.2426 12.7841 13.3202 13.1481 13.471C13.512 13.6218 13.8428 13.8428 14.1213 14.1213L21 21M19 19L20.8787 17.1213C21.1572 16.8428 21.488 16.6218 21.8519 16.471C22.2159 16.3202 22.606 16.2426 23 16.2426C23.394 16.2426 23.7841 16.3202 24.1481 16.471C24.512 16.6218 24.8428 16.8428 25.1213 17.1213L29 21M5 26H27C27.5304 26 28.0391 25.7893 28.4142 25.4142C28.7893 25.0391 29 24.5304 29 24V8C29 7.46957 28.7893 6.96086 28.4142 6.58579C28.0391 6.21071 27.5304 6 27 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V24C3 24.5304 3.21071 25.0391 3.58579 25.4142C3.96086 25.7893 4.46957 26 5 26ZM19 11H19.0107V11.0107H19V11ZM19.5 11C19.5 11.1326 19.4473 11.2598 19.3536 11.3536C19.2598 11.4473 19.1326 11.5 19 11.5C18.8674 11.5 18.7402 11.4473 18.6464 11.3536C18.5527 11.2598 18.5 11.1326 18.5 11C18.5 10.8674 18.5527 10.7402 18.6464 10.6464C18.7402 10.5527 18.8674 10.5 19 10.5C19.1326 10.5 19.2598 10.5527 19.3536 10.6464C19.4473 10.7402 19.5 10.8674 19.5 11Z"
      stroke="#1F2124"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 태그 삭제 X — 8×8, stroke 1 #34363C */
const TagDeleteIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M1 1L7 7M7 1L1 7" stroke="#34363C" strokeLinecap="round" />
  </svg>
);

/** 태그 추가 + — 24×24, 원 1 / 십자 1.5 #34363C */
const AddTagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="11.5" stroke="#34363C" />
    <path d="M12 7V17M7 12H17" stroke="#34363C" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 카테고리 — API enum(TOP/BOTTOM/OUTER/SHOES/BAG/ACCESSORY/ETC)의 한글 라벨과 1:1.
 * closetApi의 CATEGORY_LABEL과 어긋나면 저장 시 분류가 뒤집히므로 임의로 줄이지 않는다.
 * (옷장 홈에서 상의·아우터를 한 행에 묶는 건 그 화면의 표시 규칙이라 여기와 무관)
 */
const CATEGORY_OPTIONS = ['상의', '하의', '아우터', '신발', '가방', '액세서리', '기타'];

/** 세부 카테고리 — 시안에 '상의'만 있어 나머지는 목록 대기. 서버 미제공 필드 */
const SUB_CATEGORY_OPTIONS: Record<string, string[]> = {
  상의: ['반팔 셔츠', '나시', '조끼', '블라우스'],
};

/** 브랜드 — OCR이 지원하는 쇼핑몰 3곳. shoppingMalls가 소스라 순서·표기가 다른 화면과 같다 */
const BRAND_OPTIONS = SHOPPING_MALLS.map((mall) => mall.label);

/** 한 상품에 고를 수 있는 색상 수 */
const MAX_COLORS = 2;

/** 태그 추가 시트의 추천 태그 — 추천 API가 없어 시안 값 고정 (옷장 상세와 같은 값) */
const RECOMMENDED_TAGS = ['#데일리', '#출근', '#캐주얼', '#미니멀'];

/** 라벨 + 값 + 화살표 한 줄 — 335×26, 라벨 좌측 8 들여쓰기 */
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
    <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{label}</span>
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
 * 상품 이미지·정보 수정 — 이미지 등록 목록(/closet/register/product-images)의 수정에서 들어온다.
 * 대상은 ?product=N (평탄화한 상품 순번, 1부터). 영수증 단위가 없어져도 주소는 그대로 쓴다.
 * ※ 카테고리·세부 카테고리·메모는 OCR 결과에 없어 화면 안에서만 유지한다(저장 API 대기).
 */
const ClosetProductImageEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  /**
   * 촬영 화면에서 돌아온 경우 — 찍은 사진과, 떠나기 전 편집 중이던 값이 실려 온다.
   * draft가 없으면(정상 진입) 인식 결과에서 시작한다.
   */
  const returned = location.state as
    | { photo?: string; draft?: Record<string, unknown> }
    | null;
  const results = useClosetStore((state) => state.ocrResults);
  const updateOcrResult = useClosetStore((state) => state.updateOcrResult);
  /**
   * 다른 유저가 등록한 사진 — 개수가 정해져 있지 않다.
   * 내가 처음 등록하는 옷이면 0개라 안내 문구까지 통째로 안 보여야 하고, 1개면 하나만 뜬다.
   * ※ 지금은 목업(옷장 아이템 앞 3개). 별도 API가 붙으면 이 줄만 교체한다.
   */
  const suggestions = useClosetStore((state) => state.items)
    .slice(0, 3)
    .map((item) => item.imageUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  // 인식 성공분만 상품 단위로 펼친다 — 목록 화면과 순서가 같아야 순번이 맞는다
  const entries = results.flatMap((result, receiptIndex) =>
    result.failed
      ? []
      : receiptProducts(result).map((product, productIndex) => ({
          product,
          receiptIndex,
          productIndex,
        })),
  );

  const order = Number(params.get('product') ?? '1');
  const entry = entries[order - 1];

  // 촬영하러 갔다 왔으면 그때 값을, 아니면 인식 결과를 시작값으로 쓴다
  const draft = returned?.draft;
  const [name, setName] = useState((draft?.name as string) ?? entry?.product.name ?? '');
  const [nameEditing, setNameEditing] = useState(false);
  const [photo, setPhoto] = useState(returned?.photo ?? entry?.product.photo);
  const [tags, setTags] = useState((draft?.tags as string[]) ?? entry?.product.tags ?? []);
  // 옷 사진 추가 시트 — 카메라로 촬영 / 앨범에서 선택
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  // 태그 추가 바텀시트 — 검색/직접 입력 + 추천 태그 선택
  const [tagSheetOpen, setTagSheetOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [pickedTags, setPickedTags] = useState<string[]>([]);
  // 태그 한 개를 눌러 선택하면 X가 붙는다 (삭제 전 단계)
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [memo, setMemo] = useState((draft?.memo as string) ?? '');
  const [category, setCategory] = useState(
    (draft?.category as string) ?? entry?.product.category ?? '',
  );
  const [subCategory, setSubCategory] = useState(
    (draft?.subCategory as string) ?? entry?.product.subCategory ?? '',
  );
  const [brand, setBrand] = useState((draft?.brand as string) ?? entry?.product.brand ?? '');
  // 색상은 최대 2개. 인식 결과가 단일 color만 들고 있으면 그것을 첫 칸으로 본다
  const [colors, setColors] = useState<{ label: string; hex: string }[]>(
    (draft?.colors as { label: string; hex: string }[]) ??
      entry?.product.colors ??
      (entry?.product.color.label ? [entry.product.color] : []),
  );
  const [openRow, setOpenRow] = useState<string | null>(null);

  // 순번이 어긋나면(주소 직접 입력 등) 목록으로 되돌린다
  if (!entry) return <Navigate to="/closet/register/product-images" replace />;

  // 이미지·상품 이름·카테고리는 등록 전 반드시 채워야 한다
  const canConfirm = Boolean(photo) && name.trim().length > 0 && category.length > 0;

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

  /** 확인 — 바뀐 값을 원본 결과에 되꽂고 목록으로 */
  const handleConfirm = () => {
    const result = results[entry.receiptIndex];
    // color(단일)는 첫 번째 색으로 맞춰둔다 — 아직 단일 색만 읽는 화면이 있다
    const patch = {
      name,
      photo,
      tags,
      colors,
      color: colors[0] ?? { label: '', hex: '' },
      brand,
      category,
      subCategory,
    };
    if (result.products?.length) {
      updateOcrResult(entry.receiptIndex, {
        ...result,
        products: result.products.map((product, index) =>
          index === entry.productIndex ? { ...product, ...patch } : product,
        ),
      });
    } else {
      updateOcrResult(entry.receiptIndex, { ...result, ...patch });
    }
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
                onClick={() => setPhotoSheetOpen(true)}
                className="h-[256px] w-[256px] cursor-pointer overflow-hidden rounded-[14.11px]"
              >
                <img src={photo} alt="" className="h-full w-full object-cover" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPhotoSheetOpen(true)}
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
              // 같은 파일을 다시 골라도 onChange가 오도록 값을 비운다
              event.target.value = '';
              if (file) setPhoto(URL.createObjectURL(file));
              setPhotoSheetOpen(false);
            }}
          />

          {/* 다른 유저 사진 — 이미지 아래 16, 문구↔썸네일 4. 한 장도 없으면 문구까지 안 보인다 */}
          {suggestions.length > 0 && (
            <div className="mt-4 flex flex-col gap-1">
              {/* Caption/C3 */}
              <p className="text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#6F7881]">
                다른유저가 등록한 사진도 있어요
              </p>
              {/* 썸네일 103×82, 간격 8. 개수가 적으면 왼쪽부터 채운다 */}
              <div className="flex items-center gap-2">
                {suggestions.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setPhoto(src)}
                    className="h-[82px] w-[103px] shrink-0 cursor-pointer overflow-hidden rounded-[4px] border border-[#CED1D5]"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 정보 블록 — 사진 아래 40, 안쪽 간격 16 (Figma top 545) */}
          <div className="mt-10 flex flex-col gap-4">
            {/* 상품명 36 — border 1 #E6E8EA r8, padding 4/12/4/8.
                평소엔 읽기만 하고, 연필을 눌러야 그 자리에서 고칠 수 있다 */}
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
                  aria-label="상품명"
                  className="min-w-0 flex-1 text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124] outline-none"
                />
              ) : (
                <span className="min-w-0 flex-1 truncate text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  {name}
                </span>
              )}
              <button
                type="button"
                aria-label="상품명 수정"
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

              {/* 색상 — 스와치 24×24, border 0.8. 드롭다운은 수정 화면(ocr-edit)과 같은 팔레트 */}
              <div className="relative flex h-[26px] items-center justify-between pl-2">
                <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  색상
                </span>
                <button
                  type="button"
                  onClick={() => setOpenRow((prev) => (prev === 'color' ? null : 'color'))}
                  aria-expanded={openRow === 'color'}
                  className="flex cursor-pointer items-center gap-2"
                >
                  {/* 고른 만큼 칩을 늘어놓는다. 하나도 없으면 빈 칩 하나 */}
                  {(colors.length ? colors : [{ label: '', hex: '' }]).map((option, index) => (
                    <span
                      key={option.label || `empty-${index}`}
                      className="h-6 w-6 rounded-full border-[0.8px] border-[#E6E8EA]"
                      style={colorChipStyle(option)}
                    />
                  ))}
                  <ChevronIcon />
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
                          // 이미 고른 색을 다시 누르면 빼고, 아니면 2개까지 더한다.
                          // 2개가 찬 상태에서 새 색을 누르면 아무 일도 없다(먼저 하나를 빼야 한다)
                          disabled={!picked && colors.length >= MAX_COLORS}
                          onClick={() =>
                            setColors((prev) =>
                              picked
                                ? prev.filter((c) => c.label !== option.label)
                                : [...prev, { label: option.label, hex: option.hex }],
                            )
                          }
                          className={[
                            // Body/B6 — 14px SemiBold. 칩 16 + 간격 4 + 이름
                            'flex h-[30px] items-center justify-center gap-1 border-b border-[#E6E8EA] bg-[#F6F7F8] text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]',
                            // 세로 구분선은 가운데 열의 좌우 테두리로 그린다
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

              {/* 태그 — 칩 간격 8, 마지막 칩 ↔ + 24 */}
              <div className="flex h-[26px] items-center justify-between pl-2">
                <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  태그
                </span>
                <div className="flex items-center gap-6">
                  {/* 한 번 누르면 선택(회색 + X), X를 누르면 삭제 */}
                  <div className="flex items-center gap-2">
                    {tags.map((tag) => {
                      const selected = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(selected ? null : tag)}
                          // padding 2/8, gap 8, border 1 #34363C, radius 32
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
                              <TagDeleteIcon />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* + — 태그 추가 바텀시트 열기 */}
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

            {/* 메모 48 — 입력 241×48, bg #F6F7F8 r4, padding 8/10/10 */}
            <div className="flex h-12 items-start justify-between pl-2">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                메모
              </span>
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="메모를 입력해주세요 (선택)"
                aria-label="메모"
                className="h-12 w-[241px] resize-none rounded-[4px] bg-[#F6F7F8] px-2.5 pt-2 pb-2.5 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124] outline-none placeholder:text-[#B2B8BD]"
              />
            </div>
          </div>
        </div>

        {/* 하단 CTA 327×58 — 정보 블록 아래 32, 하단 40 */}
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

        {/* 옷 사진 추가 시트 */}
        <PhotoSourceSheet
          open={photoSheetOpen}
          onClose={() => setPhotoSheetOpen(false)}
          title="옷 이미지 추가"
          options={[
            {
              key: 'camera',
              icon: <SheetCameraIcon />,
              label: '카메라로 촬영',
              // 편집 중이던 값을 들려 보내야 돌아왔을 때 입력이 날아가지 않는다
              onSelect: () =>
                navigate('/closet/register/photo', {
                  state: {
                    returnTo: `/closet/register/product-images/edit?product=${order}`,
                    returnState: {
                      draft: { name, tags, colors, brand, category, subCategory, memo },
                    },
                  },
                }),
            },
            {
              key: 'album',
              icon: <SheetAlbumIcon />,
              label: '앨범에서 선택',
              onSelect: () => fileRef.current?.click(),
            },
          ]}
        />

        {/* 태그 추가 바텀시트 — radius 상단 56, padding 상32/좌우24/하40, bg #F6F7F8 (옷장 상세와 동일) */}
        {tagSheetOpen && (
          <div className="fixed inset-0 z-40 flex justify-center" onClick={() => setTagSheetOpen(false)}>
            <div className="relative w-full max-w-[430px]">
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-[56px] bg-[#F6F7F8] px-6 pt-8 pb-10"
                style={{ boxShadow: '0 -1px 16px 0 rgba(0,0,0,0.16)' }}
                onClick={(event) => event.stopPropagation()}
              >
                {/* 안쪽 327×280 — 타이틀 / 나머지, gap 32 */}
                <div className="flex flex-col gap-8">
                  {/* Title/T3 */}
                  <p className="text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
                    태그 추가
                  </p>

                  {/* 검색 → 추천·완료, gap 24 */}
                  <div className="flex flex-col gap-6">
                    <ClosetSearchField
                      value={tagSearch}
                      onChange={setTagSearch}
                      placeholder="태그 검색 또는 직접 입력"
                    />

                    {/* 추천 블록 → 완료, gap 32 */}
                    <div className="flex flex-col gap-8">
                      {/* 라벨 → 칩, gap 12 */}
                      <div className="flex flex-col gap-3">
                        {/* Body/B2 */}
                        <p className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                          추천 태그
                        </p>
                        {/* 추천 태그 칩 30 — 목록 API가 없어 시안 값 고정 */}
                        <div className="flex flex-wrap items-center gap-2">
                          {RECOMMENDED_TAGS.map((tag) => {
                            const picked = pickedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => togglePickedTag(tag)}
                                // Body/B7 — 14px Medium, padding 4/12
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

export default ClosetProductImageEditPage;
