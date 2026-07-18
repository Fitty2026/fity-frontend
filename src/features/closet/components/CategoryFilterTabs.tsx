interface CategoryFilterTabsProps {
  tabs: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

/**
 * 카테고리 필터 탭 (가로 스크롤 pill).
 * 사용처: 내 옷장 홈 카테고리, 아이템 목록 전체보기 필터.
 */
const CategoryFilterTabs = ({ tabs, activeKey, onChange, className = '' }: CategoryFilterTabsProps) => {
  return (
    <div className={['flex gap-2 overflow-x-auto no-scrollbar', className].filter(Boolean).join(' ')}>
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={[
              'shrink-0 px-4 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer',
              active
                ? 'bg-black text-white'
                : 'bg-white text-neutral-500 border border-neutral-200',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilterTabs;
