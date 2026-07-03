import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: '홈',
    path: '/home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'black' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: '스튜디오',
    path: '/styling',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? 'black' : 'none'} />
        <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? 'black' : 'none'} />
        <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? 'black' : 'none'} />
        <rect x="14" y="14" width="7" height="7" rx="1" fill={active ? 'black' : 'none'} />
      </svg>
    ),
  },
  {
    label: '내 코디',
    path: '/myoutfit',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={active ? 'black' : 'none'} />
      </svg>
    ),
  },
  {
    label: '마이',
    path: '/mypage',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" fill={active ? 'black' : 'none'} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-neutral-100 z-30">
      <ul className="flex items-center justify-around h-16 pb-safe">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.path);
          return (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 min-w-[60px] py-1"
                aria-label={item.label}
              >
                {item.icon(active)}
                <span
                  className={`text-[10px] font-medium ${active ? 'text-black' : 'text-neutral-400'}`}
                >
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

export default BottomNav;