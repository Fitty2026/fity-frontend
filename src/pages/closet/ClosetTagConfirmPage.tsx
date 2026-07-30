import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { CtaButton, OcrItemRow, OnboardingTopBar } from '@/features/closet/components';
import { OCR_ITEMS } from '@/features/closet/ocrItems';

/**
 * 업로드한 사진 확인 — OCR이 인식한 옷 목록(이미지 + AI 생성 태그)을 훑어보는 화면.
 * 수정하기 → 옷 사진 수정, 확인 → 태그 수정.
 * ※ 리스트 327×395(세로 스크롤). 타이틀 아래 간격·행 간격은 시안에서 잰 값
 */
const ClosetTagConfirmPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} />

        {/* 타이틀 — 진행 바 아래 52 */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          업로드한 사진이 다음과 같나요?
        </h1>

        {/* 인식 결과 목록 — 327×395(left 24), 타이틀 아래 48, padding 10 / 행 간격 10, 세로 스크롤(스크롤바 숨김) */}
        <div
          className="mx-auto mt-12 h-[395px] w-[327px] overflow-y-auto p-2.5 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex flex-col gap-2.5">
            {OCR_ITEMS.map((item) => (
              <OcrItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* 하단 버튼 — 수정하기(연회색) / 확인(검정). 리스트와 16, 버튼 사이 8, 좌우 24, 하단 40 */}
        <div className="mt-auto flex flex-col gap-2 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))] pt-4">
          {/* 옷 사진 수정 — 화면 시안 대기 (라우트만 연결) */}
          <CtaButton label="수정하기" variant="fill" onClick={() => navigate('/closet/register/tags/photo')} />
          <CtaButton label="확인" onClick={() => navigate('/closet/register/tags/edit')} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetTagConfirmPage;
