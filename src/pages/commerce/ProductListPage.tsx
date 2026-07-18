import { useState } from 'react';

import { Link } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import blackTurtleneckImage from '@/assets/images/commerce/black-turtleneck.png';
import coatImage from '@/assets/images/commerce/coat.png';
import ivoryKnitImage from '@/assets/images/commerce/ivory-knit.png';
import wideDenimImage from '@/assets/images/commerce/wide-denim.png';

const mockProductList = [
  {
    id: 1,
    name: '울 오버핏 코트',
    description: '전체적인 톤을 맞춰줘요',
    price: '190000',
    imgUrl: coatImage,
  },
  {
    id: 2,
    name: '아이보리 크루넥 니트',
    description: '부드러운 인상을 만들어요',
    price: '90000',
    imgUrl: ivoryKnitImage,
  },
  {
    id: 3,
    name: '흑청 와이드 데님',
    description: '균형감을 더해줘요',
    price: '19000',
    imgUrl: wideDenimImage,
  },
  {
    id: 4,
    name: '블랙 터틀넥',
    description: '세련된 분위기를 완성해요',
    price: '39000',
    imgUrl: blackTurtleneckImage,
  },
];

const ProductListPage = () => {
  const [products, setProducts] = useState(() => mockProductList);

  const handleRefresh = () => {
    setProducts((currentProducts) => [
      ...currentProducts.slice(1),
      currentProducts[0],
    ]);
  };

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

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8">
          {products.map((product) => (
            <Link
              to={`/commerce/${product.id}`}
              key={product.id}
              aria-label={`${product.name}, ${Number(product.price).toLocaleString('ko-KR')}원`}
              className="group min-w-0 overflow-hidden rounded-[16px] bg-white shadow-[0_2px_16px_rgba(31,33,36,0.18)] transition-transform duration-200 active:scale-[0.98]"
            >
              <div className="aspect-[156/158] overflow-hidden bg-[#F3F4F5]">
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex h-[58px] flex-col items-center justify-center bg-[#1F2124] px-2 text-center">
                <h2 className="max-w-full truncate text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]">
                  {product.name}
                </h2>
                <p className="max-w-full truncate text-[10px] font-medium leading-[1.65] tracking-[-0.02em] text-[#B2B8BD]">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleRefresh}
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
            다른 추천 아이템
          </button>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProductListPage;
