import { useNavigate } from 'react-router-dom';
import { StudioHeader, StudioBottomNav, OptionCard } from '@/features/styling/components';
import usePuzzleStore from '@/store/puzzleStore';
import methodBlob from '@/assets/images/styling/method-blob.png';

/** 직접 코디하기 — 이미지/사진 아이콘 (Figma 32×32) */
const PhotoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21L9.87867 14.1213C10.1572 13.8428 10.488 13.6218 10.8519 13.471C11.2159 13.3202 11.606 13.2426 12 13.2426C12.394 13.2426 12.7841 13.3202 13.1481 13.471C13.512 13.6218 13.8428 13.8428 14.1213 14.1213L21 21M19 19L20.8787 17.1213C21.1572 16.8428 21.488 16.6218 21.8519 16.471C22.2159 16.3202 22.606 16.2426 23 16.2426C23.394 16.2426 23.7841 16.3202 24.1481 16.471C24.512 16.6218 24.8428 16.8428 25.1213 17.1213L29 21M5 26H27C27.5304 26 28.0391 25.7893 28.4142 25.4142C28.7893 25.0391 29 24.5304 29 24V8C29 7.46957 28.7893 6.96086 28.4142 6.58579C28.0391 6.21071 27.5304 6 27 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V24C3 24.5304 3.21071 25.0391 3.58579 25.4142C3.96086 25.7893 4.46957 26 5 26ZM19 11H19.0107V11.0107H19V11ZM19.5 11C19.5 11.1326 19.4473 11.2598 19.3536 11.3536C19.2598 11.4473 19.1326 11.5 19 11.5C18.8674 11.5 18.7402 11.4473 18.6464 11.3536C18.5527 11.2598 18.5 11.1326 18.5 11C18.5 10.8674 18.5527 10.7402 18.6464 10.6464C18.7402 10.5527 18.8674 10.5 19 10.5C19.1326 10.5 19.2598 10.5527 19.3536 10.6464C19.4473 10.7402 19.5 10.8674 19.5 11Z" stroke="#1F2124" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 상황별 코디 추천받기 — 쇼핑백 아이콘 (Figma 32×32) */
const BagIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 14V8C21 6.67392 20.4732 5.40215 19.5355 4.46447C18.5978 3.52678 17.3261 3 16 3C14.6739 3 13.4021 3.52678 12.4644 4.46447C11.5268 5.40215 11 6.67392 11 8V14M26.1413 11.3427L27.8253 27.3427C27.9186 28.2293 27.2253 29 26.3333 29H5.66665C5.45626 29.0002 5.24817 28.9562 5.05591 28.8708C4.86365 28.7853 4.69151 28.6604 4.55068 28.5041C4.40984 28.3478 4.30347 28.1636 4.23845 27.9635C4.17344 27.7634 4.15125 27.5519 4.17331 27.3427L5.85865 11.3427C5.89752 10.9741 6.07148 10.6329 6.34698 10.385C6.62248 10.1371 6.98002 9.99993 7.35065 10H24.6493C25.4173 10 26.0613 10.58 26.1413 11.3427ZM11.5 14C11.5 14.1326 11.4473 14.2598 11.3535 14.3536C11.2598 14.4473 11.1326 14.5 11 14.5C10.8674 14.5 10.7402 14.4473 10.6464 14.3536C10.5527 14.2598 10.5 14.1326 10.5 14C10.5 13.8674 10.5527 13.7402 10.6464 13.6464C10.7402 13.5527 10.8674 13.5 11 13.5C11.1326 13.5 11.2598 13.5527 11.3535 13.6464C11.4473 13.7402 11.5 13.8674 11.5 14ZM21.5 14C21.5 14.1326 21.4473 14.2598 21.3535 14.3536C21.2598 14.4473 21.1326 14.5 21 14.5C20.8674 14.5 20.7402 14.4473 20.6464 14.3536C20.5527 14.2598 20.5 14.1326 20.5 14C20.5 13.8674 20.5527 13.7402 20.6464 13.6464C20.7402 13.5527 20.8674 13.5 21 13.5C21.1326 13.5 21.2598 13.5527 21.3535 13.6464C21.4473 13.7402 21.5 13.8674 21.5 14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 코디 방식 선택 (스튜디오)
 * - 타이틀 블록 + 배경 blob + 방식 카드 2개 (직접 코디하기 / 상황별 코디 추천받기)
 * ※ 세부 px/타이포/blob 에셋은 Figma 스펙으로 확정 예정 (스캐폴드)
 */
const StylingMethodPage = () => {
  const navigate = useNavigate();
  const puzzleBalance = usePuzzleStore((s) => s.balance);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-[#F8F8FF] flex flex-col overflow-hidden">
        <StudioHeader count={puzzleBalance} />

        <div className="relative flex-1 overflow-y-auto pb-28">
          {/* 배경 blob — Figma: 289.26×314.27, top123/left69(아트보드) → 콘텐츠 top~20, rot -11.65°, crop */}
          <img
            src={methodBlob}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-[109px] top-[50px] w-[289.26px] h-[314.27px] object-cover rotate-[8.35deg]"
          />

          {/* 타이틀 블록 (헤더↔타이틀 72, 좌측 24) */}
          <div className="relative px-6 pt-[72px]">
            {/* 타이틀: Pretendard 700 / 24px / lh150% / -2% / #1F2124 (327×72) */}
            <h1 className="text-[24px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124] whitespace-pre-line">
              {'나만의 옷으로\n코디를 완성해보세요'}
            </h1>
            {/* 서브: Pretendard 500 / 14px / lh160% / -2% / #5A6169 (327×44), 타이틀↔서브 4 */}
            <p className="mt-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169] whitespace-pre-line">
              {'사진 한 장으로\n스타일을 더 스마트하게'}
            </p>
          </div>

          {/* 방식 카드 2개 (각 326×126, 서브타이틀↔카드 109) */}
          <div className="relative mt-[109px] px-6 flex flex-col gap-4">
            <OptionCard
              title="직접 코디하기"
              description={'보유한 옷을 직접 등록하고\n코디를 만들어보세요'}
              icon={<PhotoIcon />}
              onClick={() => navigate('/styling/items')}
            />
            <OptionCard
              title="상황별 코디 추천받기"
              description={'상황, 날씨, 장소에 맞는\n코디를 추천받아보세요'}
              icon={<BagIcon />}
              onClick={() => navigate('/styling/date')}
            />
          </div>
        </div>

        <StudioBottomNav />
      </div>
    </div>
  );
};

export default StylingMethodPage;
