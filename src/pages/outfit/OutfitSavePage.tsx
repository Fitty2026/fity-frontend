import { type FormEvent, useState } from 'react';

import PageLayout from '@/components/layout/PageeLayout';
import Input from '@/components/ui/Input';
import { Link } from 'react-router-dom';

type tagType = {
  label: string;
};

const mockProductList = [
  {
    id: 1,
    name: '울 오버핏 코트',
    description: '전체적인 톤을 맞춰줘요',
    url: '',
    imgUrl: 'https://static.lookpin.co.kr/20250223125033-a52c/bb8a724e255a4399b2975545a33d16fa.jpg',
  },
  {
    id: 2,
    name: '하의',
    description: '힙한 무드를 연출할 수 있는 아이템이에요',
    url: '',
    imgUrl: 'https://m.troubadour.kr/web/product/big/202505/bda60510d318641ada0b54ead25ec1ab.jpg',
  },
  {
    id: 3,
    name: '상의',
    description: '레이어드 기본적인 아이템이에요',
    url: '',
    imgUrl:
      'https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/8SBR/24/11/29/GM0024112978689_0_THNAIL_ORGINL_20241203174400242.jpg',
  },
];
const OutfitSavePage = () => {
  const [tag, setTag] = useState<tagType[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [clickTag, setClickTag] = useState<Number>(5);

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    setTag((prevItems) => [...prevItems, { label: `#${tagInput}` }]);
    setTagInput('');
  };

  const handleClickTag = (index: Number) => {
    if (index === clickTag) {
      setTag((prevItems) => prevItems.filter((_, i) => i !== clickTag));
      setClickTag(5);
    } else {
      setClickTag(index);
    }
  };

  const handleMemoInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="코디 저장">
      <div className="ItemList p-[34px] rounded-[12px] borader border-[#CFC4C54D] bg-[#EEEEEE] mx-[20px] mt-[20px] grid grid-cols-2 gap-[4px]">
        {mockProductList.map((product) => (
          <img
            key={product.id}
            src={product.imgUrl}
            alt={product.name}
            className="w-full aspect-square object-cover bg-[#F5F5F5] rounded-[12px] "
          />
        ))}

        <div className="flex w-full bg-[#E8E8E8] aspect-square items-center justify-center  rounded-[12px] ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="#7E7576" />
          </svg>
        </div>
      </div>
      <div className="CodyName mx-[20px] mt-[24px]">
        <p className="text-[12px] font-[500] text-[#4C4546] mb-[8px]">코디 이름</p>
        <Input placeholder="예: 미니멀 시티룩" />
      </div>
      <div className="Tag mx-[20px] mt-[24px]">
        <p className="text-[12px] font-[500] text-[#4C4546] mb-[8px]">상황 태그</p>
        <div className="flex flex-wrap gap-[8px] ">
          {tag.map((tag, index) => (
            <div
              key={index}
              onClick={() => handleClickTag(index)}
              className={`relative border  rounded-full text-[#4C4546] text-[12px] text-[500] px-[16px] py-[8px] overflow-hidden transition-all ${index === clickTag ? 'pr-[41px] bg-[#E2E2E2]  border-[#00000033] ' : 'bg-[#EEEEEE]  border-[#CFC4C533] '}`}
            >
              {tag.label}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                className={`translate-y-1/2 bottom-1/2  absolute  transition-all right-[16px] `}
              >
                <path
                  d="M0.816667 8.16667L0 7.35L3.26667 4.08333L0 0.816667L0.816667 0L4.08333 3.26667L7.35 0L8.16667 0.816667L4.9 4.08333L8.16667 7.35L7.35 8.16667L4.08333 4.9L0.816667 8.16667Z"
                  fill={` ${index === clickTag ? '#1A1C1C' : '#00000000'}`}
                />
              </svg>
            </div>
          ))}
        </div>
        <div className="relative  mt-[24px]">
          <Input
            className=""
            placeholder="태그 추가 (최대 5개)"
            value={tagInput}
            onChange={handleTagChange}
          />
          <div
            className="absolute right-[12px] bottom-1/2 translate-y-1/2 cursor-pointer"
            onClick={addTag}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="Memo mx-[20px] mt-[24px]">
        <p className="text-[12px] font-[500] text-[#4C4546] mb-[8px]">메모 (선택)</p>
        <textarea
          className="w-full min-h-12 px-4 py-3 text-sm bg-white border border-neutral-300 rounded-xl outline-none transition-colors placeholder:text-neutral-400 focus:border-black resize-none overflow-hidden"
          onInput={handleMemoInput}
          placeholder="스타일링 팁이나 구매 희망 사항을 적어주세요."
        />
      </div>

      <Link
        to={'/outfit/share'}
        className="mt-[50px] mb-[50px] mx-[20px] border bg-[#000000] h-[48px] rounded-[8px]  text-[16px] text-[#FFFFFF] text-medium font-[500] text-center flex items-center justify-center cursor-pointer"
      >
        저장하기
      </Link>
    </PageLayout>
  );
};
export default OutfitSavePage;
