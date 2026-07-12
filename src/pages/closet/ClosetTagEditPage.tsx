import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import Badge from '@/components/ui/Badge';
import { ClothingThumbnail, BottomCTA } from '@/features/closet/components';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/**
 * 태그 추가(+) 버튼 — 태그 칩과 동일 스타일(pill)
 * TODO: 클릭 시 태그 추가 동작 구현 (현재 와이어프레임, 미동작)
 */
const PlusButton = () => (
  <button
    type="button"
    className="inline-flex items-center justify-center h-[25px] w-[34px] rounded-full border! border-[#CFC4C5]! bg-[#EEEEEE]! text-[#5E5E5E]"
    aria-label="태그 추가"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  </button>
);

/** 태그 확인·수정 대상 아이템 (와이어프레임용 목업). 첫 태그 = 카테고리(강조) */
const ITEMS = [
  { id: 1, category: '상의', tags: ['화이트', '미니멀', '베이직', '면'] },
  { id: 2, category: '하의', tags: ['블랙', '캐주얼', '데님', '스트레이트'] },
  { id: 3, category: '아우터', tags: ['그레이', '모던', '오버사이즈'] },
  { id: 4, category: '상의', tags: ['블랙', '스트릿', '후드', '겨울'] },
];

/**
 * 태그 확인 및 수정 (Batch Tag Edit)
 * - 분석 결과 태그를 아이템별로 확인/수정
 */
const ClosetTagEditPage = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    // TODO: 추가 완료(Bulk Upload Success) 화면 라우트 추가 예정
    navigate('/closet/register/complete');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        {/* 헤더 (타이틀 중앙) */}
        <header className="relative flex items-center justify-center h-16 px-4 bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
          <h1 className="text-base font-medium leading-5 text-black">태그 확인 및 수정</h1>
        </header>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col gap-4 pt-6 px-5 pb-6">
            <p className="text-base font-medium leading-6 text-[#5E5E5E]">잘못된 부분만 수정해주세요</p>

            {/* 아이템 카드 리스트 */}
            <div className="flex flex-col gap-4">
              {ITEMS.map((item) => {
                // 카테고리 + 태그 + 추가버튼을 3개씩 끊어 줄 배치 (칩은 글씨에 맞춰 hug)
                // TODO: 태그 클릭 시 수정 동작 구현 (현재 와이어프레임, 미동작)
                const chips = [
                  <Badge key="cat" label={item.category} selected />,
                  ...item.tags.map((tag) => (
                    <Badge key={tag} label={tag} className="bg-[#EEEEEE]! border-[#CFC4C5]!" />
                  )),
                  <PlusButton key="plus" />,
                ];
                const rows: React.ReactNode[][] = [];
                for (let i = 0; i < chips.length; i += 3) rows.push(chips.slice(i, i + 3));

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 min-h-[130px] rounded-xl border border-[#E2E2E2] bg-white"
                  >
                    <ClothingThumbnail ratio="auto" className="w-[80px] h-[98px] shrink-0" />
                    {/* 한 줄 최대 3개, 행/열 gap 8 */}
                    <div className="flex-1 flex flex-col gap-2">
                      {rows.map((row, ri) => (
                        <div key={ri} className="flex items-start gap-2">
                          {row}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <BottomCTA className="shrink-0">
          <button
            type="button"
            onClick={handleDone}
            className="w-full h-14 rounded-lg bg-black! text-white text-base font-medium leading-6"
          >
            완료
          </button>
        </BottomCTA>
      </div>
    </PageLayout>
  );
};

export default ClosetTagEditPage;
