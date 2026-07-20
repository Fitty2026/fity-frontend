import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { CtaButton } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

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
        {/* 상단바 — back / 옷장 / 카운트 (375×50) */}
        <div className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#B2B8BD]">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-5 cursor-pointer" aria-label="뒤로가기">
            <BackIcon />
          </button>
          <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">옷장</span>
          <span className="absolute right-5 flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">
            <CountIcon />
            {items.length}개
          </span>
        </div>

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
