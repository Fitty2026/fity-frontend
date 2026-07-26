import { useState } from 'react';
import { useParams } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorScreen from '@/components/ui/ErrorScreen';
import { useCommerceProduct } from '@/features/commerce/hooks/useCommerceProducts';

const ProductDetailPage = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { productId } = useParams();
  const { data: product, error, isPending, refetch } = useCommerceProduct(productId);

  if (isPending) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
        <LoadingScreen message="상품 정보를 불러오는 중이에요." />
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
        <ErrorScreen
          title="상품 정보를 불러오지 못했어요."
          description={error?.message ?? '상품을 찾을 수 없어요.'}
          onRetry={() => void refetch()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="스튜디오"
      className="pb-[132px]"
    >
      <div className="mx-6 mt-6 aspect-[327/432] overflow-hidden bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <article className="mx-6 mt-7">
        <div className="flex items-center gap-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
          <span>{product.category}</span>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
            <path
              d="M1 1L5 5L1 9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{product.subcategory}</span>
        </div>

        <h1 className="mt-1 text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          {product.name}
        </h1>

        <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
          {product.styleTags.map((tag) => `#${tag}`).join(' ')}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 1.75L12.5 6.82L18.1 7.63L14.05 11.58L15 17.15L10 14.52L5 17.15L5.95 11.58L1.9 7.63L7.5 6.82L10 1.75Z"
              fill="#FFB534"
            />
          </svg>
          <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
            {product.rating}
          </span>
        </div>

        <p className="mt-2 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#959BA7] line-through">
          {product.price.toLocaleString('ko-KR')}원
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F04438]">
            {product.discountRate}%
          </span>
          <strong className="text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            {product.salePrice.toLocaleString('ko-KR')}원
          </strong>
        </div>

        <p className="mt-5 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
          {product.description}
        </p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {product.details.map((detail) => (
            <li
              key={detail}
              className="rounded-full border border-[#5A6169] px-2.5 py-1 text-[10px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]"
            >
              {detail}
            </li>
          ))}
        </ul>
      </article>

      <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 items-center gap-3 border-t border-[#CED1D5] bg-white px-6 pt-4 pb-10">
        <button
          type="button"
          onClick={() => setIsFavorite((current) => !current)}
          aria-label={isFavorite ? '찜 해제' : '찜하기'}
          aria-pressed={isFavorite}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] border border-[#B2B8BD] bg-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20.25L10.55 18.95C5.4 14.35 2 11.3 2 7.55C2 4.5 4.4 2.1 7.45 2.1C9.18 2.1 10.84 2.9 12 4.15C13.16 2.9 14.82 2.1 16.55 2.1C19.6 2.1 22 4.5 22 7.55C22 11.3 18.6 14.35 13.45 18.95L12 20.25Z"
              fill={isFavorite ? '#1F2124' : 'none'}
              stroke="#1F2124"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          disabled={!product.purchaseUrl}
          onClick={() => {
            if (product.purchaseUrl) {
              window.open(product.purchaseUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="h-14 flex-1 rounded-full bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
        >
          구매하러 가기
        </button>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
