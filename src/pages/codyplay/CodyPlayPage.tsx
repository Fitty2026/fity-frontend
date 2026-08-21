import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useStudioBack from '@/features/styling/hooks/useStudioBack';

import PageLayout from '@/components/layout/PageLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { imageSrc } from '@/features/closet/api/closetApi';
import useGeneratedOutfit from '@/features/codyplay/hooks/useGeneratedOutfit';
import useSaveGeneratedOutfit from '@/features/codyplay/hooks/useSaveGeneratedOutfit';
import useStylingStore from '@/store/stylingStore';

const CodyPlayPage = () => {
  const { state } = useLocation() as {
    state: { jobId?: number; outfitResultId?: number; generatedImageUrl?: string } | null;
  };
  const locationJobId = state?.jobId;
  const locationOutfitResultId = state?.outfitResultId;
  const locationGeneratedImageUrl = state?.generatedImageUrl;
  const initialOutfit = useMemo(
    () =>
      locationOutfitResultId && locationGeneratedImageUrl
        ? {
            id: String(locationOutfitResultId),
            imageUrl: imageSrc(locationGeneratedImageUrl),
            items: [],
            styleTags: [],
            context: '새로운 코디',
            createdAt: '',
            isSaved: false,
          }
        : undefined,
    [locationGeneratedImageUrl, locationOutfitResultId],
  );
  const {
    outfit: result,
    error,
    isPending,
    retry,
  } = useGeneratedOutfit(locationJobId ? String(locationJobId) : undefined, initialOutfit);
  const [outfitName, setOutfitName] = useState('새로운 코디');
  const [isEditingName, setIsEditingName] = useState(false);
  const setGeneratedOutfit = useStylingStore((state) => state.setGeneratedOutfit);
  const saveMutation = useSaveGeneratedOutfit();
  const navigate = useNavigate();
  const goBack = useStudioBack();

  if (isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} onBack={goBack} title="스튜디오">
        <LoadingScreen message="완성된 코디를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  if (error || !result) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} onBack={goBack} title="스튜디오">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <p className="text-[18px] font-semibold text-[#1F2124]">코디를 불러오지 못했어요.</p>
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
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} onBack={goBack} title="스튜디오">
      {isEditingName ? (
        <input
          autoFocus
          value={outfitName}
          onChange={(event) => setOutfitName(event.target.value)}
          onBlur={() => {
            setOutfitName((name) => name.trim() || '새로운 코디');
            setIsEditingName(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') {
              setOutfitName('새로운 코디');
              setIsEditingName(false);
            }
          }}
          aria-label="코디 이름"
          className="mt-[56px] w-full bg-transparent text-center text-[20px] font-[600] leading-[150%] tracking-[-2%] text-[#1F2124] outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditingName(true)}
          className="mt-[56px] w-full bg-transparent text-center text-[20px] font-[600] leading-[150%] tracking-[-2%] text-[#1F2124]"
        >
          {outfitName}
        </button>
      )}
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
            saveMutation.mutate(
              { outfit: result, name: outfitName },
              {
                onSuccess: (savedOutfit) => {
                  setGeneratedOutfit(savedOutfit);
                  navigate('/outfit/share', { state: { animateImage: true } });
                },
              },
            )
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
