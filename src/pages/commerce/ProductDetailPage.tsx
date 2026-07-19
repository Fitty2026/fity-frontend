import { useState } from 'react';

import PageLayout from '@/components/layout/PageeLayout';
import productImage from '@/assets/images/commerce/white-oversized-shirt.png';

const mockProduct = {
  id: 3,
  category: '상의',
  subcategory: '셔츠/블라우스',
  name: '클래식 오버핏 셔츠',
  styleTags: ['#데일리', '#출근'],
  rating: 4.8,
  price: 59000,
  discountRate: 30,
  salePrice: 41300,
  description:
    '부드러운 고밀도 코튼 소재로 제작된 클래식한 무드의 오버핏 셔츠입니다. 자연스럽게 떨어지는 숄더 라인과 여유있는 실루엣이 세련된 실루엣을 완성하며, 다양한 하의와 매치하기 좋은 에센셜 아이템입니다.',
  details: ['면 100%', '오버핏', '#미니멀', '#출근'],
};

const ProductDetailPage = () => {
  const [isFavorite, setIsFavorite] = useState(false);

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
          src={productImage}
          alt={mockProduct.name}
          className="h-full w-full object-cover"
        />
      </div>

      <article className="mx-6 mt-7">
        <div className="flex items-center gap-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
          <span>{mockProduct.category}</span>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
            <path
              d="M1 1L5 5L1 9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{mockProduct.subcategory}</span>
        </div>

        <h1 className="mt-1 text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          {mockProduct.name}
        </h1>

        <p className="text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
          {mockProduct.styleTags.join('')}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 1.75L12.5 6.82L18.1 7.63L14.05 11.58L15 17.15L10 14.52L5 17.15L5.95 11.58L1.9 7.63L7.5 6.82L10 1.75Z"
              fill="#FFB534"
            />
          </svg>
          <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
            {mockProduct.rating}
          </span>
        </div>

        <p className="mt-2 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#959BA7] line-through">
          {mockProduct.price.toLocaleString('ko-KR')}원
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#F04438]">
            {mockProduct.discountRate}%
          </span>
          <strong className="text-[24px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            {mockProduct.salePrice.toLocaleString('ko-KR')}원
          </strong>
        </div>

        <p className="mt-5 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
          {mockProduct.description}
        </p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {mockProduct.details.map((detail) => (
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
          className="h-14 flex-1 rounded-full bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
        >
          구매하러 가기
        </button>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
