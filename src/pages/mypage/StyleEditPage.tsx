import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import { STYLE_TILES } from '@/features/onboarding/constants';
import useSaveOnboardingStyle from '@/features/onboarding/hooks/useSaveOnboardingStyle';
import { getErrorMessage } from '@/lib/apiError';

const getCardRotation = (index: number) =>
  index % 4 === 0 || index % 4 === 3 ? '-rotate-[5deg]' : 'rotate-[5deg]';

const StyleEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();
  const { mutate: saveStyles, isPending, error } = useSaveOnboardingStyle();
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[] | null>(null);
  const navigationStyleIds = (location.state as { styleTagIds?: number[] } | null)?.styleTagIds;
  const currentStyleIds = selectedStyleIds ?? navigationStyleIds ?? profile?.styleTagIds ?? [];
  const initialized = selectedStyleIds !== null || navigationStyleIds !== undefined || !!profile;

  const selectedStyles = STYLE_TILES.filter((style) => currentStyleIds.includes(style.tagId));
  const emptySlots = Math.max(1, 4 - selectedStyles.length);

  const handleSave = () => {
    saveStyles(currentStyleIds, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
        navigate('/mypage/profile');
      },
    });
  };

  return (
    <MyPageScaffold
      title="스타일 수정"
      contentClassName="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      footer={
        <>
          {error ? (
            <p className="mb-2 text-center text-[13px] text-red-500">{getErrorMessage(error)}</p>
          ) : null}
          <MyPageButton
            disabled={!initialized || currentStyleIds.length === 0 || isPending}
            onClick={handleSave}
          >
            {isPending ? '저장 중...' : '저장하기'}
          </MyPageButton>
        </>
      }
    >
      <div className="px-6 pt-12">
        <h2 className="text-center text-[20px] font-semibold">스타일을 수정해주세요</h2>
        <div className="mt-14 grid grid-cols-[repeat(2,136px)] justify-between gap-y-8">
          {selectedStyles.map((style, index) => (
            <button
              type="button"
              key={style.tagId}
              aria-label={`${style.tag} 스타일 제외`}
              onClick={() =>
                setSelectedStyleIds(currentStyleIds.filter((id) => id !== style.tagId))
              }
              className={`${getCardRotation(index)} h-[176px] w-[136px] overflow-hidden rounded-[16px]`}
            >
              <img
                src={style.imageSrc}
                alt={`${style.tag} 스타일`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          {Array.from({ length: emptySlots }, (_, slot) => {
            const gridIndex = selectedStyles.length + slot;

            return (
              <button
                type="button"
                key={slot}
                onClick={() =>
                  navigate('/mypage/profile/style/select', {
                    state: { styleTagIds: currentStyleIds },
                  })
                }
                className={`${getCardRotation(gridIndex)} h-[176px] w-[136px] rounded-[16px] border-2 border-dashed border-[#CED1D5] text-[44px] font-light text-[#B2B8BD]`}
              >
                ＋
              </button>
            );
          })}
        </div>
      </div>
    </MyPageScaffold>
  );
};

export default StyleEditPage;
