import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: '홈',
    path: '/home',
    icon: (color: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
        <path d="M9 21v-9h6v9" />
      </svg>
    ),
  },
  {
    label: '스튜디오',
    path: '/styling',
    icon: (color: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: '옷장',
    path: '/closet',
    icon: (color: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7.2 3.6 14.9a1.8 1.8 0 0 0 1.2 3.1h14.4a1.8 1.8 0 0 0 1.2-3.1L12 7.2Z" />
        <path d="M12 7.2v-1a2.3 2.3 0 1 1 2.3-2.3" />
      </svg>
    ),
  },
  {
    label: '마이',
    path: '/mypage',
    icon: (color: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

/**
 * 스튜디오 플로우 하단 네비 — 플로팅 알약(pill) 형태
 * - Figma: 351×66 Hug, 흰 배경 + 그림자, 홈/스튜디오/옷장/마이
 * - app-container(max-w-430) 기준 하단 고정
 */
const StudioBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-30 pointer-events-none">
      <ul className="pointer-events-auto flex items-center justify-around h-[66px] rounded-full bg-white shadow-[0_4px_20px_rgba(31,33,36,0.10)] border border-[#F0F1F3]">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.path);
          const color = active ? '#1F2124' : '#B2B8BD';
          return (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1"
              >
                {item.icon(color)}
                <span className="text-[10px] font-medium" style={{ color }}>
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
