interface EmptyClosetStateProps {
  title?: string;
  description?: string;
  /** 하단 액션 영역 (RegisterOptionRow 등) */
  children?: React.ReactNode;
}

/**
 * 빈 옷장 상태 — 점선 원 아이콘 + 안내 문구 + 액션.
 * 사용처: 내 옷장 홈(비어있음).
 */
const EmptyClosetState = ({
  title = '아직 등록된 옷이 없어요',
  description = '첫 번째 옷을 추가하고\n나만의 스타일 데이터를 쌓아보세요',
  children,
}: EmptyClosetStateProps) => {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-dashed border-neutral-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-neutral-900">{title}</p>
        <p className="mt-1 text-sm text-neutral-500 whitespace-pre-line">{description}</p>
      </div>
      {children && <div className="w-full flex flex-col gap-3 mt-2">{children}</div>}
    </div>
  );
};

export default EmptyClosetState;
