import type { ClothingCategory, ClothingItem } from '@/types';

interface OutfitItemProps {
  item: ClothingItem | undefined;
  category: ClothingCategory;
  index: number;
}

const OutfitItem = ({ item, category, index }: OutfitItemProps) => {
  return (
    <div
      className={`retouch-item-enter rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]`}
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <div className="h-[48px] w-[48px] aspect-1/1 object-cover flex justify-center">
        {item?.imageUrl ? (
          <img className="object-cover h-full" src={item.imageUrl}></img>
        ) : (
          <div className="h-full w-full bg-[#E6E8EA]" />
        )}
      </div>
      <div className="pl-[16px]">
        <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
          {category}
        </p>
        <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          {item?.name || '-'}
        </h5>
      </div>
    </div>
  );
};

export default OutfitItem;
