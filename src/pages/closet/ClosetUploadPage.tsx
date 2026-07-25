import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';

/** 사진(이미지) 아이콘 — 24×24, stroke #F6F7F8 (Figma) */
const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.25 15.75L7.409 10.591C7.61793 10.3821 7.86597 10.2163 8.13896 10.1033C8.41194 9.99018 8.70452 9.93198 9 9.93198C9.29548 9.93198 9.58806 9.99018 9.86104 10.1033C10.134 10.2163 10.3821 10.3821 10.591 10.591L15.75 15.75M14.25 14.25L15.659 12.841C15.8679 12.6321 16.116 12.4663 16.389 12.3533C16.6619 12.2402 16.9545 12.182 17.25 12.182C17.5455 12.182 17.8381 12.2402 18.111 12.3533C18.384 12.4663 18.6321 12.6321 18.841 12.841L21.75 15.75M3.75 19.5H20.25C20.6478 19.5 21.0294 19.342 21.3107 19.0607C21.592 18.7794 21.75 18.3978 21.75 18V6C21.75 5.60218 21.592 5.22064 21.3107 4.93934C21.0294 4.65804 20.6478 4.5 20.25 4.5H3.75C3.35218 4.5 2.97064 4.65804 2.68934 4.93934C2.40804 5.22064 2.25 5.60218 2.25 6V18C2.25 18.3978 2.40804 18.7794 2.68934 19.0607C2.97064 19.342 3.35218 19.5 3.75 19.5ZM14.25 8.25H14.258V8.258H14.25V8.25ZM14.625 8.25C14.625 8.34946 14.5855 8.44484 14.5152 8.51517C14.4448 8.58549 14.3495 8.625 14.25 8.625C14.1505 8.625 14.0552 8.58549 13.9848 8.51517C13.9145 8.44484 13.875 8.34946 13.875 8.25C13.875 8.15054 13.9145 8.05516 13.9848 7.98484C14.0552 7.91451 14.1505 7.875 14.25 7.875C14.3495 7.875 14.4448 7.91451 14.5152 7.98484C14.5855 8.05516 14.625 8.15054 14.625 8.25Z"
      stroke="#F6F7F8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 옷 사진 업로드 안내 — '앨범에서 선택' 진입.
 * 안내 문구 + 하단 "사진 업로드" CTA(기기 네이티브 파일 피커) → 분석 화면.
 */
const ClosetUploadPage = () => {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  // 기기 앨범에서 사진 선택 → 임시로 '옷이 추가되었어요' 바로 이동
  // TODO(API): 업로드/분석 연동 후 /closet/register/analyzing(분석 로딩) 경유로 교체
  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) navigate('/closet/register/added');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        {/* 진행바 300×4 (Figma) + 건너뛰기 */}
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        {/* 안내 문구 — 진행바 아래 156 (Figma Top 263), T3 20 SemiBold */}
        <h1 className="mt-[156px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          옷 사진을 업로드 해주세요
        </h1>

        {/* 사진 업로드 CTA — 바닥 40, bg #1F2124. 클릭 시 네이티브 피커 */}
        <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handlePickFile} />
        <div className="mt-auto px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex h-[58px] w-full items-center justify-center gap-2 rounded-[32px] bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8] cursor-pointer"
          >
            <ImageIcon />
            사진 업로드
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetUploadPage;
