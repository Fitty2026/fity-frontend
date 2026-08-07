import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar, ReceiptCard } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 흰 체크 → 검정 체크 전환 (Figma: after delay 800ms, dissolve 300ms ease-out) */
const CHECK_SWAP_MS = 800;

/** 등록 완료 체크 한 장 — 48×48 */
const CheckIcon = ({ circle, stroke }: { circle: string; stroke: string }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="24" cy="24" r="24" fill={circle} />
    <path d="M13 25L21.8 33L35 15" stroke={stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 흰 바탕 → 검정 바탕 디졸브 — 두 장을 겹쳐두고 투명도만 바꾼다 */
const CompleteIcon = ({ filled }: { filled: boolean }) => (
  <div className="relative h-12 w-12">
    <span
      className="absolute inset-0 transition-opacity duration-300 ease-out"
      style={{ opacity: filled ? 0 : 1 }}
    >
      <CheckIcon circle="#F6F7F8" stroke="#1F2124" />
    </span>
    <span
      className="absolute inset-0 transition-opacity duration-300 ease-out"
      style={{ opacity: filled ? 1 : 0 }}
    >
      <CheckIcon circle="#1F2124" stroke="#F6F7F8" />
    </span>
  </div>
);

/** 장 넘김 화살표 — 20×20, stroke #B2B8BD 1.5 (Figma) */
const PagerIcon = ({ direction }: { direction: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d={direction === 'prev' ? 'M12.5 4.375L6.875 10L12.5 15.625' : 'M7.5 4.375L13.125 10L7.5 15.625'}
      stroke="#B2B8BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 영수증 등록 성공 — 인식·확인된 정보를 영수증 형태로 보여준다.
 * ※ 업로드 플로우는 목록(receipt-confirm)에서 끝나 이 화면을 거치지 않는다 — 진입 경로 확인 필요.
 */
const ClosetOcrCompletePage = () => {
  const navigate = useNavigate();
  // ?receipt=1이 첫 장 — 배열 index는 -1
  const [searchParams] = useSearchParams();
  const results = useClosetStore((state) => state.ocrResults);
  const receipt = Number(searchParams.get('receipt') ?? 1);
  const current = receipt - 1;
  const item = results[current];
  // 여러 장을 등록했으면 카드 좌우 화살표로 넘겨 본다
  const goReceipt = (next: number) =>
    navigate(`/closet/register/ocr-complete?receipt=${next + 1}`, { replace: true });
  // 흰 체크로 시작해 1초 뒤 검정 체크 + '코디 시작하기' 활성
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFilled(true), CHECK_SWAP_MS);
    return () => clearTimeout(timer);
  }, []);

  // 영수증 영역을 마우스 드래그로도 훑을 수 있게 (데스크톱에선 드래그가 스크롤을 일으키지 않는다)
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startTop: number } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return; // 터치는 네이티브 스크롤에 맡긴다
    // 버튼 위에서 시작한 포인터는 잡지 않는다 — 캡처하면 클릭이 버튼까지 못 간다
    if ((event.target as HTMLElement).closest('button')) return;
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
  if (!item) return <Navigate to="/closet/register/receipt-confirm" replace />;

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col h-[100dvh] min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} />

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          // 버튼이 위에 떠 있으므로 그 높이(58×2 + 8 + 하단 40)만큼 여백을 둔다
          className="flex-1 overflow-y-auto px-6 pb-[164px] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 완료 표시 — 48×48, 진행 바 아래 84 */}
          <div className="mt-[84px] flex justify-center">
            <CompleteIcon filled={filled} />
          </div>
          {/* Title/T3 — 블록 375×30, 체크 아래 24 */}
          <p className="mt-6 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            영수증 정보가 등록되었어요
          </p>

          {/* 영수증 카드 327×621, 문구 아래 56. 여러 장이면 좌우에 넘김 버튼이 카드 모서리에 걸친다 */}
          <div className="relative mt-14">
            <ReceiptCard item={item} />

            {results.length > 1 && (
              <>
                {/* 32×32 원, bg #F6F7F8, shadow 0 4px 16px rgba(0,0,0,0.16). 중심이 카드 좌우 끝에 온다 */}
                <button
                  type="button"
                  disabled={current === 0}
                  onClick={() => goReceipt(current - 1)}
                  aria-label="이전 영수증"
                  className={[
                    'absolute left-0 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#F6F7F8] shadow-[0px_4px_16px_rgba(0,0,0,0.16)]',
                    current === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                  ].join(' ')}
                >
                  <PagerIcon direction="prev" />
                </button>
                <button
                  type="button"
                  disabled={current === results.length - 1}
                  onClick={() => goReceipt(current + 1)}
                  aria-label="다음 영수증"
                  className={[
                    'absolute right-0 top-1/2 flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#F6F7F8] shadow-[0px_4px_16px_rgba(0,0,0,0.16)]',
                    current === results.length - 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                  ].join(' ')}
                >
                  <PagerIcon direction="next" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 하단 고정 버튼 — 327×58 두 개, 사이 8. 바탕 없이 떠 있고 내용은 뒤로 스크롤된다 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))] [&>button]:pointer-events-auto">
          <button
            type="button"
            onClick={() => navigate('/closet/items')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
          >
            옷장 보러가기
          </button>
          {/* 체크가 검정으로 바뀐 뒤에만 활성 */}
          <button
            type="button"
            disabled={!filled}
            onClick={() => navigate('/styling')}
            className={[
              'h-[58px] w-full rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
              filled
                ? 'cursor-pointer bg-[#1F2124] text-[#F6F7F8]'
                : 'cursor-not-allowed bg-[#F6F7F8] text-[#1F2124]',
            ].join(' ')}
          >
            코디 시작하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetOcrCompletePage;
