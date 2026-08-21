import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import BottomNav from '@/components/layout/BottomNav';
import PuzzleTopBar from '@/components/layout/PuzzleTopBar';
import profilePlaceholder from '@/assets/images/mypage/profile-placeholder.svg';
import likeIcon from '@/assets/images/mypage/menu-like.svg';
import trashIcon from '@/assets/images/mypage/menu-trash.svg';
import starIcon from '@/assets/images/mypage/menu-star.svg';
import settingsIcon from '@/assets/images/mypage/menu-settings.svg';
import helpIcon from '@/assets/images/mypage/menu-help.svg';
import chevronRight from '@/assets/images/mypage/chevron-right.svg';
import useLogout from '@/features/auth/hooks/useLogout';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import useClosets from '@/features/closet/hooks/useClosets';
import ComingSoonModal from '@/features/mypage/components/ComingSoonModal';
import useMyOutfits from '@/features/myoutfit/hooks/useMyOutfits';
import useBodyProfile from '@/features/onboarding/hooks/useBodyProfile';

const LookbookIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 20.292C13.6484 18.8134 15.7856 17.997 18 18C19.0218 17.9989 20.0364 18.172 21 18.512V4.26201C20.062 3.93001 19.052 3.75001 18 3.75001C15.7856 3.74686 13.6483 4.56328 12 6.04201C10.3516 4.56337 8.2144 3.74695 6 3.75001C4.948 3.75001 3.938 3.93001 3 4.26201V18.512C3.96362 18.172 4.97816 17.9989 6 18C8.305 18 10.408 18.867 12 20.292ZM12 6.04201V20.292"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WithdrawIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 22 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9.97095 7.31877L7.89395 6.11977L6.35795 5.23277M6.35795 5.23277C6.1624 5.57671 5.90076 5.87857 5.58807 6.12098C5.27539 6.36338 4.91785 6.54154 4.53603 6.6452C4.15421 6.74886 3.75566 6.77598 3.36332 6.72498C2.97098 6.67399 2.5926 6.54589 2.24997 6.34806C1.90734 6.15024 1.60722 5.8866 1.36689 5.57231C1.12657 5.25803 0.95078 4.89931 0.849653 4.51681C0.748527 4.13431 0.724058 3.73559 0.777656 3.3436C0.831253 2.95161 0.961857 2.57409 1.16195 2.23277C1.5626 1.54935 2.21731 1.05215 2.98319 0.849661C3.74908 0.647173 4.56397 0.755841 5.25003 1.15195C5.9361 1.54806 6.43763 2.19945 6.6452 2.96398C6.85276 3.72851 6.7495 4.5441 6.35795 5.23277ZM7.89395 6.11977C8.21794 6.30665 8.488 6.57427 8.6778 6.89655C8.86759 7.21884 8.97066 7.5848 8.97695 7.95877C8.98195 8.30977 9.03095 8.65377 9.11695 8.98277M9.11695 8.98277C9.03095 9.31277 8.98195 9.65577 8.97695 10.0078C8.97049 10.3816 8.86734 10.7473 8.67755 11.0694C8.48776 11.3915 8.2178 11.659 7.89395 11.8458M9.97095 10.6468L12.853 8.98277L20.6469 4.48277L19.844 4.26777C19.0295 4.04982 18.1702 4.06507 17.364 4.31177L12.039 5.93977C11.2295 6.18708 10.5104 6.66657 9.97095 7.31877C9.56846 7.8046 9.27699 8.37252 9.11695 8.98277M9.97095 10.6468L7.89395 11.8458L6.35795 12.7328M6.35795 12.7328C6.55804 13.0741 6.68865 13.4516 6.74225 13.8436C6.79584 14.2356 6.77137 14.6343 6.67025 15.0168C6.56912 15.3993 6.39333 15.758 6.15301 16.0723C5.91268 16.3866 5.61257 16.6502 5.26993 16.8481C4.9273 17.0459 4.54892 17.174 4.15658 17.225C3.76424 17.276 3.36569 17.2489 2.98387 17.1452C2.60205 17.0415 2.24451 16.8634 1.93183 16.621C1.61914 16.3786 1.3575 16.0767 1.16195 15.7328C0.7704 15.0441 0.66714 14.2285 0.874704 13.464C1.08227 12.6995 1.58381 12.0481 2.26987 11.6519C2.95593 11.2558 3.77082 11.1472 4.53671 11.3497C5.30259 11.5521 5.9573 12.0494 6.35795 12.7328ZM9.97095 10.6468C10.5105 11.2989 11.2295 11.7784 12.039 12.0258L17.365 13.6548C18.1713 13.9012 19.0306 13.916 19.8449 13.6978L20.6469 13.4828L12.853 8.98277"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const menuItems = [
  { label: '룩북', Icon: LookbookIcon, path: '/myoutfit' },
  { label: '좋아요', icon: likeIcon, path: '/myoutfit?liked=true' },
  { label: '최근 삭제된 코디', icon: trashIcon, path: '/myoutfit/recently-deleted' },
  { label: '스타 충전', icon: starIcon },
  { label: '설정', icon: settingsIcon },
  { label: '고객센터', icon: helpIcon },
  { label: '회원 탈퇴', Icon: WithdrawIcon, path: '/mypage/withdraw' },
] as const;

const MyPage = () => {
  const navigate = useNavigate();
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [isStatsAnimated, setIsStatsAnimated] = useState(false);
  const logoutMutation = useLogout();
  const { data: profile } = useMyProfile();
  const { data: bodyProfile } = useBodyProfile();
  const { data: closet, isPending: isClosetPending } = useClosets();
  const { data: outfits, isPending: isOutfitsPending } = useMyOutfits();
  const styleStats = [
    { label: '옷 개수', value: closet?.items.length ?? 0 },
    { label: '코디 생성', value: 0 },
    { label: '코디 개수', value: outfits?.pages[0]?.total ?? 0 },
  ];
  const maxStyleStat = Math.max(...styleStats.map(({ value }) => value), 1);
  const bodySummary = bodyProfile?.bodyTypeResult.bodyTypeName
    ? `${bodyProfile.bodyTypeResult.bodyTypeName} 체형`
    : '';
  const styleSummary = profile?.styleTags?.join(' · ') ?? '';
  const profileSummary = [bodySummary, styleSummary].filter(Boolean).join(' | ');

  useEffect(() => {
    if (isClosetPending || isOutfitsPending) return;

    const animationFrame = requestAnimationFrame(() => setIsStatsAnimated(true));
    return () => cancelAnimationFrame(animationFrame);
  }, [isClosetPending, isOutfitsPending]);

  return (
    <PageLayout
      showHeader={false}
      showBottomNav={false}
      className="flex min-h-0 flex-col overflow-hidden"
    >
      <PuzzleTopBar title="마이" showBack={false} />
      <div className="min-h-0 flex-1 overflow-y-auto pb-[110px]">
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
          <p className="mt-1 text-[12px] font-semibold text-[#6F7881]">누적</p>
          <div className="mt-3 flex items-end justify-between">
            <div className="grid grid-cols-3 divide-x divide-[#CED1D5] text-center">
              {styleStats.map(({ label, value }) => (
                <div key={label} className="min-w-[70px] px-2">
                  <p className="text-[12px] text-[#959BA7]">{label}</p>
                  <p className="mt-2 text-[16px] font-bold text-[#1F2124]">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex h-[76px] items-end gap-3 border-b border-[#CED1D5] px-1">
              {styleStats.map(({ label, value }, index) => (
                <span
                  key={label}
                  style={{
                    height: isStatsAnimated
                      ? value === 0
                        ? 6
                        : `${Math.max((value / maxStyleStat) * 76, 6)}px`
                      : 0,
                    transitionDelay: isStatsAnimated ? `${index * 90}ms` : '0ms',
                  }}
                  className="w-[6px] rounded-t bg-[#1F2124] transition-[height] duration-700 ease-out motion-reduce:transition-none"
                />
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
                'path' in item && item.path ? navigate(item.path) : setIsComingSoonOpen(true)
              }
              className="flex h-[56px] w-full items-center border-b border-[#E6E8EA] px-5 text-left last:border-0"
            >
              <span className="flex w-10 items-center">
                {'Icon' in item ? (
                  <item.Icon />
                ) : (
                  <img src={item.icon} alt="" className="h-6 w-6" />
                )}
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
      </div>
      <BottomNav />
      <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
    </PageLayout>
  );
};
export default MyPage;
