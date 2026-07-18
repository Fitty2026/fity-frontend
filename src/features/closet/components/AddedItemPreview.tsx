interface AddedItemPreviewProps {
  imageUrl: string;
  /** 중앙 아이템 뒤로 살짝 보이는 양옆 아이템 */
  sideImages?: string[];
  /** 상단 체크 아이콘 노출 */
  showCheck?: boolean;
  message?: string;
}

/**
 * "옷이 추가되었어요" 미리보기 — 중앙 아이템 + 양옆 살짝 보이는 아이템 + 체크.
 * 사용처: 태그 확인 및 수정 화면.
 */
const AddedItemPreview = ({
  imageUrl,
  sideImages = [],
  showCheck = false,
  message = '옷이 추가되었어요',
}: AddedItemPreviewProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-base font-medium text-neutral-800">{message}</p>

      {showCheck && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 6" />
        </svg>
      )}

      <div className="relative flex items-center justify-center w-full">
        {sideImages[0] && (
          <img
            src={sideImages[0]}
            alt=""
            className="absolute left-2 w-20 h-28 object-cover rounded-xl opacity-60 -rotate-6"
          />
        )}
        <img
          src={imageUrl}
          alt="추가된 옷"
          className="relative z-10 w-40 h-52 object-cover rounded-2xl shadow-md"
        />
        {sideImages[1] && (
          <img
            src={sideImages[1]}
            alt=""
            className="absolute right-2 w-20 h-28 object-cover rounded-xl opacity-60 rotate-6"
          />
        )}
      </div>
    </div>
  );
};

export default AddedItemPreview;
