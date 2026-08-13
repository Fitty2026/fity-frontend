import Header from './Header';
import BottomNav from './BottomNav';

interface PageLayoutProps {
  children: React.ReactNode;
  // Header props
  title?: string;
  showBack?: boolean;
  headerRight?: React.ReactNode;
  onBack?: () => void;
  // Layout 옵션
  showHeader?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

/**
 * 모바일 웹앱 기본 레이아웃
 * - 최대 너비 430px (iPhone Pro Max 기준), 중앙 정렬
 * - Header / 콘텐츠 / BottomNav 구조
 */
const PageLayout = ({
  children,
  title,
  showBack = false,
  headerRight,
  onBack,
  showHeader = true,
  showBottomNav = true,
  className = '',
}: PageLayoutProps) => {
  return (
    // 바깥 래퍼 - 전체 화면 배경
    <div className="min-h-screen bg-neutral-50 flex justify-center">
      {/* 모바일 컨테이너 */}
      <div id="app-container" className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col shadow-xl overflow-hidden">
        {showHeader && (
          <Header
            title={title}
            showBack={showBack}
            rightElement={headerRight}
            onBack={onBack}
          />
        )}

        {/* 메인 콘텐츠 - BottomNav 높이(64px)만큼 패딩 */}
        <main
          className={[
            'flex-1 overflow-y-auto',
            showBottomNav ? 'pb-16' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </main>

        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default PageLayout;