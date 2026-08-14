import type { ClothingItem } from '../../../types';

interface RetouchItemProps {
  item: ClothingItem;
  isSelected: boolean;
  animationClassName: string;
  animationDelay: string;
  onClick: () => void;
}

const RetouchItem = ({
  item,
  isSelected,
  animationClassName,
  animationDelay,
  onClick,
}: RetouchItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`${isSelected ? 'bg-[#E6E8EA]' : 'bg-[#F6F7F8]'} ${animationClassName} rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]`}
      style={{ animationDelay }}
    >
      <div className="h-[48px] w-[48px] object-cover">
        {item.imageUrl ? (
          <img className="object-cover h-full" src={item.imageUrl}></img>
        ) : (
          <div className="h-full w-full bg-[#E6E8EA]" />
        )}
      </div>
      <div className="pl-[8px]">
        <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
          {item.category}
        </p>
        <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          {item.name || item.id || '-'}
        </h5>
      </div>
    </div>
  );
};

export default RetouchItem;
