import { useState } from 'react';
import { Link } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const mockProductList = [
  {
    id: 1,
    name: '울 오버핏 코트',
    description: '전체적인 톤을 맞춰줘요',
    url: '',
    imgUrl: 'https://static.lookpin.co.kr/20250223125033-a52c/bb8a724e255a4399b2975545a33d16fa.jpg',
  },
  {
    id: 2,
    name: '하의',
    description: '힙한 무드를 연출할 수 있는 아이템이에요',
    url: '',
    imgUrl: 'https://m.troubadour.kr/web/product/big/202505/bda60510d318641ada0b54ead25ec1ab.jpg',
  },
  {
    id: 3,
    name: '상의',
    description: '레이어드 기본적인 아이템이에요',
    url: '',
    imgUrl:
      'https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/8SBR/24/11/29/GM0024112978689_0_THNAIL_ORGINL_20241203174400242.jpg',
  },
];

const OutfitResultPage = () => {
  const [productIndex, setProductIndex] = useState(0);

  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="코디 완성">
      <div className="ResultImg mx-[20px] mt-[20px]  rounded-[12px] aspect-[3/4] flex flex-col items-center justify-center ">
        <img
          src="https://static.lookpin.co.kr/20250223125033-a52c/bb8a724e255a4399b2975545a33d16fa.jpg"
          alt="코디완성 이미지"
          className="w-[100%] h-[100%] object-cover bg-[#F5F5F5] rounded-[12px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        />
        <p className="text-[14px] text-[#5E5E5E] my-[15px] text-medium font-[500]">
          아래 추천 제품으로 코디를 더 예쁘게 완성하세요!
        </p>
      </div>
      <div className="RecomendProduct mx-[20px] text-center">
        <Swiper
          className="border rounded-[12px] border-[#E8E8E8]"
          onSlideChange={(swiper) => setProductIndex(swiper.realIndex)}
        >
          {mockProductList.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                to={`/commerce/:${product.id}`}
                className="flex flex-row items-center cursor-pointer"
              >
                <img
                  src={product.imgUrl}
                  className="w-[96px] h-[96px] object-cover m-[16px] bg-[#eeeeee] rounded-[8px] "
                />
                <div className="flex flex-col items-start justify-center gap-[4px]">
                  <p className="text-[20px] text-[#1A1C1C] font-[500]">{product.name}</p>
                  <p className="text-[14px] text-[#4C4546]">{product.description}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="13"
                  viewBox="0 0 8 13"
                  fill="none"
                  className="ml-auto mr-[16px] mt-[16px] self-start"
                >
                  <path
                    d="M1.07356 0.000323721L7.12174 6.0485L1.07356 12.0967L5.33906e-06 11.0231L4.97463 6.0485L6.20885e-06 1.07388L1.07356 0.000323721Z"
                    fill="#1C1B1F"
                  />
                </svg>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="Pagenation flex justify-center items-center my-[15px] gap-[4px]">
          {mockProductList.map((_, index) => (
            <div
              key={index}
              className={`w-[8px] h-[8px] rounded-full ${index === productIndex ? 'bg-[#000000]' : 'bg-[#E2E2E2]'}`}
            ></div>
          ))}
        </div>
        <Link
          to={`/commerce`}
          className="text-[16px] text-[#4C4546] text-medium font-[500] underline decoration-[#D4D4D8] underline-offset-4 cursor-pointer"
        >
          부족 아이템 전체 보기
        </Link>
        <Link
          to={'/outfit/save'}
          className="mt-[40px] mx-[20px] border bg-[#000000] h-[48px] rounded-[8px]  text-[16px] text-[#FFFFFF] text-medium font-[500] text-center flex items-center justify-center cursor-pointer"
        >
          저장하기
        </Link>
        <Link
          to={''}
          className="my-[15px] mx-[20px] border rounded-[8px] h-[48px] text-[16px] text-[#000000] text-medium font-[500] text-center flex items-center justify-center cursor-pointer"
        >
          다른 코디 하기
        </Link>
      </div>
    </PageLayout>
  );
};

export default OutfitResultPage;
