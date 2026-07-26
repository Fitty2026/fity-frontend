import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import OutfitItem from '@/features/myoutfit/components/OutfitItem';
import { useMyOutfit } from '@/features/myoutfit/hooks/useMyOutfits';
import type { ClothingCategory } from '@/types';

const BASE_CATEGORIES: ClothingCategory[] = ['아우터', '상의', '하의', '액세서리', '신발'];

const MyOutfitDetailPage = () => {
  const navigate = useNavigate();
  const { outfitId } = useParams();
  const { data: outfit, error, isPending, refetch } = useMyOutfit(outfitId);

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
      <h1 className="mt-[56px] w-full text-center text-[20px] font-[600] leading-[150%] tracking-[-2%] text-[#1F2124]">
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

      <p className="flex w-full justify-center gap-[6px] px-[24px] text-center">
        {outfit.styleTags.map((tag) => (
          <span
            key={tag}
            className="text-[14px] font-[500] leading-[160%] tracking-[-2%] text-[#6F7881]"
          >
            #{tag.replace(/^#/, '')}
          </span>
        ))}
      </p>

      <div className="mx-[24px] mt-[40px] flex gap-[16px]">
        <div className="relative aspect-[172/416] flex-172 overflow-hidden rounded-[24px] bg-[#E6E8EA]">
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

      {outfit.memo && (
        <p className="mx-[24px] mt-[24px] rounded-[8px] bg-[#F6F7F8] px-[16px] py-[12px] text-[13px] font-[500] leading-[160%] text-[#5A6169]">
          {outfit.memo}
        </p>
      )}

      <div className="mx-[24px] mt-[24px] pb-[32px]">
        <button
          type="button"
          onClick={() => navigate(`/myoutfit/edit/${outfit.id}`)}
          className="w-full rounded-[32px] bg-[#F6F7F8] py-[16px] text-[16px] font-[600] leading-[160%] tracking-[-2%] text-[#1F2124]"
        >
          수정하기
        </button>
      </div>
    </PageLayout>
  );
};

export default MyOutfitDetailPage;
