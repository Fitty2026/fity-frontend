import PageLayout from '@/components/layout/PageeLayout';

import { mockOutfits } from '../../mocks/data/outfit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Outfit } from '@/types';
import OutfitItem from '@/features/myoutfit/components/OutfitItem';

const MyOutfitDetailPage = () => {
  const [outfit] = useState<Outfit | undefined>(() => mockOutfits[0]);
  const navigate = useNavigate();

  return (
    <PageLayout showBottomNav={true} showHeader={true} showBack={true} title="옷장">
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        {outfit?.context}
      </h1>
      <p className="w-full text-center">
        {outfit?.styleTags.map((tag) => (
          <span
            key={tag}
            className="text-[14px] text-[#6F7881] font-[500] leading-[160%] tracking-[-2%]"
          >
            {tag}
          </span>
        ))}
      </p>
      <div className="mt-[40px] mx-[24px] flex justify-beteewn gap-[16px] ">
        <div
          className={`flex-172 relative  overflow-hidden bg-blue rounded-[24px]`}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={outfit?.imageUrl}
            alt={outfit?.createdAt}
          ></img>
        </div>
        <div className="flex-139 flex flex-col gap-[32px]">
            <OutfitItem item={outfit?.items.find((item)=>item.category === "아우터")} category={"아우터"} index={0}/>
            <OutfitItem item={outfit?.items.find((item)=>item.category === "상의")} category={"상의"} index={1}/>
            <OutfitItem item={outfit?.items.find((item)=>item.category === "하의")} category={"하의"} index={2}/>
            <OutfitItem item={outfit?.items.find((item)=>item.category === "액세서리")} category={"액세서리"} index={3}/>
            <OutfitItem item={outfit?.items.find((item)=>item.category === "신발")} category={"신발"} index={4}/>
        </div>
      </div>
      <div className="mt-[43px] mx-[24px] flex flex-col gap-[6px] ">
        <button
          onClick={() => {
            navigate(`/myoutfit/edit/:${outfit?.id}`);
          }}
          className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          수정하기
        </button>
      </div>
    </PageLayout>
  );
};
export default MyOutfitDetailPage;
