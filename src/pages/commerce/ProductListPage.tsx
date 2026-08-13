import { Link } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorScreen from '@/components/ui/ErrorScreen';
import { useRecommendedProducts } from '@/features/commerce/hooks/useCommerceProducts';

const ProductListPage = () => {
  const { data, error, isPending, isFetching, refetch } = useRecommendedProducts();

  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="스튜디오"
    >
      <section className="px-6 pt-[56px] pb-10">
        <header className="text-center">
          <h1 className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            추천해요
          </h1>
          <p className="mt-0.5 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
            클릭하면 간단한 정보를 볼 수 있어요
          </p>
        </header>

        {isPending ? (
          <LoadingScreen message="추천 상품을 불러오는 중이에요." />
        ) : error ? (
          <ErrorScreen
            title="추천 상품을 불러오지 못했어요."
            description={error.message}
            onRetry={() => void refetch()}
          />
        ) : data.products.length === 0 ? (
          <p className="mt-10 text-center text-[14px] font-medium text-[#6F7881]">
            추천 상품이 없어요.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8">
          {data.products.map((product) => (
            <Link
              to={`/commerce/${product.id}`}
              key={product.id}
              aria-label={`${product.name}, ${Number(product.price).toLocaleString('ko-KR')}원`}
              className="group min-w-0 overflow-hidden rounded-[16px] bg-white shadow-[0_2px_16px_rgba(31,33,36,0.18)] transition-transform duration-200 active:scale-[0.98]"
            >
              <div className="aspect-[156/158] overflow-hidden bg-[#F3F4F5]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex h-[58px] flex-col items-center justify-center bg-[#1F2124] px-2 text-center">
                <h2 className="max-w-full truncate text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]">
                  {product.name}
                </h2>
                <p className="max-w-full truncate text-[10px] font-medium leading-[1.65] tracking-[-0.02em] text-[#B2B8BD]">
                  {product.recommendation}
                </p>
              </div>
            </Link>
          ))}
          </div>
        )}

        {!isPending && !error && data.products.length > 0 && (
          <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="flex items-center gap-2 py-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M19 8A8 8 0 0 0 5.47 5.47L3 8M5 16a8 8 0 0 0 13.53 2.53L21 16M3 3v5h5M21 21v-5h-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isFetching ? '추천 아이템 불러오는 중' : '다른 추천 아이템'}
          </button>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default ProductListPage;
