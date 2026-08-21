import PhotoCarousel from './PhotoCarousel';

interface AnalyzeFailViewProps {
  /** 올렸던 사진 objectURL들 (빈 슬롯 제외) */
  photos: string[];
  /** 유입 분기 — 문구·버튼이 달라진다 */
  mode: 'camera' | 'upload';
  onRetry: () => void;
}

/**
 * 체형 분석 실패(전신 인식 불가) 안내 — 올린 사진을 빨간 테두리로 보여주고 재촬영/재업로드 유도.
 * TODO: 서버 실패 응답에 문제 사진 index가 추가되면 해당 사진만 highlighted 처리
 */
const AnalyzeFailView = ({ photos, mode, onRetry }: AnalyzeFailViewProps) => (
  <div className="flex flex-1 flex-col pb-8 pt-10">
    <h2 className="px-6 text-center text-lg font-semibold">
      전신이 잘 나오도록 다시 {mode === 'camera' ? '촬영해주세요' : '업로드해주세요'}
    </h2>
    <p className="mt-1 px-6 text-center text-sm text-neutral-400">
      머리부터 발끝까지 한 화면에 모두 보여야 해요
    </p>
    <div className="mt-6 overflow-hidden">
      <PhotoCarousel imageSrcs={photos} fit="cover" highlighted={photos.map(() => true)} />
    </div>
    <div className="mt-auto px-6 pt-6">
      <button
        type="button"
        onClick={onRetry}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white"
      >
        {mode === 'camera' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5-8 8" />
          </svg>
        )}
        {mode === 'camera' ? '다시 촬영하기' : '다시 업로드하기'}
      </button>
    </div>
  </div>
);

export default AnalyzeFailView;
