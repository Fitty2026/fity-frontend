import { useNavigate } from 'react-router-dom';

import albumIcon from '@/assets/images/mypage/album.svg';
import cameraIcon from '@/assets/images/mypage/camera.svg';
import PageLayout from '@/components/layout/PageLayout';
import MyPageHeader from '@/features/mypage/components/MyPageHeader';
import useBodyProfile from '@/features/onboarding/hooks/useBodyProfile';

const uploadOptions = [
  { icon: cameraIcon, label: '카메라로 촬영', openCamera: true },
  { icon: albumIcon, label: '앨범에서 선택', openCamera: false },
] as const;

const UploadIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2 29V34C2 35.0609 2.42143 36.0783 3.17157 36.8284C3.92172 37.5786 4.93913 38 6 38H34C35.0609 38 36.0783 37.5786 36.8284 36.8284C37.5786 36.0783 38 35.0609 38 34V29M29 11L20 2M20 2L11 11M20 2V29"
      stroke="#1F2124"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BodyEditPage = () => {
  const navigate = useNavigate();
  const { data: bodyProfile } = useBodyProfile();
  const savedBodyType = bodyProfile?.bodyTypeResult.bodyTypeName;

  return (
    <PageLayout
      showBottomNav={false}
      className="flex flex-col"
      customHeader={<MyPageHeader title="체형 수정" showBack />}
    >
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8">
        <div className="flex flex-col items-center text-center" style={{ paddingTop: 88 }}>
          <UploadIcon />
          <h2 className="mt-8 text-[20px] font-semibold leading-[1.5] text-[#1F2124]">
            체형 이미지를
            <br />
            업로드할 방식을 선택해주세요
          </h2>
        </div>

        <div className="mt-auto space-y-3">
          {uploadOptions.map(({ icon, label, openCamera }) => (
            <button
              type="button"
              key={label}
              onClick={() => navigate('/mypage/profile/body/photos', { state: { openCamera } })}
              className="flex h-[80px] w-full items-center gap-10 rounded-[16px] bg-white px-6 text-left shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
            >
              <img src={icon} alt="" className="h-8 w-8" />
              <span className="text-[16px] font-bold text-[#1F2124]">{label}</span>
            </button>
          ))}
        </div>

        {savedBodyType ? (
          <p className="mt-4 text-right text-[12px] text-[#959BA7]">
            저장된 체형 : {savedBodyType}
          </p>
        ) : null}
      </div>
    </PageLayout>
  );
};

export default BodyEditPage;
