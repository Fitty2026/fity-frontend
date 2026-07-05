interface PhotoUploadBoxProps {
  title?: string;
  description?: string;
  onClick?: () => void;
  /** 업로드된 미리보기 이미지 */
  previewSrc?: string;
  className?: string;
}

const CameraIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

/** 사진 업로드 영역 (점선 박스 + 카메라 아이콘) */
const PhotoUploadBox = ({
  title = '옷 사진을 업로드해주세요',
  description,
  onClick,
  previewSrc,
  className = '',
}: PhotoUploadBoxProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full aspect-square rounded-2xl border-2 border-dashed border-neutral-300',
        'flex flex-col items-center justify-center gap-3 bg-neutral-50 overflow-hidden',
        'hover:border-neutral-400 transition-colors',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {previewSrc ? (
        <img src={previewSrc} alt="업로드 미리보기" className="w-full h-full object-cover" />
      ) : (
        <>
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black">
            <CameraIcon />
          </span>
          <span className="text-sm font-semibold text-black">{title}</span>
          {description && (
            <span className="text-xs text-neutral-400 text-center px-6 whitespace-pre-line">
              {description}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default PhotoUploadBox;
