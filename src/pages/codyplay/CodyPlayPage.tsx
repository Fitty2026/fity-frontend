import { useLocation, useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import useGeneratedOutfit from '@/features/codyplay/hooks/useGeneratedOutfit';
import useSaveGeneratedOutfit from '@/features/codyplay/hooks/useSaveGeneratedOutfit';
import useStylingStore from '@/store/stylingStore';

const CodyPlayPage = () => {
  const { state } = useLocation() as {
    state: { outfitResultId?: number } | null;
  };
  const { outfit: result, error, isPending, retry } = useGeneratedOutfit(
    state?.outfitResultId ? String(state.outfitResultId) : undefined,
  );
  const setGeneratedOutfit = useStylingStore((state) => state.setGeneratedOutfit);
  const saveMutation = useSaveGeneratedOutfit();
  const navigate = useNavigate();

  if (isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
        <LoadingScreen message="완성된 코디를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  if (error || !result) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-[18px] font-semibold text-[#1F2124]">
            코디를 불러오지 못했어요.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 text-[14px] font-semibold underline"
          >
            다시 시도
          </button>
        </div>
      </PageLayout>
    );
  }

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
          disabled={saveMutation.isPending}
          onClick={() =>
            saveMutation.mutate(result, {
              onSuccess: (savedOutfit) => {
                setGeneratedOutfit(savedOutfit);
                navigate('/outfit/share', { state: { animateImage: true } });
              },
            })
          }
          className="bg-[#1F2124] disabled:bg-[#E6E8EA] rounded-[32px] py-[16px] text-[#F6F7F8] disabled:text-[#959BA7] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          {saveMutation.isPending ? '저장 중...' : '코디 저장하기'}
        </button>
        {saveMutation.isError && (
          <p className="text-center text-[13px] text-red-500">
            코디를 저장하지 못했어요. 다시 시도해 주세요.
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default CodyPlayPage;
