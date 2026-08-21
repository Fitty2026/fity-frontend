import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { CtaButton, OnboardingTopBar } from '@/features/closet/components';
import OcrItemRow from '@/features/closet/components/OcrItemRow';
import { itemsForPhotos } from '@/features/closet/ocrItems';
import useClosetStore from '@/store/closetStore';

/**
 * 업로드한 사진 확인 — 올린 옷 사진과 AI가 붙인 태그를 훑어보는 화면.
 * 수정하기 → 태그 수정, 확인 → 옷 추가 완료.
 * 사진은 앞 화면(촬영/앨범)이 state.photos로 실어 보낸다.
 */
const ClosetTagConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photos = (location.state as { photos?: string[] } | null)?.photos ?? [];
  const items = itemsForPhotos(photos);
  const setOcrResults = useClosetStore((state) => state.setOcrResults);

  // 완료 화면 캐러셀이 이번 회차에 등록한 사진을 읽으므로 여기서 채워 둔다
  useEffect(() => {
    setOcrResults(
      items.map((item) => ({
        brand: item.brand,
        name: `${item.category} ${item.subCategory}`,
        quantity: '1',
        size: '',
        color: { label: '', hex: item.colors[0] ?? '#FFFFFF' },
        price: '',
        store: '',
        purchasedAt: '',
        photo: item.image,
        tags: item.tags,
        category: item.category,
        subCategory: item.subCategory,
      })),
    );
    // items는 매 렌더 새로 만들어지므로 사진 목록이 바뀔 때만 다시 채운다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.join('|'), setOcrResults]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} />

        {/* 타이틀 — 진행 바 아래 52 */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          업로드한 사진이 다음과 같나요?
        </h1>

        {/* 목록 — 327×395(left 24), 타이틀 아래 48, padding 10 / 행 간격 10, 세로 스크롤 */}
        <div className="mx-auto mt-12 h-[395px] w-[327px] overflow-y-auto p-2.5">
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <OcrItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* 하단 버튼 — 수정하기(연회색) / 확인(검정). 목록과 16, 버튼 사이 8, 좌우 24, 하단 40 */}
        <div className="mt-auto flex flex-col gap-2 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))] pt-4">
          <CtaButton
            label="수정하기"
            variant="fill"
            onClick={() => navigate('/closet/register/tags/edit', { state: { photos } })}
          />
          <CtaButton label="확인" onClick={() => navigate('/closet/register/added')} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetTagConfirmPage;
