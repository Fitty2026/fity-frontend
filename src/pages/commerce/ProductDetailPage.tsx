import PageLayout from '@/components/layout/PageeLayout';
import { Link } from 'react-router-dom';

const mockProduct = {
  id: 3,
  name: '상의',
  description: '레이어드 기본적인 아이템이에요',
  gender: 'm',
  price: '19000',
  saleprice: ' 13000',
  url: '',
  imgUrl:
    'https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/8SBR/24/11/29/GM0024112978689_0_THNAIL_ORGINL_20241203174400242.jpg',
};

const ProductDetailPage = () => {
  return (
    <PageLayout
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="상품 페이지"
      className="pb-[150px]"
    >
      <div className="ResultImg  rounded-[12px] aspect-[1/1] flex flex-col items-center justify-center ">
        <img
          src={mockProduct.imgUrl}
          alt={mockProduct.name}
          className="w-[100%] h-[100%] object-cover bg-[#F5F5F5] shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
        />
      </div>
      <p className="text-[12px] mt-[30px] mx-[20px] font-[700] font-['Epilogue'] text-[#5E5E5E]">
        ESSENTIAL COLLECTION
      </p>
      <h2 className="text-[32px] text-[#000000] font-[500] mx-[20px]">{mockProduct.name}</h2>
      <div className="flex mt-[10px] mb-[20px] gap-[10px] mx-[20px] items-end">
        {'saleprice' in mockProduct ? (
          <p className="text-[24px] text-[#000000] font-[600] font-['Epilogue'] ">{`₩${Number(mockProduct?.saleprice).toLocaleString('ko-KR')}`}</p>
        ) : (
          ''
        )}
        <p
          className={`${'saleprice' in mockProduct ? "text-[#7E7576] text-[14px] line-through font-[400] font-['Inter']" : "text-[24px] text-[#000000] font-[600] font-['Epilogue']"} `}
        >{`₩${Number(mockProduct?.price).toLocaleString('ko-KR')}`}</p>
      </div>
      <div className="mx-[20px] pt-[20px] border-t border-[#E2E2E2]">
        <h3 className="text-[12px] mb-[10px] font-[700] font-['Epilogue'] text-[#000000]">
          DESCRIPTION
        </h3>
        <p className="text-[14px] text-[#5E5E5E] font-[500]">
          부드러운 고밀도 코튼 소재로 제작된 클래식한 무드의 오 버핏 셔츠입니다. 자연스럽게 떨어지는
          숄더 라인과 여유 있는 실루엣이 세련된 실루엣을 완성하며, 다양한 하의와 매치하기 좋은
          에센셜 아이템입니다.
        </p>
      </div>
      <div className="mx-[20px] mt-[40px] flex gap-[20px] justify-between">
        <div className="bg-[#FFFFFF]  flex-1 border border-[#e2e2e2] rounded-[8px] p-[16px]">
          <h5 className="text-[12px]  font-[700] font-['Epilogue'] text-[#7E7576]">Fabric</h5>
          <p className="text-[#000000] text-[14px]  font-[400] font-['Inter']">Cotton 100%</p>
        </div>
        <div className="bg-[#FFFFFF] flex-1 border border-[#e2e2e2] rounded-[8px] p-[16px]">
          <h5 className="text-[12px]  font-[700] font-['Epilogue'] text-[#7E7576]">Fit</h5>
          <p className="text-[#000000] text-[14px]  font-[400] font-['Inter']">Oversized</p>
        </div>
      </div>
      <div className="mx-[20px] mt-[40px] flex gap-[20px] justify-between">
        <div className="bg-[#EEEEEE] flex-2 aspect-4/3 rounded-[8px]">
          <img
            src="https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/8SBR/24/11/29/GM0024112978689_0_THNAIL_ORGINL_20241203174400242.jpg"
            alt=""
            className="w-[100%] h-[100%] object-cover rounded-[8px] bg-[#F5F5F5] "
          ></img>
        </div>
        <div className=" flex-1 aspect-3/4  content-center">
          <div className="h-[90%] w-full bg-[#EEEEEE] rounded-[8px]">
            <img
              src="https://m.dtpflones.com/web/product/big/20191202/f81b4e157f4ab89d97f4ca6db9e37515.jpg"
              alt="원단"
              className="w-[100%] h-[100%] object-cover rounded-[8px] bg-[#F5F5F5] "
            ></img>
          </div>
        </div>
      </div>
      <div
        onClick={() => {}}
        className="flex gap-[20px] items-center px-[20px] fixed backdrop-blur-[12px] max-w-[430px]  z-10 border-t border-[#F4F4F5] bg-[##FFFFFFCC] bottom-[0px] right-1/2 translate-x-1/2 w-full"
      >
        <div className="border border-[#7E7576] bg-[#ffffff] cursor-pointer rounded-[8px] h-[56px] w-[56px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
          >
            <path
              d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35ZM10 15.65C11.6 14.2167 12.9167 12.9875 13.95 11.9625C14.9833 10.9375 15.8 10.0458 16.4 9.2875C17 8.52917 17.4167 7.85417 17.65 7.2625C17.8833 6.67083 18 6.08333 18 5.5C18 4.5 17.6667 3.66667 17 3C16.3333 2.33333 15.5 2 14.5 2C13.7167 2 12.9917 2.22083 12.325 2.6625C11.6583 3.10417 11.2 3.66667 10.95 4.35H9.05C8.8 3.66667 8.34167 3.10417 7.675 2.6625C7.00833 2.22083 6.28333 2 5.5 2C4.5 2 3.66667 2.33333 3 3C2.33333 3.66667 2 4.5 2 5.5C2 6.08333 2.11667 6.67083 2.35 7.2625C2.58333 7.85417 3 8.52917 3.6 9.2875C4.2 10.0458 5.01667 10.9375 6.05 11.9625C7.08333 12.9875 8.4 14.2167 10 15.65Z"
              fill="black"
            />
          </svg>
        </div>
        <Link
          to={'/outfit/share'}
          className="mt-[30px] mb-[30px] flex-1 border bg-[#000000] h-[56px] rounded-[8px]  text-[16px] text-[#FFFFFF] text-medium font-[500] text-center flex items-center justify-center cursor-pointer"
        >
          저장하기
        </Link>
      </div>
    </PageLayout>
  );
};
export default ProductDetailPage;
