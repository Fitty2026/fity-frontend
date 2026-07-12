import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { PhotoUploadBox, BottomCTA } from '@/features/closet/components';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/** 사진 촬영 아이콘 — Figma 에셋 (19×17) */
const CameraIcon = () => (
  <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V5C0 4.54167 0.163194 4.14931 0.489583 3.82292C0.815972 3.49653 1.20833 3.33333 1.66667 3.33333H4.29167L5.83333 1.66667H10.8333V3.33333H6.5625L5.04167 5H1.66667V15H15V7.5H16.6667V15C16.6667 15.4583 16.5035 15.8507 16.1771 16.1771C15.8507 16.5035 15.4583 16.6667 15 16.6667H1.66667ZM15 5V3.33333H13.3333V1.66667H15V0H16.6667V1.66667H18.3333V3.33333H16.6667V5H15ZM8.33333 13.75C9.375 13.75 10.2604 13.3854 10.9896 12.6562C11.7188 11.9271 12.0833 11.0417 12.0833 10C12.0833 8.95833 11.7188 8.07292 10.9896 7.34375C10.2604 6.61458 9.375 6.25 8.33333 6.25C7.29167 6.25 6.40625 6.61458 5.67708 7.34375C4.94792 8.07292 4.58333 8.95833 4.58333 10C4.58333 11.0417 4.94792 11.9271 5.67708 12.6562C6.40625 13.3854 7.29167 13.75 8.33333 13.75ZM8.33333 12.0833C7.75 12.0833 7.25694 11.8819 6.85417 11.4792C6.45139 11.0764 6.25 10.5833 6.25 10C6.25 9.41667 6.45139 8.92361 6.85417 8.52083C7.25694 8.11806 7.75 7.91667 8.33333 7.91667C8.91667 7.91667 9.40972 8.11806 9.8125 8.52083C10.2153 8.92361 10.4167 9.41667 10.4167 10C10.4167 10.5833 10.2153 11.0764 9.8125 11.4792C9.40972 11.8819 8.91667 12.0833 8.33333 12.0833Z" fill="black"/>
  </svg>
);

/** 갤러리 아이콘 — Figma 에셋 (15×15) */
const GalleryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H13.3333C13.7917 0 14.184 0.163194 14.5104 0.489583C14.8368 0.815972 15 1.20833 15 1.66667V13.3333C15 13.7917 14.8368 14.184 14.5104 14.5104C14.184 14.8368 13.7917 15 13.3333 15H1.66667ZM1.66667 13.3333H13.3333V1.66667H1.66667V13.3333ZM2.5 11.6667H12.5L9.375 7.5L6.875 10.8333L5 8.33333L2.5 11.6667ZM1.66667 13.3333V1.66667V13.3333Z" fill="black"/>
  </svg>
);

/** 촬영 가이드 눈 아이콘 — Figma 에셋 (19×13, #848484) */
const EyeIcon = () => (
  <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.16667 10C10.2083 10 11.0938 9.63542 11.8229 8.90625C12.5521 8.17708 12.9167 7.29167 12.9167 6.25C12.9167 5.20833 12.5521 4.32292 11.8229 3.59375C11.0938 2.86458 10.2083 2.5 9.16667 2.5C8.125 2.5 7.23958 2.86458 6.51042 3.59375C5.78125 4.32292 5.41667 5.20833 5.41667 6.25C5.41667 7.29167 5.78125 8.17708 6.51042 8.90625C7.23958 9.63542 8.125 10 9.16667 10ZM9.16667 8.5C8.54167 8.5 8.01042 8.28125 7.57292 7.84375C7.13542 7.40625 6.91667 6.875 6.91667 6.25C6.91667 5.625 7.13542 5.09375 7.57292 4.65625C8.01042 4.21875 8.54167 4 9.16667 4C9.79167 4 10.3229 4.21875 10.7604 4.65625C11.1979 5.09375 11.4167 5.625 11.4167 6.25C11.4167 6.875 11.1979 7.40625 10.7604 7.84375C10.3229 8.28125 9.79167 8.5 9.16667 8.5ZM9.16667 12.5C7.13889 12.5 5.29167 11.934 3.625 10.8021C1.95833 9.67014 0.75 8.15278 0 6.25C0.75 4.34722 1.95833 2.82986 3.625 1.69792C5.29167 0.565972 7.13889 0 9.16667 0C11.1944 0 13.0417 0.565972 14.7083 1.69792C16.375 2.82986 17.5833 4.34722 18.3333 6.25C17.5833 8.15278 16.375 9.67014 14.7083 10.8021C13.0417 11.934 11.1944 12.5 9.16667 12.5ZM9.16667 10.8333C10.7361 10.8333 12.1771 10.4201 13.4896 9.59375C14.8021 8.76736 15.8056 7.65278 16.5 6.25C15.8056 4.84722 14.8021 3.73264 13.4896 2.90625C12.1771 2.07986 10.7361 1.66667 9.16667 1.66667C7.59722 1.66667 6.15625 2.07986 4.84375 2.90625C3.53125 3.73264 2.52778 4.84722 1.83333 6.25C2.52778 7.65278 3.53125 8.76736 4.84375 9.59375C6.15625 10.4201 7.59722 10.8333 9.16667 10.8333Z" fill="#848484"/>
  </svg>
);

/**
 * 사진으로 옷 등록하기 (Photo Upload Clothing Entry)
 * - 직접 등록 플로우. 사진 업로드 → 분석
 */
const ClosetPhotoPage = () => {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    // TODO: 분석 중(ImportLoading) 화면 라우트 추가 예정
    navigate('/closet/register/analyzing');
  };

  const handleLater = () => {
    navigate('/closet');
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
          <h1 className="text-base font-medium leading-5 text-black">사진으로 옷 등록하기</h1>
        </header>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col gap-4 pt-6 px-5 pb-6">
            {/* 사진 업로드 박스 */}
            <PhotoUploadBox
              title="옷 사진을 업로드해주세요"
              description={'AI가 사진을 분석해 색상, 카테고리, 계절\n정보를 자동으로 정리해드려요'}
            />

            {/* 촬영 / 갤러리 버튼 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-12 rounded-xl border! border-[#7E7576]! bg-white! text-xs font-medium leading-4 text-black"
              >
                <CameraIcon />
                사진 촬영하기
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-12 rounded-xl border! border-[#7E7576]! bg-white! text-xs font-medium leading-4 text-black"
              >
                <GalleryIcon />
                갤러리에서 선택
              </button>
            </div>

            {/* 촬영 가이드 (버튼↔가이드 gap 32 = gap-4 16 + mt-4 16) */}
            <div className="mt-4 flex flex-col gap-4 p-6 rounded-xl bg-[#F3F3F4]">
              <p className="text-xs font-medium leading-4 tracking-[0.6px] uppercase text-[#5E5E5E]">
                촬영 가이드
              </p>
              <div className="flex items-center gap-2">
                <EyeIcon />
                <span className="text-sm font-medium leading-5 text-[#1A1C1C]">
                  옷이 잘 보이도록 촬영해주세요
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <BottomCTA className="shrink-0">
          <button
            type="button"
            onClick={handleAnalyze}
            className="w-full h-14 rounded-lg bg-neutral-300! text-[#848484] text-base font-medium leading-6"
          >
            분석 시작하기
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="w-full text-center text-sm font-medium leading-6 text-neutral-500"
          >
            나중에 하기
          </button>
        </BottomCTA>
      </div>
    </PageLayout>
  );
};

export default ClosetPhotoPage;
