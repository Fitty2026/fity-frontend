import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { PermissionItem, BottomCTA } from '@/features/closet/components';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/** 구매 내역 조회 아이콘 — Figma 에셋 (18×18) */
const ReceiptIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 14C5.28333 14 5.52083 13.9042 5.7125 13.7125C5.90417 13.5208 6 13.2833 6 13C6 12.7167 5.90417 12.4792 5.7125 12.2875C5.52083 12.0958 5.28333 12 5 12C4.71667 12 4.47917 12.0958 4.2875 12.2875C4.09583 12.4792 4 12.7167 4 13C4 13.2833 4.09583 13.5208 4.2875 13.7125C4.47917 13.9042 4.71667 14 5 14ZM5 10C5.28333 10 5.52083 9.90417 5.7125 9.7125C5.90417 9.52083 6 9.28333 6 9C6 8.71667 5.90417 8.47917 5.7125 8.2875C5.52083 8.09583 5.28333 8 5 8C4.71667 8 4.47917 8.09583 4.2875 8.2875C4.09583 8.47917 4 8.71667 4 9C4 9.28333 4.09583 9.52083 4.2875 9.7125C4.47917 9.90417 4.71667 10 5 10ZM5 6C5.28333 6 5.52083 5.90417 5.7125 5.7125C5.90417 5.52083 6 5.28333 6 5C6 4.71667 5.90417 4.47917 5.7125 4.2875C5.52083 4.09583 5.28333 4 5 4C4.71667 4 4.47917 4.09583 4.2875 4.2875C4.09583 4.47917 4 4.71667 4 5C4 5.28333 4.09583 5.52083 4.2875 5.7125C4.47917 5.90417 4.71667 6 5 6ZM8 14H14V12H8V14ZM8 10H14V8H8V10ZM8 6H14V4H8V6ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16ZM2 2V16V2Z" fill="black"/>
  </svg>
);

/** 안전한 데이터 처리 아이콘 — Figma 에셋 (16×21) */
const LockIcon = () => (
  <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z" fill="black"/>
  </svg>
);

/**
 * 권한 안내 (Permission Guide, PER-01)
 * - 선택한 쇼핑몰 구매 내역 불러오기 전 권한 동의
 */
const ClosetPermissionPage = () => {
  const navigate = useNavigate();

  const handleAgree = () => {
    // TODO: 불러오는 중(ImportLoading) 화면 라우트 추가 예정
    navigate('/closet/register/importing');
  };

  const handleLater = () => {
    navigate('/closet');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        {/* 헤더 */}
        <header className="flex items-center h-16 px-4 bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
        </header>

        {/* 스크롤 영역 (이 층만 스크롤) */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col pt-[117px] px-5 pb-12">
            {/* 타이틀 */}
            <h1 className="text-2xl font-medium leading-[30px] tracking-[-0.24px] text-center text-[#1A1C1C]">
              선택한 쇼핑몰의 구매 내역을
              <br />
              불러오기 위해 아래 권한이
              <br />
              필요해요
            </h1>

            {/* 권한 항목 2개 */}
            <div className="mt-6 flex flex-col gap-4">
              <PermissionItem
                icon={<ReceiptIcon />}
                title="구매 내역 조회"
                description="구매한 상품 정보를 확인해 옷장을 생성해요"
              />
              <PermissionItem
                icon={<LockIcon />}
                title="안전한 데이터 처리"
                description={'비밀번호는 저장되지 않으며, 데이터는\n분석에만 사용돼요'}
              />
            </div>

            {/* 안내 칩 */}
            <div className="mt-[41px] flex justify-center">
              <span className="inline-flex items-center justify-center w-[248px] h-8 rounded-full bg-[#E8E8E8]/50 text-base font-medium leading-6 text-[#4C4546]">
                언제든 연동을 해제할 수 있어요
              </span>
            </div>
          </div>
        </div>

        {/* 하단 CTA — 페이지 배경과 통일 위해 BottomCTA 흰 배경/상단보더 override */}
        <BottomCTA className="shrink-0 bg-transparent! border-transparent! gap-[19.5px]! pb-[60.5px]!">
          <button
            type="button"
            onClick={handleAgree}
            className="w-full h-14 rounded-lg bg-black! text-white text-lg font-medium leading-7 antialiased"
          >
            동의하고 계속하기
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="w-full text-center text-base font-medium leading-6 text-[#5E5E5E]"
          >
            나중에 할게요
          </button>
        </BottomCTA>
      </div>
    </PageLayout>
  );
};

export default ClosetPermissionPage;
