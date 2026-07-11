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
      className={[
        // Figma: Fill350 / Hug100 / radius12 / border 1px #E5E5E5 / padding16 / gap16 / bg #FFFFFF
        'flex items-start gap-4 p-4 min-h-[100px] rounded-xl border border-[#E5E5E5] bg-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Figma: 아이콘 박스 Fixed 48×48 / radius 8 / bg #F3F3F4 */}
      <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#F3F3F4] text-black shrink-0">
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        {/* 제목: 16/500/lh24/#1A1C1C */}
        <span className="text-base font-medium leading-6 text-[#1A1C1C]">{title}</span>
        {/* 설명: 14/500/lh21/#4C4546 */}
        {description && (
          <span className="whitespace-pre-line text-sm font-medium leading-[21px] text-[#4C4546]">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

export default PermissionItem;
