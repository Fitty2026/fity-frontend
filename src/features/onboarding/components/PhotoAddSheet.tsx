import { useRef } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';

interface PhotoAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 촬영/선택한 파일의 objectURL을 전달 */
  onSelect: (url: string) => void;
}

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

const AlbumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9" r="1.5" />
    <path d="M21 16l-5-5-9 9" />
  </svg>
);

/** 체형 사진 추가 바텀시트 — 카메라 촬영 / 앨범 선택으로 한 장 선택 */
const PhotoAddSheet = ({ isOpen, onClose, onSelect }: PhotoAddSheetProps) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 onChange가 발생하도록 초기화
    e.target.value = '';
    if (!file) return;
    onSelect(URL.createObjectURL(file));
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="사진 추가">
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex h-14 w-full items-center gap-4 text-left text-neutral-800"
        >
          <CameraIcon />
          <span className="text-base font-medium">카메라로 촬영</span>
        </button>
        <button
          type="button"
          onClick={() => albumInputRef.current?.click()}
          className="flex h-14 w-full items-center gap-4 text-left text-neutral-800"
        >
          <AlbumIcon />
          <span className="text-base font-medium">앨범에서 선택</span>
        </button>
      </div>

      {/* 카메라: 모바일에서 후면 카메라 직접 실행 (데스크톱은 파일창) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <input ref={albumInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </BottomSheet>
  );
};

export default PhotoAddSheet;
