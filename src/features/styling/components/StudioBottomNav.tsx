import { useNavigate } from 'react-router-dom';

/** 하단 탭 항목 — 아이콘은 currentColor로 active/inactive 색 전환 */
const NAV_ITEMS = [
  {
    label: '홈',
    path: '/home',
    icon: (
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM0 18V6L8 0L16 6V18H9V12H7V18H0Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: '스튜디오',
    path: '/styling',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10ZM2 6H6V2H2V6ZM12 6H16V2H12V6ZM12 16H16V12H12V16ZM2 16H6V12H2V16Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: '옷장',
    path: '/closet',
    icon: (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 16C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15C0 14.8333 0.0333333 14.6792 0.1 14.5375C0.166667 14.3958 0.266667 14.2833 0.4 14.2L9 7.75V6C9 5.71667 9.1 5.47917 9.3 5.2875C9.5 5.09583 9.74167 5 10.025 5C10.4417 5 10.7917 4.85 11.075 4.55C11.3583 4.25 11.5 3.89167 11.5 3.475C11.5 3.05833 11.3542 2.70833 11.0625 2.425C10.7708 2.14167 10.4167 2 10 2C9.58333 2 9.22917 2.14583 8.9375 2.4375C8.64583 2.72917 8.5 3.08333 8.5 3.5H6.5C6.5 2.53333 6.84167 1.70833 7.525 1.025C8.20833 0.341667 9.03333 0 10 0C10.9667 0 11.7917 0.3375 12.475 1.0125C13.1583 1.6875 13.5 2.50833 13.5 3.475C13.5 4.25833 13.2708 4.95833 12.8125 5.575C12.3542 6.19167 11.75 6.61667 11 6.85V7.75L19.6 14.2C19.7333 14.2833 19.8333 14.3958 19.9 14.5375C19.9667 14.6792 20 14.8333 20 15C20 15.2833 19.9042 15.5208 19.7125 15.7125C19.5208 15.9042 19.2833 16 19 16H1ZM4 14H16L10 9.5L4 14Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: '내 코디',
    path: '/myoutfit',
    icon: (
      <svg width="17.6" height="17.6" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.8 8.8C7.59 8.8 6.55417 8.36917 5.6925 7.5075C4.83083 6.64583 4.4 5.61 4.4 4.4C4.4 3.19 4.83083 2.15417 5.6925 1.2925C6.55417 0.430833 7.59 0 8.8 0C10.01 0 11.0458 0.430833 11.9075 1.2925C12.7692 2.15417 13.2 3.19 13.2 4.4C13.2 5.61 12.7692 6.64583 11.9075 7.5075C11.0458 8.36917 10.01 8.8 8.8 8.8ZM0 17.6V14.52C0 13.8967 0.160417 13.3238 0.48125 12.8013C0.802083 12.2787 1.22833 11.88 1.76 11.605C2.89667 11.0367 4.05167 10.6104 5.225 10.3263C6.39833 10.0421 7.59 9.9 8.8 9.9C10.01 9.9 11.2017 10.0421 12.375 10.3263C13.5483 10.6104 14.7033 11.0367 15.84 11.605C16.3717 11.88 16.7979 12.2787 17.1188 12.8013C17.4396 13.3238 17.6 13.8967 17.6 14.52V17.6H0Z" fill="currentColor" />
      </svg>
    ),
  },
];

interface StudioBottomNavProps {
  /** 현재 활성 탭 경로 (예: '/styling') */
  activePath: string;
  className?: string;
}

/**
 * 하단 탭바 (홈/스튜디오/옷장/내 코디) — 코디 생성 플로우용
 * - closet/ClosetHomePage 페이지-로컬 탭바를 공통 컴포넌트로 복제 (closet 쪽은 유지)
 * - 아이콘 currentColor: active=검정 / inactive=#A7A7AF, 높이 80
 */
const StudioBottomNav = ({ activePath, className = '' }: StudioBottomNavProps) => {
  const navigate = useNavigate();

  return (
    <nav
      className={['shrink-0 h-20 bg-white border-t border-[#E5E5E5]', className]
        .filter(Boolean)
        .join(' ')}
    >
      <ul className="flex items-center justify-around h-full">
        {NAV_ITEMS.map((item) => {
          const active = item.path === activePath;
          return (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 min-w-[60px] bg-transparent! ${
                  active ? 'text-black' : 'text-[#A7A7AF]'
                }`}
                aria-label={item.label}
              >
                <span className="flex items-center justify-center h-[18px]">{item.icon}</span>
                <span className="text-[10px] font-medium leading-[15px] tracking-[-0.5px]">
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default StudioBottomNav;
