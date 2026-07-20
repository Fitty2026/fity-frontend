import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { mockClosetItems } from '@/mocks/data/closet';

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

/** createdAt → 2026.06.27 표기 */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

/** 정보 행 — 좌 라벨 / 우 값 + chevron (Figma: 327×26) */
const InfoRow = ({ label, value, withChevron = false }: { label: string; value: string; withChevron?: boolean }) => (
  <div className="flex h-[26px] items-center justify-between">
    <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{label}</span>
    <span className="flex items-center gap-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
      {value}
      {withChevron && <ChevronIcon />}
    </span>
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
  const item = mockClosetItems.find((it) => it.id === itemId);

  // 상세 뷰 이미지 (없으면 대표 이미지로 대체)
  const views = item?.detailImages ?? (item ? [item.imageUrl, item.imageUrl, item.imageUrl] : []);
  const [viewIndex, setViewIndex] = useState(0);

  // 태그 편집 상태 (수정하기 확정 전까지 로컬)
  const [tags, setTags] = useState<string[]>(item?.tags ?? []);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [memo, setMemo] = useState(item?.memo ?? '');

  const handleAddTag = () => {
    const value = newTag.trim();
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setNewTag('');
    setAddingTag(false);
  };

  if (!item) {
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
        {/* 상단바 — back / 옷장 / 카운트 (375×50) */}
        <div className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#B2B8BD]">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-5 cursor-pointer" aria-label="뒤로가기">
            <BackIcon />
          </button>
          <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">옷장</span>
          <span className="absolute right-5 flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">
            <CountIcon />
            {mockClosetItems.length}개
          </span>
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pb-10 pt-6">
          {/* 이미지 영역 — 메인 241×241 + 우측 세로 썸네일 70×70×3 */}
          <div className="flex justify-between">
            <div className="relative h-[241px] w-[241px] overflow-hidden rounded-lg">
              <img src={views[viewIndex]} alt="" className="h-full w-full object-cover" />
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
            <InfoRow label="카테고리" value={item.category} withChevron />
            <InfoRow label="세부 카테고리" value={item.subCategory ?? '-'} withChevron />

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

            <InfoRow label="브랜드" value={item.brand ?? '-'} withChevron />

            {/* 태그 — 클릭 시 선택(회색) + X 노출, X 클릭으로 삭제. + 로 추가 (임시 구현) */}
            <div className="flex items-start justify-between">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">태그</span>
              {/* 칩 간격 8, 마지막 칩 ↔ + 버튼 24 (8 + ml 16) */}
              <div className="flex max-w-[240px] flex-wrap items-center justify-end gap-2">
                {tags.map((tag) => {
                  const selected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selected ? null : tag)}
                      className={`flex h-[26px] cursor-pointer items-center gap-2 rounded-full border border-[#34363C] px-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] transition-colors ${
                        selected ? 'bg-[#B2B8BD]' : 'bg-white'
                      }`}
                    >
                      {tag}
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
                {addingTag ? (
                  <input
                    autoFocus
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onBlur={handleAddTag}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="태그 입력"
                    className="ml-4 h-[26px] w-[88px] rounded-full border border-[#34363C] px-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingTag(true)}
                    className="ml-4 flex h-6 w-6 cursor-pointer items-center justify-center"
                    aria-label="태그 추가"
                  >
                    <PlusIcon />
                  </button>
                )}
              </div>
            </div>

            {/* 메모 — 태그와 14px 간격 (행 간격 12 + 2) */}
            <div className="mt-0.5 flex items-start justify-between">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">메모</span>
              {/* 241×64, radius 4, padding 상8/좌우하10 (Figma) */}
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요 (선택)"
                className="h-16 w-[241px] resize-none rounded bg-[#F6F7F8] pb-2.5 pl-2.5 pr-2.5 pt-2 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#34363C] placeholder-[#B2B8BD] outline-none"
              />
            </div>
          </div>

          {/* 하단 버튼 — 화면 하단 고정(mt-auto) (이후 플로우 시안 대기, 동작 미연결) */}
          <div className="mt-auto flex flex-col gap-2">
            <button
              type="button"
              className="h-16 w-full cursor-pointer rounded-full bg-[#F6F7F8] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
            >
              삭제하기
            </button>
            <button
              type="button"
              className="h-[58px] w-full cursor-pointer rounded-full bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-white"
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetItemDetailPage;
