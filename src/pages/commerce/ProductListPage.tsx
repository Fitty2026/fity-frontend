import PageLayout from '@/components/layout/PageeLayout';

const mockProductList = [
  {
    id: 1,
    name: '울 오버핏 코트',
    description: '전체적인 톤을 맞춰줘요',
    gender: 'm',
    price: '190000',
    url: '',
    imgUrl: 'https://static.lookpin.co.kr/20250223125033-a52c/bb8a724e255a4399b2975545a33d16fa.jpg',
  },
  {
    id: 2,
    name: '하의',
    description: '힙한 무드를 연출할 수 있는 아이템이에요',
    gender: 'm',
    price: '90000',
    url: '',
    imgUrl: 'https://m.troubadour.kr/web/product/big/202505/bda60510d318641ada0b54ead25ec1ab.jpg',
  },
  {
    id: 3,
    name: '상의',
    description: '레이어드 기본적인 아이템이에요',
    gender: 'm',
    price: '19000',
    url: '',
    imgUrl:
      'https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/8SBR/24/11/29/GM0024112978689_0_THNAIL_ORGINL_20241203174400242.jpg',
  },
];

const ProductListPage = () => {
  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="추천 제품">
      <div className="flex flex-col mt-[30px] mx-[20px] gap-[16px]">
        {mockProductList.map((product) => (
          <div
            key={product.id}
            className="bg-[#FFFFFF] border rounded-[12px] border-[#E8E8E8] flex flex-row items-center cursor-pointer"
          >
            <img
              src={product.imgUrl}
              className="w-[96px] h-[96px] object-cover m-[16px] bg-[#eeeeee] rounded-[8px] "
            />
            <div className="flex flex-col items-start justify-center">
              <div className="h-[24px] w-[24px] bg-[#000000] rounded-[8px] text-center content-center text-[#ffffff] text-[10px]">
                M
              </div>
              <p className="text-[20px] text-[#1A1C1C] font-[500]">{product.name}</p>
              <p className="text-[14px] text-[#4C4546]">{product.description}</p>
              <p className="text-[14px] text-[#4C4546] mt-[4px]">
                {`${Number(product.price).toLocaleString('ko-KR')}원`}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="13"
              viewBox="0 0 8 13"
              fill="none"
              className="ml-auto mr-[16px]  self-center"
            >
              <path
                d="M1.07356 0.000323721L7.12174 6.0485L1.07356 12.0967L5.33906e-06 11.0231L4.97463 6.0485L6.20885e-06 1.07388L1.07356 0.000323721Z"
                fill="#1C1B1F"
              />
            </svg>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};
export default ProductListPage;
