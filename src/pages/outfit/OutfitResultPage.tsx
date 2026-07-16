import PageLayout from '@/components/layout/PageeLayout';

const OutfitResultPage = () => {
  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        코디를 저장할까요?
      </h1>
      <div className="mt-[40px] mx-[40px] aspect-[3/4]">
        <img className=" w-full h-full rounded-[24px]" src={''} alt={''}></img>
      </div>
      <div className="mt-[30px] mx-[24px] flex flex-col gap-[6px] ">
        <button className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          수정하기
        </button>
        <button className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          확인
        </button>
      </div>
    </PageLayout>
  );
};

export default OutfitResultPage;
