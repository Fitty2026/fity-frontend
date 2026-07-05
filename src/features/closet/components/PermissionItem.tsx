interface PermissionItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

/**
 * 권한 안내 항목 (구매 내역 조회 / 인증된 데이터 처리 등)
 * - 선택 없음, 아이콘 + 제목 + 설명
 */
const PermissionItem = ({ icon, title, description, className = '' }: PermissionItemProps) => {
  return (
    <div
      className={['flex items-start gap-3 p-4 rounded-2xl bg-neutral-50', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-black shrink-0">
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-black">{title}</span>
        {description && <span className="text-xs text-neutral-500">{description}</span>}
      </div>
    </div>
  );
};

export default PermissionItem;
