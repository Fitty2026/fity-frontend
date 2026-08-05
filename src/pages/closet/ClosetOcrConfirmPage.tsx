import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 필드 한 칸 — 라벨(Body/B3, 327×26) + 값 박스 */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#B2B8BD]">
      {label}
    </span>
    {children}
  </div>
);

/** 값 박스 — 327×50, padding 12/16, 테두리만 (Body/B3) */
const ValueBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[50px] items-center rounded-lg border border-[#E6E8EA] bg-white px-4 text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C]">
    {children}
  </div>
);

/**
 * OCR 결과 확인 — 인식된 상품 정보를 보여주고 수정/확인을 받는다.
 * ※ 필드 간격·박스 높이·색상은 Figma 값 미수급이라 임시.
 */
const ClosetOcrConfirmPage = () => {
  const navigate = useNavigate();
  const result = useClosetStore((state) => state.ocrResult);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      {/* 높이를 고정해야 안쪽 flex-1 스크롤 영역이 기준을 잡는다 (#app-container는 min-h-screen) */}
      <div className="flex flex-col h-[100dvh] min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 타이틀 — 375×30 (Title/T3) */}
          <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            영수증 정보가 다음과 같아요?
          </h1>

          {/* 결과 폼 — 327 Hug(시안 656), 타이틀 아래 40. 감싸는 테두리 없음 */}
          <div className="mt-10 px-6">
            <div className="flex flex-col gap-4">
              <Field label="브랜드">
                <ValueBox>{result.brand}</ValueBox>
              </Field>
              <Field label="상품명">
                <ValueBox>{result.name}</ValueBox>
              </Field>
              <Field label="수량">
                <ValueBox>{result.quantity}</ValueBox>
              </Field>
              <Field label="옵션">
                {/* 사이즈 칩(Hug 46×50) + 색상 박스, 사이 간격 13 */}
                <div className="flex gap-[13px]">
                  <ValueBox>{result.size}</ValueBox>
                  <div className="flex-1">
                    <ValueBox>
                      {/* 색상 점 24×24, 문구와 간격 13 */}
                      <span
                        className="mr-[13px] h-6 w-6 shrink-0 rounded-full"
                        style={{ backgroundColor: result.color.hex }}
                      />
                      {/* Body/B2 — 16px SemiBold */}
                      <span className="font-semibold">{result.color.label}</span>
                    </ValueBox>
                  </div>
                </div>
              </Field>
              <Field label="가격">
                <ValueBox>{result.price}</ValueBox>
              </Field>
              <Field label="구매처">
                <ValueBox>{result.store}</ValueBox>
              </Field>
              <Field label="구매일">
                <ValueBox>{result.purchasedAt}</ValueBox>
              </Field>
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼 — 327×58 두 개, 사이 8 */}
        <div className="flex flex-col gap-2 px-6 pt-4 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet/register/ocr-edit')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/closet/register/ocr-complete')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            확인
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetOcrConfirmPage;
