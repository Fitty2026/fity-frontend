import { useState } from 'react';

import BottomSheet from '@/components/ui/BottomSheet';

const RECOMMENDED_TAGS = [
  '#미니멀',
  '#캐주얼',
  '#데일리',
  '#스트리트',
  '#꾸안꾸',
  '#포멀',
  '#출근룩',
  '#데이트',
];

export const MAX_TAG_COUNT = 5;

interface TagAddBottomSheetProps {
  isOpen: boolean;
  currentTags: string[];
  onClose: () => void;
  onAddTag: (tag: string) => void;
}

const TagAddBottomSheet = ({ isOpen, currentTags, onClose, onAddTag }: TagAddBottomSheetProps) => {
  const [customTag, setCustomTag] = useState('');
  const isMaxReached = currentTags.length >= MAX_TAG_COUNT;

  const handleAddCustomTag = () => {
    const tagName = customTag.trim().replace(/^#+/, '');
    if (!tagName || isMaxReached) return;

    onAddTag(`#${tagName}`);
    setCustomTag('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="태그 추가">
      <div className="select-none">
        <div className="flex items-center justify-between">
          <h4 className="text-[14px] font-[600] text-[#1F2124]">추천 태그</h4>
          <span className="text-[12px] font-[500] text-[#6F7881]">
            {currentTags.length}/{MAX_TAG_COUNT}
          </span>
        </div>
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          {RECOMMENDED_TAGS.map((tag) => {
            const isAdded = currentTags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                disabled={isAdded || isMaxReached}
                onClick={() => onAddTag(tag)}
                className={`${isAdded || isMaxReached ? 'border-[#B2B8BD] bg-[#E6E8EA] text-[#959BA7]' : 'border-[#34363C] bg-white text-[#34363C]'} rounded-[32px] border px-[12px] py-[6px] text-[14px] font-[500]`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <h4 className="mt-[24px] text-[14px] font-[600] text-[#1F2124]">직접 입력</h4>
        <div className="mt-[8px] flex gap-[8px]">
          <input
            value={customTag}
            disabled={isMaxReached}
            onChange={(event) => setCustomTag(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAddCustomTag();
            }}
            placeholder={
              isMaxReached ? '태그는 최대 5개까지 추가할 수 있어요' : '태그를 입력해주세요'
            }
            className="min-w-0 flex-1 rounded-[8px] border border-[#CED1D5] px-[12px] py-[10px] text-[14px] outline-none focus:border-[#34363C] disabled:bg-[#F6F7F8]"
          />
          <button
            type="button"
            disabled={isMaxReached || !customTag.trim()}
            onClick={handleAddCustomTag}
            className="shrink-0 rounded-[8px] bg-[#1F2124] px-[16px] text-[14px] font-[600] text-white disabled:bg-[#E6E8EA] disabled:text-[#959BA7]"
          >
            추가
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default TagAddBottomSheet;
