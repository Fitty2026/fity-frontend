import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import BottomNav from '@/components/layout/BottomNav';
import MyPageHeader from '@/features/mypage/components/MyPageHeader';
import profilePlaceholder from '@/assets/images/mypage/profile-placeholder.svg';
import hangerIcon from '@/assets/images/mypage/hanger.svg';
import usePuzzleBalance from '@/features/puzzle/hooks/usePuzzleBalance';
import likeIcon from '@/assets/images/mypage/menu-like.svg';
import trashIcon from '@/assets/images/mypage/menu-trash.svg';
import starIcon from '@/assets/images/mypage/menu-star.svg';
import settingsIcon from '@/assets/images/mypage/menu-settings.svg';
import helpIcon from '@/assets/images/mypage/menu-help.svg';
import chevronRight from '@/assets/images/mypage/chevron-right.svg';
import useLogout from '@/features/auth/hooks/useLogout';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import ComingSoonModal from '@/features/mypage/components/ComingSoonModal';
import useBodyProfile from '@/features/onboarding/hooks/useBodyProfile';

const menuItems = [
  { label: '좋아요', icon: likeIcon, path: '/myoutfit' },
  { label: '최근 삭제된 코디', icon: trashIcon, path: '/myoutfit/recently-deleted' },
  { label: '스타 충전', icon: starIcon },
  { label: '설정', icon: settingsIcon },
  { label: '고객센터', icon: helpIcon },
] as const;

const MyPage = () => {
  const navigate = useNavigate();
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const puzzleBalance = usePuzzleBalance();
  const logoutMutation = useLogout();
  const { data: profile } = useMyProfile();
  const { data: bodyProfile } = useBodyProfile();
  const bodySummary = bodyProfile?.bodyTypeResult.bodyTypeName
    ? `${bodyProfile.bodyTypeResult.bodyTypeName} 체형`
    : '';
  const styleSummary = profile?.styleTags?.join(' · ') ?? '';
  const profileSummary = [bodySummary, styleSummary].filter(Boolean).join(' | ');

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="pb-[110px]">
      <MyPageHeader
        title="마이"
        right={
          <span className="flex items-center gap-1 text-[12px] font-medium text-[#1F2124]">
            <img src={hangerIcon} alt="스타" className="h-4 w-4" />
            {puzzleBalance ?? 0}개
          </span>
        }
      />
      <section className="flex flex-col items-center px-6 pt-8">
        <img src={profilePlaceholder} alt="프로필" className="h-[120px] w-[120px]" />
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.48px] text-[#1F2124]">
          {profile?.name || '이름'}
        </h2>
        <p className="mt-1 text-[14px] font-medium tracking-[-0.28px] text-[#959BA7]">
          {profileSummary || '프로필 정보를 등록해 주세요'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/mypage/profile')}
          className="mt-5 rounded-[24px] bg-[#F6F7F8] px-4 py-2 text-[14px] font-medium text-[#6F7881]"
        >
          프로필 수정
        </button>
      </section>

      <section className="mx-6 mt-8 rounded-[16px] bg-[#F6F7F8] px-5 py-6">
        <h3 className="text-[16px] font-semibold text-[#1F2124]">스타일 통계</h3>
        <p className="mt-1 text-[12px] font-semibold text-[#6F7881]">6월</p>
        <div className="mt-3 flex items-end justify-between">
          <div className="grid grid-cols-3 divide-x divide-[#CED1D5] text-center">
            {[
              ['옷 등록', '17'],
              ['코디 생성', '11'],
              ['코디 저장', '8'],
            ].map(([label, value]) => (
              <div key={label} className="min-w-[70px] px-2">
                <p className="text-[12px] text-[#959BA7]">{label}</p>
                <p className="mt-2 text-[16px] font-bold text-[#1F2124]">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex h-[76px] items-end gap-3 border-b border-[#CED1D5] px-1">
            {[76, 58, 24].map((height) => (
              <span key={height} style={{ height }} className="w-[6px] rounded-t bg-[#1F2124]" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-6 mb-8 mt-4 overflow-hidden rounded-[8px] bg-[#F6F7F8]">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() =>
              'path' in item && item.path
                ? navigate(item.path)
                : setIsComingSoonOpen(true)
            }
            className="flex h-[56px] w-full items-center border-b border-[#E6E8EA] px-5 text-left last:border-0"
          >
            <span className="w-10">
              <img src={item.icon} alt="" className="h-6 w-6" />
            </span>
            <span className="flex-1 text-[14px] font-semibold text-[#1F2124]">{item.label}</span>
            <img src={chevronRight} alt="" className="h-6 w-6" />
          </button>
        ))}
      </section>
      <button
        type="button"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
        className="mx-auto mb-8 block text-[14px] font-medium text-[#959BA7] underline underline-offset-4 disabled:opacity-50"
      >
        {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
      </button>
      <BottomNav />
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
      />
    </PageLayout>
  );
};
export default MyPage;
