import PageLayout from '@/components/layout/PageeLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mockOutfits } from '../../mocks/data/outfit';
import type { Outfit } from '../../types';

const MyOutfitDeletePage = () => {
  const [outfit] = useState<Outfit | undefined>(() => mockOutfits[0]);

  const navigate = useNavigate();

  const deleteOutfit = ()=>{
 navigate('/myoutfit');
  }
  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        코디를 삭제할까요?
      </h1>
      <div className="mt-[40px] relative mx-[40px] rounded-[24px] overflow-hidden">
        <img
          className="block w-full aspect-[0.754/1] object-cover"
          src={outfit?.imageUrl}
          alt={outfit?.createdAt}
        ></img>
        <div className='bg-[#00000080] absolute w-full h-full top-0'></div>
      </div>
      <div className="mt-[30px] mx-[24px] flex flex-col gap-[6px] ">
        <button
          onClick={() => {
            navigate('/myoutfit/:outfit', { state: { animateImage: true } });
          }}
          className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          아니오
        </button>
        <button
          onClick={() => {
           deleteOutfit()
          }}
          className="bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          확인
        </button>
      </div>
    </PageLayout>
  );
};

export default MyOutfitDeletePage;
