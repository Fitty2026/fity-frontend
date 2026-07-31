import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import dressImg from '@/assets/images/commerce/denim-maxi-dress.png';

/** 영수증 mock — 무신사 구매 1건 (백엔드 연동 시 스크래핑 결과로 대체) */
const MOCK_RECEIPT = {
  store: 'MUSINSA',
  bizNumber: '028080810',
  approvedAt: '2026.06.28. 13:45:55',
  approvalNo: '03368261',
  payMethod: '신한카드 (3178)',
  payType: '일시불',
  product: {
    imageUrl: dressImg,
    brand: '무신사 스탠다드 우먼',
    name: '패널드 데님 맥시 드레스',
    option: '(딥 인디고)',
    quantity: 1,
    price: 79900,
  },
  subtotal: 79900,
  shipping: 0,
  couponDiscount: -2000,
  total: 77900,
};

const won = (n: number) => `${n < 0 ? '- ' : ''}${Math.abs(n).toLocaleString('ko-KR')}원`;

/** 뒤로가기 — 24×24 */
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 영수증 정보 행 — 좌 라벨(#959BA7) / 우 값(#1F2124), B3 16 Medium */
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex h-[26px] items-center justify-between text-[16px] font-medium leading-[1.6] tracking-[-0.02em]">
    <span className="text-[#959BA7]">{label}</span>
    <span className="text-[#1F2124]">{value}</span>
  </div>
);

/** 점선 구분선 — dash 3 / gap 3, #CED1D5 (Figma dashes 3,3) */
const DashedLine = () => (
  <svg width="100%" height="1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="#CED1D5" strokeWidth="1" strokeDasharray="3 3" />
  </svg>
);

/**
 * 카드 밑단 스캘럽 — Figma SVG의 노치 1개(24.64×12)를 그대로 SVG 마스크로 써서 반복.
 * 노치: 폭 17.06, 깊이 11.94, 양옆 flat 3.79(총 gap 7.58). 베지어 곡선 그대로.
 * white = 카드 유지, 투명 = 노치(파임). maskSize 24.64×100%, 하단 정렬로 밑단만 파임.
 * (drop-shadow는 부모 wrapper에 걸어 마스크된 shape를 따라감)
 */
const NOTCH_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24.64' height='12' preserveAspectRatio='none'%3E%3Cpath d='M0 0 H24.64 V12 H20.85 C20.85 6.41 17.03 0.06 12.32 0.06 C7.61 0.06 3.79 6.41 3.79 12 H0 Z' fill='%23000'/%3E%3C/svg%3E";

// 2겹: (1) 상단 solid로 카드 대부분 유지, (2) 하단 12px 노치 띠. 합집합(add) 마스크.
const CARD_MASK = {
  WebkitMaskImage: `linear-gradient(#000, #000), url("${NOTCH_SVG}")`,
  maskImage: `linear-gradient(#000, #000), url("${NOTCH_SVG}")`,
  WebkitMaskSize: '100% calc(100% - 12px), 24.64px 12px',
  maskSize: '100% calc(100% - 12px), 24.64px 12px',
  WebkitMaskPosition: 'left top, left bottom',
  maskPosition: 'left top, left bottom',
  WebkitMaskRepeat: 'no-repeat, repeat-x',
  maskRepeat: 'no-repeat, repeat-x',
} as const;


/**
 * 영수증 불러오기 — 무신사 구매 영수증 확인 화면 (Figma 스펙 기준).
 * 하단 CTA로 구매내역 인식 로딩 화면(recognizing)으로 이동.
 * 다음 화면 이동 트리거는 와이어프레임 미정 → 임시 "불러오기" 버튼.
 */
const ClosetReceiptPage = () => {
  const navigate = useNavigate();
  const r = MOCK_RECEIPT;

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        {/* 상단바 — back + Fitty + 진행 바 */}
        <div className="relative">
          <OnboardingTopBar progress={300 / 375} />
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-6 top-[14px] cursor-pointer"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 pt-8">
          {/* 영수증 카드 래퍼 — drop-shadow로 스캘럽 shape 따라감 (box-shadow는 마스크에 잘림).
              blur 8 = box-shadow spec blur 16 과 동일 시각 (0 ±8 16 #00000014). */}
          <div style={{ filter: 'drop-shadow(0 8px 8px #00000014) drop-shadow(0 -8px 8px #00000014)' }}>
            {/* 카드 본문 — 위 모서리 radius 16(하단 코너 직각), 하단 스캘럽 노치(마스크) */}
            <div className="rounded-t-2xl bg-white px-4 pb-8 pt-[34px]" style={CARD_MASK}>
            {/* 가맹점 */}
            <div className="flex flex-col items-center">
              <h1 className="text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">{r.store}</h1>
              <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">{r.bizNumber}</p>
            </div>

            {/* 상단 이중 실선 (#CED1D5, gap 4) */}
            <div className="mt-6 flex flex-col gap-1">
              <div className="border-t border-[#CED1D5]" />
              <div className="border-t border-[#CED1D5]" />
            </div>

            {/* 결제 정보 (4행, gap 4) */}
            <div className="mt-4 flex flex-col gap-1">
              <Row label="승인일시" value={r.approvedAt} />
              <Row label="승인번호" value={r.approvalNo} />
              <Row label="결제수단" value={r.payMethod} />
              <Row label="결제구분" value={r.payType} />
            </div>

            {/* 점선 */}
            <div className="mt-3">
              <DashedLine />
            </div>

            {/* 주문상품 (label + 상품, gap 8) */}
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">주문상품</span>
              <div className="flex items-center gap-2">
                <img
                  src={r.product.imageUrl}
                  alt=""
                  className="h-[70px] w-[70px] shrink-0 rounded border border-[#E6E8EA] object-cover"
                />
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-[10px] font-bold leading-[1.65] tracking-[-0.02em] text-[#6F7881]">
                    {r.product.brand}
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
                        {r.product.name}
                      </span>
                      <span className="text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
                        {r.product.option}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#474C52]">
                      <span>{r.product.quantity}개</span>
                      <span>/</span>
                      <span>{won(r.product.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 점선 */}
            <div className="mt-8">
              <DashedLine />
            </div>

            {/* 금액 (합계 그룹 gap 4 → 32 → 총 결제 금액) */}
            <div className="mt-4 flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <Row label="상품 합계" value={won(r.subtotal)} />
                <Row label="배송비" value={won(r.shipping)} />
                <Row label="쿠폰 할인" value={won(r.couponDiscount)} />
              </div>
              <div className="flex items-center justify-between text-[18px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                <span>총 결제 금액</span>
                <span>{won(r.total)}</span>
              </div>
            </div>

            </div>
          </div>
        </div>

        {/* 하단 CTA — 불러오는 중 화면으로 (트리거 미정, 임시 버튼) */}
        <div className="w-full px-6 pt-3 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet/register/recognizing')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            불러오기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptPage;
