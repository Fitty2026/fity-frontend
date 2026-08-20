import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from '@/features/myoutfit/components/MyOutfitPageLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import Input from '@/components/ui/Input';
import LoadingScreen from '@/components/ui/LoadingScreen';
import TagAddBottomSheet, { MAX_TAG_COUNT } from '@/features/myoutfit/components/TagAddBottomSheet';
import useUpdateMyOutfit from '@/features/myoutfit/hooks/useUpdateMyOutfit';
import { useMyOutfit } from '@/features/myoutfit/hooks/useMyOutfits';
import type { ClothingCategory, Outfit } from '../../types';

const ITEM_MARKER_TOP: Record<ClothingCategory, number> = {
  아우터: 30,
  상의: 42,
  하의: 64,
  신발: 88,
  가방: 48,
  액세서리: 25,
  기타: 65,
};

const ItemMarker = ({ itemId }: { itemId: string }) => (
  <svg
    width="61"
    height="30"
    viewBox="0 0 61 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="61" height="24" rx="4" fill="black" fillOpacity="0.6" />
    <foreignObject x="4" y="0" width="53" height="24">
      <div className="flex h-full items-center justify-center truncate px-[3px] text-[11px] font-[600] text-white">
        {itemId || '-'}
      </div>
    </foreignObject>
    <path d="M30.5 30L27.0359 24H33.9641L30.5 30Z" fill="black" fillOpacity="0.6" />
  </svg>
);

const Tag = ({ isSelected = false, tag = '', onclick = () => {} }) => {
  return (
    <div
      onClick={onclick}
      className={`select-none border relative transition-all duration-0.3 ${isSelected ? 'bg-[#B2B8BD] pr-[28px]' : ''} border-[#34363C] rounded-[32px] px-[12px] py-[4px] text-[#34363C] text-[14px] leading-[160%] tracking-[-2%]`}
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

const MyOutfitEditForm = ({ initialOutfit }: { initialOutfit: Outfit }) => {
  const [outfit, setResult] = useState<Outfit>(initialOutfit);
  const [title, setTitle] = useState(initialOutfit.context ?? '');
  const [memo, setMemo] = useState(initialOutfit.memo ?? '');
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isTagSheetOpen, setIsTagSheetOpen] = useState(false);
  const [showItemMarkers, setShowItemMarkers] = useState(false);

  const clickTag = (index: number) => {
    if (selectedTag !== index) {
      setSelectedTag(index);
      return;
    }

    setResult((prev) =>
      prev
        ? {
            ...prev,
            styleTags: prev.styleTags.filter((_, tagIndex) => tagIndex !== index),
          }
        : prev,
    );
    setSelectedTag(null);
  };

  const navigate = useNavigate();
  const updateMutation = useUpdateMyOutfit();

  const handleCompleteTags = (tags: string[]) => {
    setResult((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        styleTags: tags.slice(0, MAX_TAG_COUNT),
      };
    });
    setSelectedTag(null);
  };

  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="수정하기">
      <div className="relative mt-[24px] mx-[24px]">
        <button
          type="button"
          aria-label={showItemMarkers ? '아이템 위치 숨기기' : '아이템 위치 보기'}
          aria-pressed={showItemMarkers}
          onClick={() => setShowItemMarkers((isVisible) => !isVisible)}
          className="relative block w-[calc(77.49196%_-_12.3987px)] text-left"
        >
          <img
            className="block w-full rounded-[8px] aspect-square object-cover"
            src={outfit?.imageUrl}
            alt={outfit?.createdAt}
          />
          <p className="absolute top-[9px] left-[14px] text-[#474C52] text-[12px] font-[600] leading-[165%] tracking-[-2%]">
            {outfit?.createdAt.slice(0, 10).split('-').join('.')}
          </p>
          {showItemMarkers &&
            outfit?.items.map((item, index) => {
              return (
                <span
                  key={item.id}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
                  style={{
                    left: index % 2 === 0 ? '30%' : '70%',
                    top: `${ITEM_MARKER_TOP[item.category]}%`,
                  }}
                >
                  <ItemMarker itemId={item.id} />
                </span>
              );
            })}
        </button>
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
      <div
        onClick={() => navigate(`/myoutfit/additem/${outfit.id}`)}
        className="mt-[16px] mx-[24px] bg-[#E9E9E9] rounded-[8px] p-[10px] flex justify-center items-center gap-[8px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clipPath="url(#clip0_1461_116902)">
            <circle cx="8" cy="8" r="7.6" stroke="#34363C" strokeWidth="0.8" />
            <path
              d="M7.99935 4.66699V11.3337M11.3327 8.00033H4.66602"
              stroke="#34363C"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
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
        <Input
          className="mt-[8px]"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="코디 이름을 입력해주세요"
        />
      </div>
      <div className="mt-[16px] mx-[24px]">
        <h2 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          태그
        </h2>
        <div className="mt-[8px] flex flex-wrap gap-[8px] items-center">
          {outfit.styleTags.map((tag, index) => (
            <Tag
              tag={tag}
              isSelected={selectedTag === index}
              key={tag}
              onclick={() => clickTag(index)}
            />
          ))}

          <button
            type="button"
            aria-label="태그 추가"
            onClick={() => setIsTagSheetOpen(true)}
            className="ml-[15px] select-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_1461_116923)">
                <circle cx="12" cy="12" r="11.5" stroke="#34363C" />
                <path
                  d="M12 7V17M17 12H7"
                  stroke="#34363C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1461_116923">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-[24px] mx-[24px] flex">
        <h2 className="flex-86 text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
          메모
        </h2>
        <div className="flex-241">
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="메모를 입력해주세요 (선택)"
            className="w-full min-h-[63px] bg-[#F6F7F8] rounded-[4px] px-[8px] py-[10px] text-[#B2B8BD] text-[12px] font-[500] leading-[165%] tracking-[-2%] outline-none resize-none overflow-hidden "
          ></textarea>
        </div>
      </div>
      <div className="mt-[20px] mx-[24px]">
        <button
          type="button"
          disabled={!title.trim() || updateMutation.isPending}
          onClick={() => {
            updateMutation.mutate(
              {
                savedOutfitId: outfit.id,
                body: {
                  title: title.trim(),
                  memo: memo.trim(),
                  styleTags: outfit.styleTags,
                  itemIds: outfit.items.map((item) => item.id),
                },
              },
              {
                onSuccess: (updatedOutfit) =>
                  navigate(`/myoutfit/${updatedOutfit.id}`, { replace: true }),
              },
            );
          }}
          className="w-full mt-[8px] mb-[24px] bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          {updateMutation.isPending ? '저장 중...' : '확인'}
        </button>
      </div>
      <TagAddBottomSheet
        isOpen={isTagSheetOpen}
        currentTags={outfit.styleTags}
        onClose={() => setIsTagSheetOpen(false)}
        onComplete={handleCompleteTags}
      />
    </PageLayout>
  );
};

const MyOutfitEditPage = () => {
  const { outfitId } = useParams();
  const { data: outfit, error, isPending, refetch } = useMyOutfit(outfitId);

  if (isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="수정하기">
        <LoadingScreen message="수정할 코디를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  if (error || !outfit) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="수정하기">
        <ErrorScreen
          title="코디를 불러오지 못했어요."
          description={error?.message ?? '코디 정보를 찾을 수 없어요.'}
          onRetry={() => void refetch()}
        />
      </PageLayout>
    );
  }

  return <MyOutfitEditForm key={outfit.id} initialOutfit={outfit} />;
};

export default MyOutfitEditPage;
