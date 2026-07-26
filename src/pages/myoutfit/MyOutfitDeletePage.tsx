import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from '@/features/myoutfit/components/MyOutfitPageLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import DeleteConfirmModal from '@/features/myoutfit/components/DeleteConfirmModal';
import useDeleteMyOutfit from '@/features/myoutfit/hooks/useDeleteMyOutfit';
import { useMyOutfit } from '@/features/myoutfit/hooks/useMyOutfits';

const MyOutfitDeletePage = () => {
  const navigate = useNavigate();
  const { outfitId } = useParams();
  const { data: outfit, error, isPending, refetch } = useMyOutfit(outfitId);
  const deleteMutation = useDeleteMyOutfit();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="룩북">
        <LoadingScreen message="삭제할 코디를 불러오는 중이에요." />
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

  const confirmDelete = () => {
    if (deleteMutation.isPending) return;

    deleteMutation.mutate(outfit.id, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        setIsDeleted(true);
      },
    });
  };

  if (isDeleted) {
    return (
      <PageLayout
        showBottomNav={false}
        showHeader={true}
        title="Fitty"
        className="relative select-none"
      >
        <div className="flex flex-col items-center pt-[87px] text-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M29.48 18L28.788 36M19.212 36L18.52 18M31.5 10.785C33.828 10.965 36.148 11.23 38.456 11.579C39.14 11.683 39.82 11.793 40.5 11.911M38.456 11.579L36.32 39.345C36.233 40.476 35.722 41.531 34.89 42.302C34.058 43.072 32.966 43.499 31.832 43.499H16.168C15.034 43.499 13.942 43.072 13.11 42.302C12.278 41.531 11.767 40.476 11.68 39.345L9.544 11.579M9.544 11.579C8.86 11.681 8.18 11.791 7.5 11.909M9.544 11.579C11.852 11.23 14.172 10.965 16.5 10.785M31.5 10.785V8.953C31.5 6.593 29.68 4.625 27.32 4.551C25.107 4.48 22.893 4.48 20.68 4.551C18.32 4.625 16.5 6.595 16.5 8.953V10.785M31.5 10.785C26.507 10.399 21.493 10.399 16.5 10.785"
              stroke="#1F2124"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="mt-[28px] text-[24px] font-[600] leading-[150%] tracking-[-2%] text-[#1F2124]">
            코디가 삭제되었어요.
          </h2>
          <button
            type="button"
            onClick={() => navigate('/myoutfit/recently-deleted')}
            className="mt-[12px] text-[16px] font-[500] leading-[160%] tracking-[-2%] text-[#5A6169] underline underline-offset-[4px]"
          >
            최근 삭제한 코디 보러가기
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute bottom-[40px] left-[24px] right-[24px] rounded-[32px] bg-[#1F2124] py-[16px] text-[16px] font-[600] leading-[160%] tracking-[-2%] text-[#F6F7F8]"
        >
          룩북으로 돌아가기
        </button>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="룩북"
      className="select-none"
    >
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        코디를 삭제할까요?
      </h1>

      <div className="mt-[40px] relative mx-[40px] rounded-[24px] overflow-hidden">
        <img
          className="block aspect-[0.754/1] w-full object-cover"
          src={outfit.imageUrl}
          alt={`${outfit.context ?? '코디'} 착장`}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {deleteMutation.error && (
        <p className="mx-[24px] mt-[16px] text-center text-[13px] text-red-500">
          {deleteMutation.error.message}
        </p>
      )}

      <div className="mt-[30px] mx-[24px] flex flex-col gap-[6px] ">
        <button
          type="button"
          onClick={() => navigate(`/myoutfit/${outfit.id}`)}
          className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          아니요
        </button>
        <button
          type="button"
          disabled={deleteMutation.isPending}
          onClick={() => setIsConfirmOpen(true)}
          className="bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%] disabled:bg-[#B2B8BD]"
        >
          {deleteMutation.isPending ? '삭제 중...' : '삭제하기'}
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
};

export default MyOutfitDeletePage;
