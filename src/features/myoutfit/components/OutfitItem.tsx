import type { ClothingCategory, ClothingItem } from '@/types';

interface OutfitItemProps {
  item: ClothingItem | undefined;
  index: number;
  category: ClothingCategory;
}

const OutfitItem = ({ item, index,category }: OutfitItemProps) => {
  return (
    <div
      className={`retouch-item-enter rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]`}
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <div className={`h-[48px] w-[48px] object-cover ${item? "": "bg-[#E6E8EA]"} flex justify-center`}>
        <img className="object-cover h-full" src={item?.imageUrl}></img>
      </div>
      <div className="pl-[16px]">
        <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
          {category}
        </p>
        <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          {item ? item?.id : "-"}
        </h5>
      </div>
    </div>
  );
};

export default OutfitItem;
