import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import Input from '@/components/ui/Input';

import { mockOutfits } from '../../mocks/data/outfit';
import type { Outfit } from '../../types';

const Tag = ({ isSelected = false, tag = '', onclick = () => {} }) => {
  return (
    <div
      onClick={onclick}
      className={`border relative transition-all duration-0.3 ${isSelected ? 'bg-[#B2B8BD] pr-[28px]' : ''} border-[#34363C] rounded-[32px] px-[12px] py-[4px] text-[#34363C] text-[14px] leading-[160%] tracking-[-2%]`}
    >
      {tag}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        className={`absolute bottom-1/2 translate-y-1/2 right-[12px] ${isSelected ? 'visible' : 'hidden'}`}
      >
        <path d="M0 8L8 0M0 0L8 8" stroke="#34363C" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const MyOutfitEditPage = () => {
  const [outfit, setResult] = useState<Outfit>();
  const [selectedTag, setSelectedTag] = useState<Number>(5);

  const clickTag = (index: Number) => {
    setSelectedTag(index);
  };

  useEffect(() => {
    setResult(mockOutfits?.[0]);
  }, []);

  const navigate = useNavigate();

  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="수정하기">
      <div className="relative mt-[24px] mx-[24px]">
        <div className="w-[calc(77.49196%_-_12.3987px)] relative">
          <img
            className="block w-full rounded-[8px] aspect-square object-cover"
            src={outfit?.imageUrl}
            alt={outfit?.createdAt}
          ></img>
          <p className="absolute top-[9px] left-[14px] text-[#474C52] text-[12px] font-[600] leading-[165%] tracking-[-2%]">
            {outfit?.createdAt.slice(0, 10).split('-').join('.')}
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 w-[calc(22.50804%_-_3.6013px)] space-y-[22.142857%] overflow-y-auto overscroll-contain touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {outfit?.items.map((item) => (
            <img
              key={item.id}
              className="block w-full rounded-[8px] aspect-square object-cover"
              src={item.imageUrl}
              alt={item.imageUrl}
            ></img>
          ))}{' '}
        </div>
      </div>
      <div className="mt-[16px] mx-[24px] bg-[#E9E9E9] rounded-[8px] p-[10px] flex justify-center items-center gap-[8px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clip-path="url(#clip0_1461_116902)">
            <circle cx="8" cy="8" r="7.6" stroke="#34363C" stroke-width="0.8" />
            <path
              d="M7.99935 4.66699V11.3337M11.3327 8.00033H4.66602"
              stroke="#34363C"
              stroke-width="0.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_1461_116902">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>{' '}
        <p className="text-[#1F2124] text-[12px] font-[500] leading-[165%] tracking-[-2%]">
          아이템 추가
        </p>
      </div>
      <div className="mt-[27px] mx-[24px]">
        <h2 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          코디 이름
        </h2>
        <Input className="mt-[8px]" placeholder="코디 이름을 입력해주세요"></Input>
      </div>
      <div className="mt-[16px] mx-[24px]">
        <h2 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          태그
        </h2>
        <div className="mt-[8px] flex flex-wrap gap-[8px] items-center">
          {outfit?.styleTags.map((tag, index) => (
            <Tag
              tag={tag}
              isSelected={selectedTag == index}
              key={tag}
              onclick={() => clickTag(index)}
            />
          ))}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="ml-[15px]"
          >
            <g clip-path="url(#clip0_1461_116923)">
              <circle cx="12" cy="12" r="11.5" stroke="#34363C" />
              <path
                d="M12 7V17M17 12H7"
                stroke="#34363C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1461_116923">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div className="mt-[24px] mx-[24px] flex">
        <h2 className="flex-86 text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          메모
        </h2>
        <div className="flex-241">
          <textarea
            name=""
            id=""
            placeholder="메모를 입력해주세요 (선택)"
            className="w-full min-h-[63px] bg-[#F6F7F8] rounded-[4px] px-[8px] py-[10px] text-[#B2B8BD] text-[12px] font-[500] leading-[165%] tracking-[-2%] outline-none resize-none overflow-hidden "
          ></textarea>
        </div>
      </div>
      <div className="mt-[20px] mx-[24px]">
        <button
          onClick={() => {
            navigate('/outfit/result');
          }}
          className="w-full bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          확인
        </button>
      </div>
    </PageLayout>
  );
};
export default MyOutfitEditPage;

