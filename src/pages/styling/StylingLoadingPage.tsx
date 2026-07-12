import PageLayout from '@/components/layout/PageeLayout';
import SILHOUETTE from '@/assets/images/styling/ai-loading-silhouette.png';

/**
 * AI 코디 생성 로딩 (AI Outfit Generation, AI-01)
 * - 코디 생성 중 실루엣 + 진행률 표시 (정적 60%)
 * ※ 정확한 px/실제 실루엣 이미지는 추후 반영
 */
const StylingLoadingPage = () => {
  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col justify-center h-[100dvh] min-h-0 px-5 bg-[#F9F9F9]">
        {/* 타이틀 — Pretendard 500 / 24 / lh32 / tracking -0.24px / #000 */}
        <h1 className="text-2xl font-medium leading-8 tracking-[-0.24px] text-center text-black">코디를 만들고 있어요</h1>
        {/* 서브 — Pretendard 500 / 16 / lh24 / #5E5E5E, 타이틀↔서브 간격 8 */}
        <p className="mt-2 text-base font-medium leading-6 text-center text-[#5E5E5E] whitespace-pre-line">
          {'당신만을 위한 완벽한\n코디를 생성 중입니다'}
        </p>

        {/* 실루엣 + 진행률 (320×480, radius12, max-w320 중앙, bg #EEEEEE) */}
        <div className="relative mt-6 mx-auto w-full max-w-[320px] aspect-[320/480] rounded-xl overflow-hidden bg-[#EEEEEE]">
          <img src={SILHOUETTE} alt="코디 생성 중" className="w-full h-full object-cover opacity-40" />
          {/* 하단 진행률 오버레이 — 바 위 / LOADING·60% 아래. 좌우·바텀 인셋 16 */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
            {/* 트랙 288×4, radius full, bg #848484 20% / 진행 60% 검정 */}
            <div className="h-1 w-full rounded-full bg-[#848484]/20 overflow-hidden">
              <div className="h-full w-[60%] rounded-full bg-black" />
            </div>
            {/* 글씨: Epilogue 700 / 12 / lh16 / tracking 0.6px / #000. 바→텍스트 갭 8 */}
            <div className="mt-2 flex items-center justify-between font-['Epilogue'] font-bold [font-synthesis:none] text-[12px] leading-4 tracking-[0.6px] text-black">
              <span>LOADING</span>
              <span>60%</span>
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        {/* Figma: Pretendard 500 / 16 / lh24 / #000, 이미지↔이 텍스트 간격 32 */}
        <p className="mt-8 text-base font-medium leading-6 text-center text-black">잠시만 기다려주세요</p>
        {/* Figma: Pretendard 500 / 16 / lh24 / #5E5E5E, 간격 4 */}
        <p className="mt-1 text-base font-medium leading-6 text-center text-[#5E5E5E]">
          곧 추천 결과를 보여드릴게요
        </p>
      </div>
    </PageLayout>
  );
};

export default StylingLoadingPage;
