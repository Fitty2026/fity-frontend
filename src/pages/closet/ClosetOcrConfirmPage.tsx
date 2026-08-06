import { useRef } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar, ReceiptCard } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/**
 * 영수증 한 장 확인 — 인식 결과를 실제 영수증 모양으로 보여주고 수정으로 넘긴다.
 * 다른 장은 목록(receipt-done)에서 고르거나 뒤로 나가서 고른다.
 */
const ClosetOcrConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { index = '0' } = useParams();
  const results = useClosetStore((state) => state.ocrResults);
  const current = Number(index);
  const item = results[current];

  // 목록에서 들어왔는지 — 뒤로가기 목적지가 달라진다
  const fromList = (location.state as { from?: string } | null)?.from === 'list';

  // 영수증 영역을 마우스 드래그로도 훑을 수 있게 (데스크톱에선 드래그가 스크롤을 일으키지 않는다)
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startTop: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return; // 터치는 네이티브 스크롤에 맡긴다
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { startY: event.clientY, startTop: el.scrollTop };
    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !drag.current) return;
    el.scrollTop = drag.current.startTop - (event.clientY - drag.current.startY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    drag.current = null;
  };

  // 새로고침 등으로 스토어가 비어 없는 장을 가리키면 목록으로 되돌린다 (훅 호출 뒤에 둔다)
  if (!item) return <Navigate to="/closet/register/receipt-done" replace />;

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      {/* 높이를 고정해야 안쪽 flex-1 스크롤 영역이 기준을 잡는다 (#app-container는 min-h-screen) */}
      <div className="relative flex flex-col h-[100dvh] min-h-0 bg-white">
        {/* 목록에서 왔으면 목록으로 고정 — 수정을 거쳐 들어오면 히스토리 한 칸 뒤가 수정 화면이라 되돌아간다 */}
        <OnboardingTopBar
          progress={300 / 375}
          showBack
          onBack={() => (fromList ? navigate('/closet/register/receipt-done') : navigate(-1))}
        />

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          // 버튼이 위에 떠 있으므로 그 높이(58 + 하단 40)만큼 여백을 둔다
          className="flex-1 overflow-y-auto px-6 pb-[106px] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 타이틀 — 375×30 (Title/T3) */}
          <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            영수증 {current + 1}
          </h1>

          <ReceiptCard item={item} className="mt-14" />
        </div>

        {/* 하단 고정 버튼 — 327×58. 바탕 없이 떠 있고 내용은 뒤로 스크롤된다 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))] [&>button]:pointer-events-auto">
          <button
            type="button"
            onClick={() => navigate(`/closet/register/ocr-edit/${index}`, { state: location.state })}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
          >
            수정하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetOcrConfirmPage;
