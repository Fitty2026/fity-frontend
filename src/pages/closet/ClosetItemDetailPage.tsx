import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetSearchField, ClosetTopBar, CtaButton } from '@/features/closet/components';
import useClosetItem from '@/features/closet/hooks/useClosetItem';
import useUpdateClosetItem from '@/features/closet/hooks/useUpdateClosetItem';

/** 행 우측 화살표 — 16×16, #959BA7 */
const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 3L10.5 8L5.5 13" stroke="#959BA7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 구매처 링크 화살표 — 12×12, #5A6169 */
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75 3H2.625C2.32663 3 2.04048 3.11853 1.8295 3.3295C1.61853 3.54048 1.5 3.82663 1.5 4.125V9.375C1.5 9.67337 1.61853 9.95952 1.8295 10.1705C2.04048 10.3815 2.32663 10.5 2.625 10.5H7.875C8.17337 10.5 8.45952 10.3815 8.6705 10.1705C8.88147 9.95952 9 9.67337 9 9.375V5.25M3.75 8.25L10.5 1.5M10.5 4.125V1.5H7.875" stroke="#5A6169" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 좋아요 하트 — 24×24, stroke #1F2124. 누르면 채워진다 */
const HeartIcon = ({ liked }: { liked: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

/** 태그 삭제 X — 12×12 */
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="#5A6169" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** 태그 추가 + — 24×24 (원 테두리 포함) */
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1606_125338)">
      <circle cx="12" cy="12" r="11.5" stroke="#34363C" />
      <path d="M12 7V17M17 12H7" stroke="#34363C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_1606_125338">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/** 상품명 편집 — 16×16 연필, stroke 1.2 #959BA7 */
const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <g clipPath="url(#closet-item-detail-pencil)">
      <path
        d="M11.2413 2.9915L12.366 1.86616C12.6005 1.63171 12.9184 1.5 13.25 1.5C13.5816 1.5 13.8995 1.63171 14.134 1.86616C14.3685 2.10062 14.5002 2.4186 14.5002 2.75016C14.5002 3.08173 14.3685 3.39971 14.134 3.63416L4.55467 13.2135C4.20222 13.5657 3.76758 13.8246 3.29 13.9668L1.5 14.5002L2.03333 12.7102C2.17552 12.2326 2.43442 11.7979 2.78667 11.4455L11.242 2.9915H11.2413ZM11.2413 2.9915L13 4.75016"
        stroke="#959BA7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="closet-item-detail-pencil">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/** createdAt → 2026.06.27 표기 */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

/** 카테고리 선택지 (Figma 드롭다운 기준) */
const CATEGORY_OPTIONS = ['상의', '아우터', '하의', '악세사리', '신발'];

/** 태그 추가 시트의 추천 태그 — 추천 API가 없어 시안 값 고정 */
const RECOMMENDED_TAGS = ['#데일리', '#출근', '#캐주얼', '#미니멀'];

/** 브랜드 선택지 (Figma 드롭다운 기준) */
const BRAND_OPTIONS = ['ZARA', 'MUSINSA', 'ABLY', 'ZIGZAG', '29cm', 'W-Concept'];

/** 세부 카테고리 선택지 — 시안에 '상의'만 있어 나머지 카테고리는 목록 대기 */
const SUB_CATEGORY_OPTIONS: Record<string, string[]> = {
  상의: ['반팔 셔츠', '나시', '조끼', '블라우스'],
};

/**
 * 값 옆 화살표를 눌러 고르는 행 — 드롭다운 88×(30×항목수), 그림자 0/4/10 #000000 24%.
 * 항목은 Body/B7, 현재 선택값만 Point/2(#9D98F0).
 */
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
  <div data-dropdown className="relative flex h-[26px] items-center justify-between">
    <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{label}</span>
    <button
      type="button"
      onClick={onToggle}
      className="flex cursor-pointer items-center gap-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]"
      aria-expanded={open}
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
              className={`flex h-[30px] w-full cursor-pointer items-center justify-center whitespace-nowrap border-b border-[#E6E8EA] bg-[#F6F7F8] px-2 py-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] ${
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
 * 옷장 아이템 상세 — 태그 확인 및 수정 화면 (Figma 시안 기준).
 * 태그 인터랙션: 클릭 시 회색 선택 상태 + X 노출 → X 클릭으로 삭제 (임시 구현, 디자이너 확인 대기).
 * 수정하기/삭제하기 버튼 이후 플로우는 와이어프레임상 모호 — 후속 화면 시안 반영 시 연결 예정.
 */
const ClosetItemDetailPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  // 상세는 서버(CLOSET-04)가 소스다
  const { data: serverItem, isPending } = useClosetItem(itemId);
  const item = serverItem;
  const { saveAsync, isSaving, error: saveError } = useUpdateClosetItem(itemId);

  // 수정하기 = 태그 저장(CLOSET-05). 성공 시 목록/상세 최신화 후 뒤로
  const handleSave = async () => {
    try {
      await saveAsync(tags);
      navigate(-1);
    } catch {
      // 실패 메시지는 saveError로 표시
    }
  };

  // 상세 뷰 이미지 (CLOSET-04 미제공 → 대표 이미지로 대체)
  const views = item?.detailImages ?? (item ? [item.imageUrl, item.imageUrl, item.imageUrl] : []);
  const [viewIndex, setViewIndex] = useState(0);

  // 태그 편집 상태 (수정하기 확정 전까지 로컬)
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // 태그 추가 바텀시트 — 검색/직접 입력 + 추천 태그 선택
  const [tagSheetOpen, setTagSheetOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [pickedTags, setPickedTags] = useState<string[]>([]);
  // 좋아요 — 저장 API가 없어 화면 안에서만 유지 (TODO: 옷장 API에 좋아요 붙으면 연동)
  const [liked, setLiked] = useState(false);
  // 상품명 — 수정 화면과 같은 인라인 편집. 저장 API가 name을 받지 않아 값은 화면 안에서만 유지
  // (TODO: 수정 API에 name 추가되면 연동)
  const [name, setName] = useState('');
  const [nameEditing, setNameEditing] = useState(false);
  // 카테고리 — 저장은 태그만 하므로 선택값은 화면 안에서만 유지 (TODO: 수정 API에 카테고리 추가되면 연동)
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  // 한 번에 하나만 펼친다
  const [openRow, setOpenRow] = useState<'category' | 'subCategory' | 'brand' | null>(null);
  const [memo, setMemo] = useState('');

  // 아이템 로드/변경 시 편집 상태 동기화 (서버 데이터 도착 포함)
  useEffect(() => {
    setTags(item?.tags ?? []);
    setMemo(item?.memo ?? '');
    setName(item?.name ?? '');
    setNameEditing(false);
    setCategory(item?.category ?? '');
    setSubCategory(item?.subCategory ?? '');
    setBrand(item?.brand ?? '');
    setViewIndex(0);
    setSelectedTag(null);
    setOpenRow(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverItem]);

  // 드롭다운 바깥을 누르면 닫는다
  useEffect(() => {
    if (!openRow) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-dropdown]')) setOpenRow(null);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openRow]);

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

  if (!item) {
    if (isPending) return null; // 조회 중엔 표시 보류
    return (
      <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-white">
          <p className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
            아이템을 찾을 수 없어요
          </p>
          <button
            type="button"
            onClick={() => navigate('/closet')}
            className="cursor-pointer rounded-full bg-[#1F2124] px-6 py-3 text-[14px] font-semibold text-white"
          >
            옷장으로 돌아가기
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <ClosetTopBar height={50} />

        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pb-10 pt-6">
          {/* 이미지 영역 — 메인 241×241 + 우측 세로 썸네일 70×70×3 */}
          <div className="flex justify-between">
            <div className="relative h-[241px] w-[241px] overflow-hidden rounded-lg">
              <img src={views[viewIndex]} alt="" className="h-full w-full object-cover" />
              {/* 좋아요 — 24×24, top 8 / right 12. 저장 API 없어 화면 안에서만 유지 */}
              <button
                type="button"
                onClick={() => setLiked((v) => !v)}
                className="absolute right-3 top-2 cursor-pointer"
                aria-label={liked ? '좋아요 취소' : '좋아요'}
                aria-pressed={liked}
              >
                <HeartIcon liked={liked} />
              </button>
              {/* 날짜 top8/left12, 63×20 아래 바로 쇼핑몰 라벨 (Figma) */}
              <div className="absolute left-3 top-2 flex flex-col">
                <span className="text-[12px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#5A6169]">
                  {formatDate(item.createdAt)}
                </span>
                {item.purchasedFrom && (
                  <span className="flex items-center gap-1 text-[10px] font-medium leading-[1.65] tracking-[-0.02em] text-[#5A6169]">
                    <ExternalIcon />
                    {item.purchasedFrom}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {views.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setViewIndex(i)}
                  className="h-[70px] w-[70px] cursor-pointer overflow-hidden rounded-lg"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 정보 행 — 327 너비, 이미지 아래 12, 행 간격 12 (태그→메모만 14) */}
          <div className="mt-3 flex flex-col gap-3">
            {/* 상품명 36 — border 1 #E6E8EA r8, padding 4/12/4/8.
                평소엔 읽기만 하고, 연필을 눌러야 그 자리에서 고칠 수 있다 (수정 화면과 동일) */}
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

            <SelectRow
              label="카테고리"
              value={category || item.category}
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

            {/* 색상 — 원형 스와치 24×24 */}
            <div className="flex h-[26px] items-center justify-between">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">색상</span>
              <span className="flex items-center gap-2">
                {(item.colors ?? []).map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full border border-[#E6E8EA]"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {!item.colors?.length && (
                  <span className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">-</span>
                )}
              </span>
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

            {/* 태그 — 클릭 시 선택(회색) + X 노출, X 클릭으로 삭제. + 로 추가 (임시 구현) */}
            <div className="flex items-start justify-between">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">태그</span>
              {/* 칩 간격 8, 마지막 칩 ↔ + 24 고정. +는 칩 줄바꿈과 무관하게 같은 줄 유지 */}
              <div className="flex items-start justify-end">
                <div className="flex max-w-[240px] flex-wrap items-center justify-end gap-2">
                {tags.map((tag) => {
                  const selected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selected ? null : tag)}
                      className={`flex h-[26px] cursor-pointer items-center rounded-full border border-[#34363C] px-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] transition-colors ${
                        selected ? 'gap-1.5 bg-[#B2B8BD] pr-2.5' : 'bg-white'
                      }`}
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                      {selected && (
                        <span
                          role="button"
                          aria-label={`${tag} 태그 삭제`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTags(tags.filter((t) => t !== tag));
                            setSelectedTag(null);
                          }}
                        >
                          <XIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
                </div>
                {/* + — 태그 추가 바텀시트 열기 */}
                <button
                  type="button"
                  onClick={() => setTagSheetOpen(true)}
                  className="ml-6 flex h-[26px] w-6 shrink-0 cursor-pointer items-center justify-center"
                  aria-label="태그 추가"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* 메모 — 태그와 14px 간격 (행 간격 12 + 2) */}
            <div className="mt-0.5 flex items-start justify-between">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">메모</span>
              {/* 241×48, radius 4, padding 상8/좌우하10 (Figma) */}
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요 (선택)"
                className="h-12 w-[241px] resize-none rounded bg-[#F6F7F8] pb-2.5 pl-2.5 pr-2.5 pt-2 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#34363C] placeholder-[#B2B8BD] outline-none"
              />
            </div>
          </div>

          {/* 하단 버튼 — 화면 하단 고정(mt-auto). 수정하기 = 태그 저장(CLOSET-05) */}
          <div className="mt-auto flex flex-col gap-2">
            {saveError && (
              <p className="text-center text-[13px] font-medium leading-[1.6] tracking-[-0.02em] text-[#E5484D]">
                {(saveError as Error).message || '수정에 실패했어요. 다시 시도해주세요.'}
              </p>
            )}
            <CtaButton
              label="삭제하기"
              variant="fill"
              height={64}
              onClick={() => navigate(`/closet/items/${item.id}/delete`)}
            />
            <CtaButton label={isSaving ? '저장 중…' : '수정하기'} variant="dark" onClick={handleSave} />
          </div>
        </div>

        {/* 태그 추가 바텀시트 — 375×408, radius 상단 56, padding 상32/좌우24/하40, bg #F6F7F8 */}
        {tagSheetOpen && (
          <div className="fixed inset-0 z-40 flex justify-center" onClick={() => setTagSheetOpen(false)}>
            <div className="relative w-full max-w-[430px]">
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-[56px] bg-[#F6F7F8] px-6 pb-10 pt-8"
                style={{ boxShadow: '0 -1px 16px 0 rgba(0,0,0,0.16)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 타이포·간격은 시안에 값이 없어 화면 톤에 맞춤 */}
                <p className="text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  태그 추가
                </p>

                <div className="mt-6">
                  <ClosetSearchField
                    value={tagSearch}
                    onChange={setTagSearch}
                    placeholder="태그 검색 또는 직접 입력"
                  />
                </div>

                <p className="mt-6 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                  추천 태그
                </p>
                {/* 추천 태그 — 목록 API가 없어 시안 값 고정 */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {RECOMMENDED_TAGS.map((tag) => {
                    const picked = pickedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => togglePickedTag(tag)}
                        className={`flex h-[26px] cursor-pointer items-center rounded-full border border-[#34363C] px-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] transition-colors ${
                          picked ? 'bg-[#B2B8BD]' : 'bg-white'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <CtaButton label="완료" variant="dark" onClick={handleConfirmTags} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ClosetItemDetailPage;
