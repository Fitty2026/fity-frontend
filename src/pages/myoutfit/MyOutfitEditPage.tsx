import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import Input from '@/components/ui/Input';
import LoadingScreen from '@/components/ui/LoadingScreen';
import TagAddBottomSheet, {
  MAX_TAG_COUNT,
} from '@/features/myoutfit/components/TagAddBottomSheet';
import useUpdateMyOutfit from '@/features/myoutfit/hooks/useUpdateMyOutfit';
import { useMyOutfit } from '@/features/myoutfit/hooks/useMyOutfits';
import type { Outfit } from '@/types';

interface MyOutfitEditFormProps {
  outfit: Outfit;
}

const MyOutfitEditForm = ({ outfit }: MyOutfitEditFormProps) => {
  const navigate = useNavigate();
  const updateMutation = useUpdateMyOutfit();
  const [title, setTitle] = useState(outfit.context ?? '');
  const [memo, setMemo] = useState(outfit.memo ?? '');
  const [styleTags, setStyleTags] = useState(outfit.styleTags);
  const [isTagSheetOpen, setIsTagSheetOpen] = useState(false);

  const removeTag = (tagToRemove: string) => {
    setStyleTags((currentTags) =>
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const addTag = (tag: string) => {
    setStyleTags((currentTags) => {
      if (
        currentTags.length >= MAX_TAG_COUNT ||
        currentTags.includes(tag)
      ) {
        return currentTags;
      }
      return [...currentTags, tag];
    });
  };

  const submit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || updateMutation.isPending) return;

    updateMutation.mutate(
      {
        savedOutfitId: outfit.id,
        body: {
          title: trimmedTitle,
          memo: memo.trim(),
          styleTags,
          itemIds: outfit.items.map((item) => item.id),
        },
      },
      {
        onSuccess: (updatedOutfit) =>
          navigate(`/myoutfit/${updatedOutfit.id}`, { replace: true }),
      },
    );
  };

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="수정하기"
    >
      <div className="mx-[24px] mt-[24px] flex gap-[16px]">
        <img
          className="aspect-[172/230] min-w-0 flex-1 rounded-[12px] object-cover"
          src={outfit.imageUrl}
          alt={`${outfit.context ?? '코디'} 착장`}
        />
        <div className="flex w-[104px] flex-col gap-[10px] overflow-y-auto">
          {outfit.items.map((item) => (
            <div
              key={item.id}
              className="rounded-[8px] bg-[#F6F7F8] px-[8px] py-[10px]"
            >
              <p className="truncate text-[12px] font-[600] text-[#1F2124]">
                {item.name ?? item.id}
              </p>
              <p className="mt-[2px] text-[10px] text-[#6F7881]">
                {item.category}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/myoutfit/additem/${outfit.id}`)}
        className="mx-[24px] mt-[16px] flex w-[calc(100%_-_48px)] items-center justify-center gap-[8px] rounded-[8px] bg-[#E9E9E9] p-[10px] text-[12px] font-[500] text-[#1F2124]"
      >
        <span aria-hidden="true">＋</span>
        아이템 추가
      </button>

      <div className="mx-[24px] mt-[27px]">
        <h2 className="text-[16px] font-[600] text-[#1F2124]">코디 이름</h2>
        <Input
          className="mt-[8px]"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="코디 이름을 입력해주세요."
          errorMessage={!title.trim() ? '코디 이름을 입력해주세요.' : undefined}
        />
      </div>

      <div className="mx-[24px] mt-[16px]">
        <h2 className="text-[16px] font-[600] text-[#1F2124]">태그</h2>
        <div className="mt-[8px] flex flex-wrap items-center gap-[8px]">
          {styleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-label={`${tag} 태그 삭제`}
              onClick={() => removeTag(tag)}
              className="rounded-[32px] border border-[#34363C] px-[12px] py-[4px] text-[14px] text-[#34363C]"
            >
              {tag} ×
            </button>
          ))}
          <button
            type="button"
            aria-label="태그 추가"
            onClick={() => setIsTagSheetOpen(true)}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#34363C] text-[18px]"
          >
            +
          </button>
        </div>
      </div>

      <div className="mx-[24px] mt-[24px]">
        <h2 className="text-[16px] font-[600] text-[#1F2124]">메모</h2>
        <textarea
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="메모를 입력해주세요. (선택)"
          className="mt-[8px] min-h-[90px] w-full resize-none rounded-[8px] bg-[#F6F7F8] px-[12px] py-[10px] text-[13px] font-[500] text-[#1F2124] outline-none placeholder:text-[#B2B8BD]"
        />
      </div>

      {updateMutation.error && (
        <p className="mx-[24px] mt-[12px] text-center text-[13px] text-red-500">
          {updateMutation.error.message}
        </p>
      )}

      <div className="mx-[24px] mt-[20px] pb-[32px]">
        <button
          type="button"
          disabled={!title.trim() || updateMutation.isPending}
          onClick={submit}
          className="w-full rounded-[32px] bg-[#1F2124] py-[16px] text-[16px] font-[600] text-[#F6F7F8] disabled:bg-[#B2B8BD]"
        >
          {updateMutation.isPending ? '저장 중...' : '확인'}
        </button>
      </div>

      <TagAddBottomSheet
        isOpen={isTagSheetOpen}
        currentTags={styleTags}
        onClose={() => setIsTagSheetOpen(false)}
        onAddTag={addTag}
      />
    </PageLayout>
  );
};

const MyOutfitEditPage = () => {
  const { outfitId } = useParams();
  const { data: outfit, error, isPending, refetch } = useMyOutfit(outfitId);

  if (isPending) {
    return (
      <PageLayout
        showBottomNav={false}
        showHeader={true}
        showBack={true}
        title="수정하기"
      >
        <LoadingScreen message="수정할 코디를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  if (error || !outfit) {
    return (
      <PageLayout
        showBottomNav={false}
        showHeader={true}
        showBack={true}
        title="수정하기"
      >
        <ErrorScreen
          title="코디를 불러오지 못했어요."
          description={error?.message ?? '코디 정보를 찾을 수 없어요.'}
          onRetry={() => void refetch()}
        />
      </PageLayout>
    );
  }

  return <MyOutfitEditForm key={outfit.id} outfit={outfit} />;
};

export default MyOutfitEditPage;
