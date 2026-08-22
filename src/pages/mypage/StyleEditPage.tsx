import { useState, type CSSProperties } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import { STYLE_TILES } from '@/features/onboarding/constants';
import useSaveOnboardingStyle from '@/features/onboarding/hooks/useSaveOnboardingStyle';
import { getErrorMessage } from '@/lib/apiError';

import './styleEditPage.css';

const CARD_ROW_STEP = 208;
const CARD_CENTER_OFFSET_X = 80;

const getCardEnterStyle = (index: number, total: number) => {
  const row = Math.floor(index / 2);
  const rowCount = Math.ceil(total / 2);
  const centerRow = (rowCount - 1) / 2;
  const rotation = index % 4 === 0 || index % 4 === 3 ? -5 : 5;

  return {
    '--style-card-enter-x': `${index % 2 === 0 ? CARD_CENTER_OFFSET_X : -CARD_CENTER_OFFSET_X}px`,
    '--style-card-enter-y': `${(centerRow - row) * CARD_ROW_STEP}px`,
    '--style-card-rotation': `${rotation}deg`,
    '--style-card-delay': `${index * 45}ms`,
  } as CSSProperties;
};

const StyleEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();
  const { mutate: saveStyles, isPending, error } = useSaveOnboardingStyle();
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[] | null>(null);
  const [removingStyleId, setRemovingStyleId] = useState<number | null>(null);
  const navigationStyleIds = (location.state as { styleTagIds?: number[] } | null)?.styleTagIds;
  const currentStyleIds = selectedStyleIds ?? navigationStyleIds ?? profile?.styleTagIds ?? [];
  const initialized = selectedStyleIds !== null || navigationStyleIds !== undefined || !!profile;

  const selectedStyles = STYLE_TILES.filter((style) => currentStyleIds.includes(style.tagId));
  const emptySlots = Math.max(1, 4 - selectedStyles.length);
  const cardCount = selectedStyles.length + emptySlots;

  const removeStyle = (styleTagId: number) => {
    setSelectedStyleIds(currentStyleIds.filter((id) => id !== styleTagId));
    setRemovingStyleId(null);
  };

  const handleStyleRemove = (styleTagId: number) => {
    if (removingStyleId !== null) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      removeStyle(styleTagId);
      return;
    }

    setRemovingStyleId(styleTagId);
  };

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
        <div className="mt-14 grid grid-cols-[repeat(2,136px)] justify-center gap-x-10 gap-y-10">
          {selectedStyles.map((style, index) => (
            <button
              type="button"
              key={style.tagId}
              aria-label={`${style.tag} 스타일 제외`}
              disabled={removingStyleId !== null}
              onClick={() => handleStyleRemove(style.tagId)}
              onAnimationEnd={(event) => {
                if (
                  removingStyleId === style.tagId &&
                  event.animationName === 'style-edit-card-remove'
                ) {
                  removeStyle(style.tagId);
                }
              }}
              style={getCardEnterStyle(index, cardCount)}
              className={`style-edit-card h-[176px] w-[136px] overflow-hidden rounded-[16px] ${
                removingStyleId === style.tagId
                  ? 'style-edit-card--removing pointer-events-none'
                  : ''
              }`}
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
                key={`empty-${slot}`}
                onClick={() =>
                  navigate('/mypage/profile/style/select', {
                    state: { styleTagIds: currentStyleIds },
                  })
                }
                style={getCardEnterStyle(gridIndex, cardCount)}
                className="style-edit-card h-[176px] w-[136px] rounded-[16px] border-2 border-dashed border-[#CED1D5] text-[44px] font-light text-[#B2B8BD]"
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
