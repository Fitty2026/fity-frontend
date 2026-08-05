import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 결제 정보 — OCR 응답에 없는 값이라 별도 목업 (API 연동 시 교체) */
const PAYMENT = {
  store: '무신사 스탠다드 강남점',
  storeNumber: '028080810',
  approvedAt: '2026.06.28. 13:45:55',
  approvalNumber: '03368261',
  method: '신한카드 (3178)',
  type: '일시불',
  subtotal: '79,900원',
  shipping: '0원',
  discount: '- 2,000원',
  total: '77,900원',
};

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

/** 매장 아래 구분선 — 295×4, 1px 두 줄이 4 간격 (#CED1D5) */
const DoubleDivider = () => <div className="h-[5px] border-y border-[#CED1D5]" />;

/** 점선 구분선 — 295×1, dash 3/3, #CED1D5 (border-dashed는 간격이 달라 gradient로 그린다) */
const Divider = () => (
  <div
    className="h-px w-full"
    style={{
      backgroundImage: 'repeating-linear-gradient(to right, #CED1D5 0 3px, transparent 3px 6px)',
    }}
  />
);

/** 라벨 좌 / 값 우 한 줄 — 295×26 */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">{label}</span>
    <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{value}</span>
  </div>
);

/**
 * 하단 톱니(영수증 절취선) — 마스크로 카드 아래쪽을 파낸다.
 * Figma 도형 기준 반원 반지름 12, 간격 24.64 → 327폭에 13개.
 * 고정 px로 반복하면 폭의 약수가 아니라 오른쪽 끝이 잘리므로, 개수로 나눠 균등 배치한다.
 */
const SCALLOP_RADIUS = 12;
const SCALLOP_COUNT = 13;

const scallopMask =
  `radial-gradient(circle ${SCALLOP_RADIUS}px at 50% 100%, transparent ${SCALLOP_RADIUS}px, #000 ${SCALLOP_RADIUS + 0.5}px), linear-gradient(#000, #000)`;

const scallopStyle = {
  WebkitMaskImage: scallopMask,
  maskImage: scallopMask,
  WebkitMaskSize: `calc(100% / ${SCALLOP_COUNT}) ${SCALLOP_RADIUS}px, 100% calc(100% - ${SCALLOP_RADIUS}px)`,
  maskSize: `calc(100% / ${SCALLOP_COUNT}) ${SCALLOP_RADIUS}px, 100% calc(100% - ${SCALLOP_RADIUS}px)`,
  WebkitMaskPosition: 'bottom left, top left',
  maskPosition: 'bottom left, top left',
  WebkitMaskRepeat: 'repeat-x, no-repeat',
  maskRepeat: 'repeat-x, no-repeat',
} as const;

/**
 * 영수증 등록 성공 — 인식·확인된 정보를 영수증 형태로 보여준다.
 * ※ 시안 수치(카드 padding·타이포·톱니 크기) 미수급이라 임시.
 */
const ClosetOcrCompletePage = () => {
  const navigate = useNavigate();
  const item = useClosetStore((state) => state.ocrResult);
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

          {/* 영수증 카드 327×621, 문구 아래 56 — 마스크가 그림자를 잘라서 래퍼에서 drop-shadow로 준다 (위·아래 2겹) */}
          <div
            className="mt-14"
            style={{
              filter:
                'drop-shadow(0 8px 16px rgba(0,0,0,0.08)) drop-shadow(0 -8px 16px rgba(0,0,0,0.08))',
            }}
          >
            {/* 하단 양끝은 톱니로 잘려서 radius 없음 — 위쪽만 16 */}
            {/* 좌우 padding 16 — 구분선 295 = 327 - 32 */}
            <div className="rounded-t-[16px] bg-white px-4 pt-[41px] pb-8" style={scallopStyle}>
              {/* 매장명 — Title/T2 20px Bold, 블록 327×30 */}
              <p className="text-center text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
                {PAYMENT.store}
              </p>
              {/* 매장번호 — Body/B7 14px Medium, 블록 327×22 */}
              <p className="text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
                {PAYMENT.storeNumber}
              </p>

              <div className="mt-6">
                <DoubleDivider />
              </div>

              {/* 결제 정보 — 한 행 295×26, 구분선 아래 16 */}
              <div className="mt-4">
                <InfoRow label="승인일시" value={PAYMENT.approvedAt} />
                <InfoRow label="승인번호" value={PAYMENT.approvalNumber} />
                <InfoRow label="결제수단" value={PAYMENT.method} />
                <InfoRow label="결제구분" value={PAYMENT.type} />
              </div>

              {/* 결제 정보 아래 12 */}
              <div className="mt-3">
                <Divider />
              </div>

              {/* 주문상품 — 라벨 295×26 (Body/B3), 구분선 아래 16 */}
              <p className="mt-4 text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                주문상품
              </p>
              {/* 상품 행 295×70 — 썸네일 70×70 + 간격 8 + 텍스트 217 */}
              <div className="flex gap-2">
                {/* 상품 이미지 — OCR 응답 image_url이 null일 수 있어 자리만 잡아둔다 */}
                <div className="h-[70px] w-[70px] shrink-0 rounded-[4px] border border-[#E6E8EA] bg-[#F6F7F8]" />
                <div className="min-w-0 flex-1">
                  {/* 브랜드 — Caption, 217×16 */}
                  <p className="text-[10px] font-medium leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
                    {item.brand}
                  </p>
                  {/* 상품명 — 217×26, 브랜드 아래 8 */}
                  <p className="mt-2 text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
                    {item.name}
                  </p>
                  {/* 수량·가격·색상 — 217×20 */}
                  <p className="flex items-center gap-1 text-[12px] font-medium leading-[1.6] tracking-[-0.02em] text-[#474C52]">
                    <span>
                      {item.quantity}개 / {item.price} /
                    </span>
                    <span
                      className="inline-block h-[10px] w-[10px] shrink-0 rounded-full"
                      style={{ backgroundColor: item.color.hex }}
                    />
                    <span>{item.color.label}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Divider />
              </div>

              {/* 금액 */}
              <div className="mt-4 flex flex-col gap-2">
                <InfoRow label="상품 합계" value={PAYMENT.subtotal} />
                <InfoRow label="배송비" value={PAYMENT.shipping} />
                <InfoRow label="쿠폰 할인" value={PAYMENT.discount} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  총 결제 금액
                </span>
                <span className="text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  {PAYMENT.total}
                </span>
              </div>
            </div>
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
