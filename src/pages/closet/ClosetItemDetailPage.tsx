import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetTopBar, CtaButton } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';
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
  // 서버(CLOSET-04) 우선, 미연결 시 mock 폴백
  const { data: serverItem, isPending } = useClosetItem(itemId);
  const mockItem = useClosetStore((state) => state.items.find((it) => it.id === itemId));
  const item = serverItem ?? mockItem;
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
  const [addingTag, setAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [memo, setMemo] = useState('');

  // 아이템 로드/변경 시 편집 상태 동기화 (서버 데이터 도착 포함)
  useEffect(() => {
    setTags(item?.tags ?? []);
    setMemo(item?.memo ?? '');
    setViewIndex(0);
    setSelectedTag(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverItem, mockItem]);

  const handleAddTag = () => {
    const value = newTag.trim();
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setNewTag('');
    setAddingTag(false);
  };

  if (!item) {
    if (isPending) return null; // 조회 중엔 표시 보류 (미연결 시 mock 폴백)
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
      </div>
    </PageLayout>
  );
};

export default ClosetItemDetailPage;
