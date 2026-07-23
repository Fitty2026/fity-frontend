import BottomSheet from '@/components/ui/BottomSheet';

import type { ClothingCategory } from '../../../types';

const CATEGORIES: ClothingCategory[] = [
  '상의',
  '하의',
  '아우터',
  '신발',
  '가방',
  '액세서리',
  '기타',
];

interface AddItemBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: ClothingCategory) => void;
}

const AddItemBottomSheet = ({ isOpen, onClose, onSelect }: AddItemBottomSheetProps) => {
  const handleSelect = (category: ClothingCategory) => {
    onSelect(category);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="카테고리 선택">
      <div className="flex select-none flex-col gap-[8px]">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleSelect(category)}
            className="w-full rounded-[8px] bg-[#F6F7F8] px-[16px] py-[14px] text-left text-[15px] font-[500] text-[#1F2124]"
          >
            {category}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};

export default AddItemBottomSheet;
