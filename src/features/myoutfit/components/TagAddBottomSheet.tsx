import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const RECOMMENDED_TAGS = ['#미니멀', '#캐주얼', '#데일리', '#스트리트'];

export const MAX_TAG_COUNT = 5;

interface TagAddBottomSheetProps {
  isOpen: boolean;
  currentTags: string[];
  onClose: () => void;
  onComplete: (tags: string[]) => void;
}

const normalizeTag = (value: string) => {
  const name = value.trim().replace(/^#+/, '');
  return name ? `#${name}` : '';
};

const TagAddBottomSheet = ({
  isOpen,
  currentTags,
  onClose,
  onComplete,
}: TagAddBottomSheetProps) => {
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const isDragging = useRef(false);

  if (isOpen && !visible) {
    setVisible(true);
    setSelectedTags(currentTags.map(normalizeTag).filter(Boolean).slice(0, MAX_TAG_COUNT));
  }
  if (!isOpen && animated) setAnimated(false);

  useEffect(() => {
    if (!isOpen) return;

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || !visible) return;
    const timer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen, visible]);

  const addCustomTag = () => {
    const tag = normalizeTag(customTag);
    if (!tag || selectedTags.includes(tag) || selectedTags.length >= MAX_TAG_COUNT) return;

    setSelectedTags((tags) => [...tags, tag]);
    setCustomTag('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((tags) => {
      if (tags.includes(tag)) return tags.filter((selectedTag) => selectedTag !== tag);
      if (tags.length >= MAX_TAG_COUNT) return tags;
      return [...tags, tag];
    });
  };

  const handleComplete = () => {
    const pendingTag = normalizeTag(customTag);
    const completedTags =
      pendingTag && !selectedTags.includes(pendingTag) && selectedTags.length < MAX_TAG_COUNT
        ? [...selectedTags, pendingTag]
        : selectedTags;

    onComplete(completedTags);
    setCustomTag('');
    onClose();
  };

  const onDragStart = (clientY: number) => {
    isDragging.current = true;
    dragStartY.current = clientY;
    dragCurrentY.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };

  const onDragMove = (clientY: number) => {
    if (!isDragging.current) return;
    const delta = clientY - dragStartY.current;
    if (delta < 0) return;
    dragCurrentY.current = delta;
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${delta}px)`;
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sheetRef.current) sheetRef.current.style.transition = '';

    if (dragCurrentY.current > 150) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  if (!visible) return null;

  const visibleTags = [...new Set([...selectedTags, ...RECOMMENDED_TAGS])];
  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="태그 추가 닫기"
        className="absolute inset-0 z-40 bg-black/50 transition-opacity duration-300"
        style={{ opacity: animated ? 1 : 0 }}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tag-sheet-title"
        className="absolute bottom-0 left-0 z-50 h-[min(425px,calc(100dvh-16px))] w-full rounded-t-[56px] bg-[#F6F7F8] shadow-[0_-1px_16px_rgba(0,0,0,0.16)] transition-transform duration-300 ease-out"
        style={{ transform: animated ? 'translateY(0)' : 'translateY(100%)' }}
        onMouseMove={(event) => onDragMove(event.clientY)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        <div
          className="absolute inset-x-0 top-0 h-10 cursor-grab rounded-t-[56px] active:cursor-grabbing"
          onTouchStart={(event) => onDragStart(event.touches[0].clientY)}
          onTouchMove={(event) => onDragMove(event.touches[0].clientY)}
          onTouchEnd={onDragEnd}
          onMouseDown={(event) => onDragStart(event.clientY)}
        />

        <h3
          id="tag-sheet-title"
          className="pt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]"
        >
          태그 추가
        </h3>

        <div className="px-6 pt-[37px]">
          <div className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M13 13L10.6903 10.6903M10.6903 10.6903C11.3154 10.0652 11.6666 9.21721 11.6666 8.33334C11.6666 7.44946 11.3154 6.60144 10.6903 5.97631C10.0652 5.35118 9.21721 5 8.33334 5C7.44946 5 6.60144 5.35118 5.97631 5.97631C5.35118 6.60144 5 7.44946 5 8.33334C5 9.21721 5.35118 10.0652 5.97631 10.6903C6.60144 11.3154 7.44946 11.6666 8.33334 11.6666C9.21721 11.6666 10.0652 11.3154 10.6903 10.6903Z"
                stroke="#959BA7"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              value={customTag}
              onChange={(event) => setCustomTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addCustomTag();
              }}
              placeholder="태그를 검색하거나 직접 입력해주세요"
              className="h-9 w-full rounded-[18px] border border-[#959BA7] bg-transparent pr-4 pl-[39px] text-[12px] font-medium tracking-[-0.02em] text-[#34363C] outline-none placeholder:text-[#B2B8BD] focus:border-[#34363C]"
            />
          </div>

          <div className="mt-[58px] flex items-center justify-between">
            <h4 className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
              추천 태그
            </h4>
            <span className="text-[12px] font-medium text-[#959BA7]">
              {selectedTags.length}/{MAX_TAG_COUNT}
            </span>
          </div>

          <div className="mt-3 flex max-h-[68px] flex-wrap gap-2 overflow-y-auto">
            {visibleTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleTag(tag)}
                  className={`${isSelected ? 'border-[#1F2124] bg-[#1F2124] text-[#F6F7F8]' : 'border-[#34363C] bg-transparent text-[#34363C]'} h-[30px] rounded-[15px] border px-3 text-[14px] font-medium leading-none tracking-[-0.02em]`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          className="absolute right-6 bottom-10 left-6 h-[58px] rounded-[29px] bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
        >
          완료
        </button>
      </div>
    </>,
    container,
  );
};

export default TagAddBottomSheet;
