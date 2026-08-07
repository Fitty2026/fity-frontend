import { toShoppingMallCode } from '@/features/closet/shoppingMalls';
import { colorChipStyle } from '@/features/closet/colors';
import { receiptProducts } from '@/store/closetStore';
import type { OcrProduct, OcrResult } from '@/store/closetStore';

/** 결제 정보 — OCR 응답에 없는 값이라 별도 목업 (API 연동 시 교체). 매장명·상품만 인식 결과에서 온다 */
const PAYMENT = {
  storeNumber: '028080810',
  approvalNumber: '03368261',
  method: '신한카드 (3178)',
  type: '일시불',
  subtotal: '79,900원',
  shipping: '0원',
  discount: '- 2,000원',
  total: '77,900원',
};

/** 주문상품 한 줄 — 295×66, 왼쪽 정보 + 오른쪽 옷 사진 */
const ProductRow = ({ product }: { product: OcrProduct }) => (
  <div className="flex w-full items-center gap-2 text-left">
    <div className="min-w-0 flex-1">
      {/* 브랜드 — Caption/C5 10px Bold, 217×16 */}
      <p className="text-[10px] font-bold leading-[1.65] tracking-[-0.02em] text-[#6F7881]">
        {product.brand}
      </p>
      {/* 상품명 — Body/B2, 217×26. 브랜드 바로 아래 (간격 없음) */}
      <p className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#34363C]">
        {product.name}
      </p>
      {/* 수량·가격·색상 — Caption/C3, 217×20. 상품명 아래 4 */}
      <p className="mt-1 flex items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#474C52]">
        {/* 수량·가격은 필수가 아니라 비어 있을 수 있다 — 빈 칸 대신 '-'로 자리를 지킨다 */}
        <span>
          {product.quantity || '-'}개 / {product.price || '-'} /
        </span>
        <span
          className="inline-block h-3 w-3 shrink-0 rounded-full border-[0.8px] border-[#E6E8EA]"
          style={colorChipStyle(product.color)}
        />
        <span>{product.color.label}</span>
      </p>
    </div>

    {/* 옷 사진 — 70×70, radius 4, border #E6E8EA (구 영수증 화면 스펙 그대로) */}
    {product.photo && (
      <img
        src={product.photo}
        alt=""
        className="h-[70px] w-[70px] shrink-0 rounded border border-[#E6E8EA] object-cover"
      />
    )}
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
 * Figma 도형은 원이 아니라 타원 17.06×23.88이 13개, 간격 24.64. 카드 하단선에 걸쳐 있어 절반만 파인다.
 * 고정 px로 반복하면 폭의 약수가 아니라 오른쪽 끝이 잘리므로, 개수로 나눠 균등 배치한다.
 */
const SCALLOP_COUNT = 13;
const SCALLOP_RX = 17.06 / 2;
const SCALLOP_RY = 23.88 / 2;

const scallopMask =
  `radial-gradient(ellipse ${SCALLOP_RX}px ${SCALLOP_RY}px at 50% 100%, transparent 99.5%, #000 100%), linear-gradient(#000, #000)`;

const scallopStyle = {
  WebkitMaskImage: scallopMask,
  maskImage: scallopMask,
  WebkitMaskSize: `calc(100% / ${SCALLOP_COUNT}) ${SCALLOP_RY}px, 100% calc(100% - ${SCALLOP_RY}px)`,
  maskSize: `calc(100% / ${SCALLOP_COUNT}) ${SCALLOP_RY}px, 100% calc(100% - ${SCALLOP_RY}px)`,
  WebkitMaskPosition: 'bottom left, top left',
  maskPosition: 'bottom left, top left',
  WebkitMaskRepeat: 'repeat-x, no-repeat',
  maskRepeat: 'repeat-x, no-repeat',
} as const;

/**
 * 영수증 카드 — 인식 결과를 실제 영수증 모양으로 보여준다. 확인 화면과 등록 완료 화면이 같이 쓴다.
 * ※ 시안 수치(카드 padding·타이포·톱니 크기) 미수급이라 임시.
 */
interface ReceiptCardProps {
  item: OcrResult;
  className?: string;
  /**
   * 상품이 둘 이상일 때 어느 상품을 수정할지 고르게 한다.
   * 넘기지 않으면 선택 없이 보여주기만 한다. 선택 테두리는 시안 미수급이라 임시.
   */
  selectedProduct?: number | null;
  /** 고른 줄을 다시 누르면 해제되도록 null도 넘어온다 */
  onSelectProduct?: (index: number | null) => void;
}

const ReceiptCard = ({
  item,
  className = '',
  selectedProduct = null,
  onSelectProduct,
}: ReceiptCardProps) => (
  // 마스크가 그림자를 잘라서 래퍼에서 drop-shadow로 준다 (위·아래 2겹)
  <div
    className={className}
    style={{
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.08)) drop-shadow(0 -8px 16px rgba(0,0,0,0.08))',
    }}
  >
    {/* 하단 양끝은 톱니로 잘려서 radius 없음 — 위쪽만 16 */}
    {/* 좌우 padding 16 — 구분선 295 = 327 - 32 */}
    <div className="rounded-t-[16px] bg-white px-4 pt-8 pb-8" style={scallopStyle}>
      {/* 매장명 — Title/T2 20px Bold, 블록 327×30. 쇼핑몰 코드(MUSINSA/ABLY/ZIGZAG)를 그대로 쓴다 */}
      <p className="text-center text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
        {toShoppingMallCode(item.store)}
      </p>
      {/* 매장번호 — Body/B7 14px Medium, 블록 327×22 */}
      <p className="text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
        {PAYMENT.storeNumber}
      </p>

      <div className="mt-6">
        <DoubleDivider />
      </div>

      {/* 결제 정보 — 한 행 295×26, 행 사이 4, 구분선 아래 16 */}
      <div className="mt-4 flex flex-col gap-1">
        {/* 승인일시는 수정 화면의 구매일을 그대로 쓴다 (OCR이 같은 값을 준다) */}
        <InfoRow label="승인일시" value={item.purchasedAt} />
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
      {/* 상품 행 295×66 — 라벨과 같은 폭(295 Fill)이라 들여쓰기 없음. 라벨 아래 8, 상품 사이 16 */}
      <div className="mt-2 flex flex-col gap-4">
        {receiptProducts(item).map((product, index, products) =>
          // 상품이 둘 이상일 때만 고를 수 있다 — 한 개면 고를 것이 없다
          onSelectProduct && products.length > 1 ? (
            <button
              key={index}
              type="button"
              // 고른 줄을 다시 누르면 해제
              onClick={() => onSelectProduct(selectedProduct === index ? null : index)}
              aria-pressed={selectedProduct === index}
              // 테두리 자리를 늘 차지하게 두어 선택해도 줄이 밀리지 않는다
              className={[
                'cursor-pointer rounded-lg border p-2',
                selectedProduct === index ? 'border-[#1F2124]' : 'border-transparent',
              ].join(' ')}
            >
              <ProductRow product={product} />
            </button>
          ) : (
            <ProductRow key={index} product={product} />
          ),
        )}
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

      {/* 총액 — 라벨·값 모두 18px Bold, 금액 목록 아래 32 */}
      <div className="mt-8 flex items-center justify-between text-[18px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
        <span>총 결제 금액</span>
        <span>{PAYMENT.total}</span>
      </div>
    </div>
  </div>
);

export default ReceiptCard;
