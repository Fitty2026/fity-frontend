import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import ClosetBottomNav from '@/features/closet/components/ClosetBottomNav';
import MyPageHeader from '@/features/mypage/components/MyPageHeader';
import profilePlaceholder from '@/assets/images/mypage/profile-placeholder.svg';
import hangerIcon from '@/assets/images/mypage/hanger.svg';
import usePuzzleStore from '@/store/puzzleStore';
import chevronRight from '@/assets/images/mypage/chevron-right.svg';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import useBodyProfile from '@/features/onboarding/hooks/useBodyProfile';
import { STYLE_TILES } from '@/features/onboarding/constants';
import { BODY_TYPES } from '@/features/onboarding/bodyConstants';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const puzzleBalance = usePuzzleStore((state) => state.balance);
  const { data: profile } = useMyProfile();
  const { data: bodyProfile } = useBodyProfile();
  const selectedStyles = STYLE_TILES.filter((style) =>
    profile?.styleTagIds.includes(style.tagId),
  );
  const bodyType = bodyProfile?.bodyTypeResult.bodyType.toLowerCase();
  const selectedBody = BODY_TYPES.find((body) => bodyType?.includes(body.type));
  const updatedAt = bodyProfile?.updatedAt
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(bodyProfile.updatedAt))
    : null;

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="pb-[110px]">
      <MyPageHeader
        title="프로필 수정"
        showBack
        right={
          <span className="flex items-center gap-1 text-[12px]">
            <img src={hangerIcon} alt="스타" className="h-4 w-4" />
            {puzzleBalance}개
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
            <p className="text-[20px] font-semibold">{profile?.name || '이름'}</p>
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
          {selectedStyles.length > 0 ? (
            <div className="mt-3 grid grid-cols-[repeat(3,80px)] gap-2">
              {selectedStyles.slice(0, 3).map((style) => (
                <img
                  key={style.tagId}
                  src={style.imageSrc}
                  alt={style.tag}
                  className="h-[121px] w-[80px] rounded-[8px] object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[14px] text-[#959BA7]">등록된 선호 스타일이 없습니다.</p>
          )}
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
          {bodyProfile ? (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-[160px] w-[108px] overflow-hidden rounded-[12px] border border-[#E6E8EA] bg-white">
                {selectedBody ? (
                  <img
                    src={selectedBody.imageSrc}
                    alt={bodyProfile.bodyTypeResult.bodyTypeName}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-[14px] font-semibold">
                  {bodyProfile.bodyTypeResult.bodyTypeName}
                </p>
                {updatedAt ? (
                  <p className="mt-12 text-[12px] text-[#959BA7]">
                    최근 저장
                    <br />
                    {updatedAt}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-[14px] text-[#959BA7]">등록된 체형 정보가 없습니다.</p>
          )}
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
