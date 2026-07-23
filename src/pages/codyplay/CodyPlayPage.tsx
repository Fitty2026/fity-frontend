import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';

import { mockOutfits } from '../../mocks/data/outfit';
import type { Outfit } from '../../types';

const CodyPlayPage = () => {
  const [result] = useState<Outfit | undefined>(() => mockOutfits[0]);

  const navigate = useNavigate();
  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        코디를 저장할까요?
      </h1>
      <div className="mt-[40px] mx-[40px] rounded-[24px] overflow-hidden">
        <img
          className="block w-full aspect-[0.754/1] object-cover"
          src={result?.imageUrl}
          alt={result?.createdAt}
        ></img>
      </div>
      <div className="mt-[30px] mx-[24px] flex flex-col gap-[6px] ">
        <button
          onClick={() => {
            navigate('/codyplay/retouch', { state: { animateImage: true } });
          }}
          className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          수정하기
        </button>
        <button
          onClick={() => {
            navigate('/outfit/share', { state: { animateImage: true } });
          }}
          className="bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          코디 저장하기
        </button>
      </div>
    </PageLayout>
  );
};

export default CodyPlayPage;
