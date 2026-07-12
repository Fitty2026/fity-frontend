import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { RegisterOptionCard, BottomCTA } from '@/features/closet/components';

type RegisterMethod = 'auto' | 'manual';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/** 카드 우측 아이콘 박스 (흰색 라운드 박스) */
const IconBox = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center justify-center w-[51px] h-[51px] rounded-[8px] bg-[#EEEEEE]">
    {children}
  </span>
);

/** 자동 가져오기 아이콘 (구매 내역 연동) — Figma 에셋 */
const AutoImportIcon = () => (
  <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20V17.5H3.40625C2.34375 16.5833 1.51042 15.4792 0.90625 14.1875C0.302083 12.8958 0 11.5 0 10C0 7.66667 0.708333 5.60938 2.125 3.82812C3.54167 2.04688 5.33333 0.875 7.5 0.3125V2.9375C6.04167 3.45833 4.84375 4.35937 3.90625 5.64062C2.96875 6.92187 2.5 8.375 2.5 10C2.5 11.125 2.72396 12.1615 3.17187 13.1094C3.61979 14.0573 4.22917 14.875 5 15.5625V12.5H7.5V20H0ZM13.75 20C12.7083 20 11.8229 19.6354 11.0938 18.9062C10.3646 18.1771 10 17.2917 10 16.25C10 15.25 10.3437 14.3906 11.0312 13.6719C11.7188 12.9531 12.5625 12.5729 13.5625 12.5312C13.9167 11.7812 14.4427 11.1719 15.1406 10.7031C15.8385 10.2344 16.625 10 17.5 10C18.6042 10 19.5573 10.3594 20.3594 11.0781C21.1615 11.7969 21.6458 12.6875 21.8125 13.75C22.6875 13.75 23.4375 14.0521 24.0625 14.6563C24.6875 15.2604 25 15.9896 25 16.8438C25 17.7188 24.6979 18.4635 24.0937 19.0781C23.4896 19.6927 22.75 20 21.875 20H13.75ZM17.375 8.75C17.2292 7.89583 16.9479 7.10417 16.5313 6.375C16.1146 5.64583 15.6042 5 15 4.4375V7.5H12.5V0H20V2.5H16.5937C17.4896 3.29167 18.224 4.21875 18.7969 5.28125C19.3698 6.34375 19.7396 7.5 19.9063 8.75H17.375ZM13.75 17.5H21.875C22.0417 17.5 22.1875 17.4375 22.3125 17.3125C22.4375 17.1875 22.5 17.0417 22.5 16.875C22.5 16.7083 22.4375 16.5625 22.3125 16.4375C22.1875 16.3125 22.0417 16.25 21.875 16.25H19.6875V14.6875C19.6875 14.0833 19.474 13.5677 19.0469 13.1406C18.6198 12.7135 18.1042 12.5 17.5 12.5C16.8958 12.5 16.3802 12.7135 15.9531 13.1406C15.526 13.5677 15.3125 14.0833 15.3125 14.6875V15H13.75C13.3958 15 13.099 15.1198 12.8594 15.3594C12.6198 15.599 12.5 15.8958 12.5 16.25C12.5 16.6042 12.6198 16.901 12.8594 17.1406C13.099 17.3802 13.3958 17.5 13.75 17.5Z" fill="black"/>
  </svg>
);

/** 직접 등록 아이콘 — Figma 에셋 */
const ManualCameraIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.75 8.75H21.75C21.1875 7.3125 20.3281 6.07812 19.1719 5.04687C18.0156 4.01562 16.6875 3.29167 15.1875 2.875L11.75 8.75ZM8.875 11.25L13.875 2.625C13.6458 2.58333 13.4167 2.55208 13.1875 2.53125C12.9583 2.51042 12.7292 2.5 12.5 2.5C11.125 2.5 9.84375 2.76042 8.65625 3.28125C7.46875 3.80208 6.41667 4.5 5.5 5.375L8.875 11.25ZM2.8125 15H9.625L4.625 6.375C3.95833 7.22917 3.4375 8.17188 3.0625 9.20313C2.6875 10.2344 2.5 11.3333 2.5 12.5C2.5 12.9375 2.52604 13.3594 2.57812 13.7656C2.63021 14.1719 2.70833 14.5833 2.8125 15ZM9.8125 22.125L13.1875 16.25H3.25C3.8125 17.6875 4.67187 18.9219 5.82812 19.9531C6.98438 20.9844 8.3125 21.7083 9.8125 22.125ZM12.5 22.5C13.875 22.5 15.1562 22.2396 16.3437 21.7188C17.5312 21.1979 18.5833 20.5 19.5 19.625L16.125 13.75L11.125 22.375C11.3542 22.4167 11.5781 22.4479 11.7969 22.4688C12.0156 22.4896 12.25 22.5 12.5 22.5ZM20.375 18.625C21.0417 17.7708 21.5625 16.8281 21.9375 15.7969C22.3125 14.7656 22.5 13.6667 22.5 12.5C22.5 12.0625 22.474 11.6406 22.4219 11.2344C22.3698 10.8281 22.2917 10.4167 22.1875 10H15.375L20.375 18.625ZM12.5 25C10.7917 25 9.17708 24.6719 7.65625 24.0156C6.13542 23.3594 4.80729 22.4635 3.67188 21.3281C2.53646 20.1927 1.64062 18.8646 0.984375 17.3438C0.328125 15.8229 0 14.2083 0 12.5C0 10.7708 0.328125 9.15104 0.984375 7.64063C1.64062 6.13021 2.53646 4.80729 3.67188 3.67188C4.80729 2.53646 6.13542 1.64062 7.65625 0.984375C9.17708 0.328125 10.7917 0 12.5 0C14.2292 0 15.849 0.328125 17.3594 0.984375C18.8698 1.64062 20.1927 2.53646 21.3281 3.67188C22.4635 4.80729 23.3594 6.13021 24.0156 7.64063C24.6719 9.15104 25 10.7708 25 12.5C25 14.2083 24.6719 15.8229 24.0156 17.3438C23.3594 18.8646 22.4635 20.1927 21.3281 21.3281C20.1927 22.4635 18.8698 23.3594 17.3594 24.0156C15.849 24.6719 14.2292 25 12.5 25Z" fill="#5E5E5E"/>
  </svg>
);

/**
 * 옷 등록 방식 선택 (Frame 19)
 * - 자동으로 가져오기 (구매 내역 연동) / 직접 등록하기 (사진)
 */
const ClosetRegisterPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<RegisterMethod>('auto');

  const handleNext = () => {
    // TODO: 다음 화면 라우트 추가 예정
    // auto  → 쇼핑몰 선택(Platform Selection)
    // manual → 사진 업로드(Photo Upload Clothing)
    if (method === 'auto') {
      navigate('/closet/register/platform');
    } else {
      navigate('/closet/register/photo');
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        {/* 헤더 (Figma: 높이 64) — 고정 */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-100">
          <div className="w-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 -ml-2"
              aria-label="뒤로가기"
            >
              <BackIcon />
            </button>
          </div>
          <h1 className="text-base font-medium leading-5 text-black">사진으로 옷 등록하기</h1>
          <div className="w-10" />
        </header>

        {/* 스크롤 영역 (이 층만 스크롤) */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* 등록 방식 선택 */}
          <div className="flex flex-col gap-4 px-5 pt-[49px]">
            <RegisterOptionCard
              title="자동으로 가져오기"
              description={'구매 내역을 연동해 옷장을\n자동으로 채워요'}
              badge="추천"
              icon={<IconBox><AutoImportIcon /></IconBox>}
              selected={method === 'auto'}
              onClick={() => setMethod('auto')}
              className="h-[120px]"
            />
            <RegisterOptionCard
              title="직접 등록하기"
              description={'사진으로 옷을 하나씩 추가\n할 수 있어요'}
              icon={<IconBox><ManualCameraIcon /></IconBox>}
              selected={method === 'manual'}
              onClick={() => setMethod('manual')}
              className="h-[120px]"
            />
          </div>
        </div>

        {/* 하단 안내 (버튼 위 — 고정, 안 찌부러지게 shrink-0) */}
        <p className="shrink-0 pb-[10px] text-center text-base font-medium leading-6 text-[#5E5E5E]">
          나중에 언제든 추가할 수 있어요
        </p>

        {/* Figma: Fixed Bottom Button Section (390×97, bg #FFFFFF, border-top 1px #F5F5F5, padding 20) */}
        <BottomCTA className="shrink-0">
          {/* Figma: Button — Fill 350 / Hug 56 / radius 8 / #000000 */}
          <button
            type="button"
            onClick={handleNext}
            className="w-full h-14 rounded-lg bg-black! text-white text-base font-medium leading-6"
          >
            다음
          </button>
        </BottomCTA>
      </div>
    </PageLayout>
  );
};

export default ClosetRegisterPage;
