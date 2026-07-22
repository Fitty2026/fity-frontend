import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetTopBar, CtaButton } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/**
 * 옷장 아이템 삭제 확인 화면.
 * "확인"은 실제 삭제 없이 옷장 홈으로 이동 (mock 단계 — API 연동 시 삭제 요청으로 대체).
 */
const ClosetItemDeletePage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const items = useClosetStore((state) => state.items);
  const removeItem = useClosetStore((state) => state.removeItem);
  const item = items.find((it) => it.id === itemId);

  const handleConfirm = () => {
    if (itemId) removeItem(itemId);
    navigate('/closet');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <ClosetTopBar height={50} />

        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pb-10">
          {/* 타이틀 — 375×30 center */}
          <p className="mt-14 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            아이템을 삭제할까요?
          </p>

          {/* 아이템 이미지 카드 — 295×391, radius 24, 딤 #000 50% (Figma) */}
          <div className="relative mx-auto mt-10 h-[391px] w-[295px] shrink-0 overflow-hidden rounded-3xl">
            {item ? (
              <>
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#F6F7F8] text-[14px] font-medium text-[#959BA7]">
                아이템을 찾을 수 없어요
              </div>
            )}
          </div>

          {/* 버튼 — 아니오(회색) / 확인(블랙), 간격 8, 하단 40 */}
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <CtaButton label="아니오" variant="fill" onClick={() => navigate(-1)} />
            <CtaButton label="확인" variant="dark" onClick={handleConfirm} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetItemDeletePage;
