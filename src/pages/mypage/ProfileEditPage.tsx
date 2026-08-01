import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import ClosetBottomNav from '@/features/closet/components/ClosetBottomNav';
import MyPageHeader from '@/features/mypage/components/MyPageHeader';
import profilePlaceholder from '@/assets/images/mypage/profile-placeholder.svg';
import styleMinimal from '@/assets/images/mypage/style-minimal.png';
import styleCasual from '@/assets/images/mypage/style-casual.png';
import styleStreet from '@/assets/images/mypage/style-street.png';
import bodyStraight from '@/assets/images/body/straight.png';
import hangerIcon from '@/assets/images/mypage/hanger.svg';
import chevronRight from '@/assets/images/mypage/chevron-right.svg';

const ProfileEditPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="pb-[110px]">
      <MyPageHeader
        title="프로필 수정"
        showBack
        right={
          <span className="flex items-center gap-1 text-[12px]">
            <img src={hangerIcon} alt="스타" className="h-4 w-4" />
            88개
          </span>
        }
      />
      <div className="space-y-4 px-6 py-6">
        <button
          type="button"
          onClick={() => navigate('/mypage/profile/name')}
          className="flex w-full items-center rounded-[32px] bg-[#1F2124] p-4 text-left text-white"
        >
          <img src={profilePlaceholder} alt="프로필" className="h-[74px] w-[74px]" />
          <div className="ml-4 flex-1">
            <p className="text-[14px] text-[#B2B8BD]">이름</p>
            <p className="text-[20px] font-semibold">이름</p>
            <p className="mt-1 text-[12px] text-[#959BA7]">🔗 Kakao 로그인</p>
          </div>
          <img src={chevronRight} alt="" className="h-6 w-6 brightness-0 invert" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/mypage/profile/style')}
          className="w-full rounded-[16px] bg-[#F6F7F8] p-5 text-left"
        >
          <div className="flex items-center justify-between text-[16px] font-semibold">
            <span>선호하는 스타일</span>
            <img src={chevronRight} alt="" className="h-6 w-6" />
          </div>
          <div className="mt-3 grid grid-cols-[repeat(3,80px)] gap-2">
            {[styleMinimal, styleCasual, styleStreet].map((image) => (
              <img
                key={image}
                src={image}
                alt="선호 스타일"
                className="h-[121px] w-[80px] rounded-[8px] object-cover"
              />
            ))}
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/mypage/profile/body')}
          className="w-full rounded-[16px] bg-[#F6F7F8] p-5 text-left"
        >
          <div className="flex items-center justify-between text-[16px] font-semibold">
            <span>내 체형</span>
            <img src={chevronRight} alt="" className="h-6 w-6" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-[160px] w-[108px] overflow-hidden rounded-[12px] border border-[#E6E8EA] bg-white">
              <img
                src={bodyStraight}
                alt="슬림 스트레이트"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold">슬림 스트레이트</p>
              <p className="mt-12 text-[12px] text-[#959BA7]">
                최근 저장
                <br />
                2026. 05. 28
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/mypage/withdraw')}
          className="w-full py-4 text-[13px] text-[#959BA7] underline"
        >
          회원탈퇴
        </button>
      </div>
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2">
        <ClosetBottomNav />
      </div>
    </PageLayout>
  );
};

export default ProfileEditPage;
