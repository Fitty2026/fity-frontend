import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import PageLayout from '@/features/myoutfit/components/MyOutfitPageLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import OutfitItem from '@/features/myoutfit/components/OutfitItem';
import {
  useMyOutfit,
  useRecentlyDeletedOutfits,
} from '@/features/myoutfit/hooks/useMyOutfits';
import useRecentlyDeletedOutfitActions from '@/features/myoutfit/hooks/useRecentlyDeletedOutfitActions';
import type { ClothingCategory, Outfit } from '@/types';

const BASE_CATEGORIES: ClothingCategory[] = ['아우터', '상의', '하의', '액세서리', '신발'];

const MyOutfitDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { outfitId } = useParams();
  const recentlyDeletedOutfit = (
    location.state as { recentlyDeletedOutfit?: Outfit } | null
  )?.recentlyDeletedOutfit;
  const isRecentlyDeleted =
    Boolean(recentlyDeletedOutfit) || searchParams.get('source') === 'deleted';
  const {
    data: fetchedOutfit,
    error: outfitError,
    isPending: isOutfitPending,
    refetch: refetchOutfit,
  } = useMyOutfit(isRecentlyDeleted ? undefined : outfitId);
  const {
    data: recentlyDeletedData,
    error: recentlyDeletedError,
    isPending: isRecentlyDeletedPending,
    refetch: refetchRecentlyDeleted,
  } = useRecentlyDeletedOutfits(isRecentlyDeleted && !recentlyDeletedOutfit);
  const fetchedRecentlyDeletedOutfit = recentlyDeletedData?.outfits.find(
    ({ outfit }) => outfit.id === outfitId,
  )?.outfit;
  const outfit = recentlyDeletedOutfit ?? fetchedRecentlyDeletedOutfit ?? fetchedOutfit;
  const error = isRecentlyDeleted ? recentlyDeletedError : outfitError;
  const isPending = isRecentlyDeleted
    ? !recentlyDeletedOutfit && isRecentlyDeletedPending
    : isOutfitPending;
  const refetch = isRecentlyDeleted ? refetchRecentlyDeleted : refetchOutfit;
  const { restoreMutation, permanentDeleteMutation } = useRecentlyDeletedOutfitActions();
  const actionError = restoreMutation.error ?? permanentDeleteMutation.error;
  const isActionPending = restoreMutation.isPending || permanentDeleteMutation.isPending;

  if (isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="룩북">
        <LoadingScreen message="코디 상세 정보를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  if (error || !outfit) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="룩북">
        <ErrorScreen
          title="코디를 불러오지 못했어요."
          description={error?.message ?? '코디 정보를 찾을 수 없어요.'}
          onRetry={() => void refetch()}
        />
      </PageLayout>
    );
  }

  const baseItems = BASE_CATEGORIES.map((category) => ({
    category,
    item: outfit.items.find((item) => item.category === category),
  }));
  const matchedItemIds = new Set(
    baseItems.flatMap(({ item }) => (item ? [item.id] : [])),
  );
  const extraItems = outfit.items.filter((item) => !matchedItemIds.has(item.id));

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="룩북"
      className="relative"
    >
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        {outfit.context}
      </h1>

      <button
        type="button"
        aria-label="코디 삭제"
        onClick={() => navigate(`/myoutfit/delete/${outfit.id}`)}
        className="absolute right-[24px] top-[20px]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.74 8.99954L14.394 17.9995M9.606 17.9995L9.26 8.99954M15.75 5.39254C16.9138 5.48264 18.0739 5.61506 19.228 5.78954C19.57 5.84154 19.91 5.89654 20.25 5.95554M19.228 5.78954L18.16 19.6725C18.1164 20.2378 17.8611 20.7657 17.445 21.1508C17.029 21.5359 16.4829 21.7497 15.916 21.7495H8.084C7.5171 21.7497 6.97102 21.5359 6.55498 21.1508C6.13894 20.7657 5.88359 20.2378 5.84 19.6725L4.772 5.78954M4.772 5.78954C4.43 5.84054 4.09 5.89554 3.75 5.95454M4.772 5.78954C5.92613 5.61506 7.08623 5.48264 8.25 5.39254M15.75 5.39254V4.47654C15.75 3.29654 14.84 2.31254 13.66 2.27554C12.5536 2.24018 11.4464 2.24018 10.34 2.27554C9.16 2.31254 8.25 3.29754 8.25 4.47654V5.39254M15.75 5.39254C13.2537 5.19962 10.7463 5.19962 8.25 5.39254"
            stroke="#1F2124"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <p className="w-full text-center">
        {outfit.styleTags.map((tag) => (
          <span
            key={tag}
            className="text-[14px] font-[500] leading-[160%] tracking-[-2%] text-[#6F7881]"
          >
            {tag}
          </span>
        ))}
      </p>

      <div className="mt-[40px] mx-[24px] flex justify-beteewn gap-[16px] ">
        <div className="flex-172 relative relative aspect-[172/416] overflow-hidden bg-blue rounded-[24px]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={outfit.imageUrl}
            alt={`${outfit.context ?? '저장한 코디'} 착장`}
          />
          <p className="absolute left-[12px] top-[8px] text-[10px] font-[600] leading-[165%] tracking-[-2%] text-[#5A6169]">
            {outfit.createdAt.slice(0, 10).split('-').join('.')}
          </p>
        </div>

        <div className="flex h-[468px] flex-139 flex-col gap-[32px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {baseItems.map(({ category, item }, index) => (
            <OutfitItem key={category} item={item} category={category} index={index} />
          ))}
          {extraItems.map((item, index) => (
            <OutfitItem
              key={`${item.id}-${item.category}`}
              item={item}
              category={item.category}
              index={BASE_CATEGORIES.length + index}
            />
          ))}
        </div>
      </div>

      <div className="mt-[43px] mx-[24px] flex flex-col gap-[6px] ">
        {isRecentlyDeleted ? (
          <>
            {actionError ? (
              <p className="mb-[8px] text-center text-[13px] text-red-500">
                {actionError.message}
              </p>
            ) : null}
            <button
              type="button"
              disabled={isActionPending}
              onClick={() =>
                restoreMutation.mutate(outfit.id, {
                  onSuccess: () => navigate('/myoutfit/recently-deleted', { replace: true }),
                })
              }
              className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%] disabled:text-[#B2B8BD]"
            >
              {restoreMutation.isPending ? '복구 중...' : '복구하기'}
            </button>
            <button
              type="button"
              disabled={isActionPending}
              onClick={() =>
                permanentDeleteMutation.mutate(outfit.id, {
                  onSuccess: () => navigate('/myoutfit/recently-deleted', { replace: true }),
                })
              }
              className="bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%] disabled:bg-[#B2B8BD]"
            >
              {permanentDeleteMutation.isPending ? '삭제 중...' : '영구 삭제하기'}
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate(`/myoutfit/edit/${outfit.id}`)}
            className="bg-[#F6F7F8] rounded-[32px] mb-[24px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
          >
            수정하기
          </button>
        )}
      </div>
    </PageLayout>
  );
};

export default MyOutfitDetailPage;
