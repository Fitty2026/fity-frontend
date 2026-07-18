import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';

import { mockOutfits } from '../../mocks/data/outfit';
import type { ClothingItem, Outfit } from '../../types';

const recommendItems = [
  { id: '청자켓', category: '아우터', imageUrl: '' },
  { id: '바람막이', category: '아우터', imageUrl: '' },
  { id: '회색 볼레로', category: '아우터', imageUrl: '' },
  { id: '베이지 트렌치코트', category: '아우터', imageUrl: '' },
  { id: '블랙 레더 재킷', category: '아우터', imageUrl: '' },
  { id: '레이어드 티', category: '상의', imageUrl: '' },
  { id: '화이트 셔츠', category: '상의', imageUrl: '' },
  { id: '스트라이프 니트', category: '상의', imageUrl: '' },
  { id: '크롭 후드티', category: '상의', imageUrl: '' },
  { id: '블랙 와이드 팬츠', category: '하의', imageUrl: '' },
  { id: '연청 데님 팬츠', category: '하의', imageUrl: '' },
  { id: '베이지 카고 팬츠', category: '하의', imageUrl: '' },
  { id: '플리츠 미디 스커트', category: '하의', imageUrl: '' },
  { id: '화이트 스니커즈', category: '신발', imageUrl: '' },
  { id: '블랙 로퍼', category: '신발', imageUrl: '' },
  { id: '실버 러닝화', category: '신발', imageUrl: '' },
  { id: '브라운 숄더백', category: '가방', imageUrl: '' },
  { id: '블랙 미니 크로스백', category: '가방', imageUrl: '' },
  { id: '나일론 백팩', category: '가방', imageUrl: '' },
  { id: '실버 체인 목걸이', category: '액세서리', imageUrl: '' },
  { id: '블랙 볼캡', category: '액세서리', imageUrl: '' },
  { id: '심플 링 귀걸이', category: '액세서리', imageUrl: '' },
];

const CodyRetouch = () => {
  const [result, setResult] = useState<Outfit>();
  const [selectItem, setSelectItem] = useState<ClothingItem | null>();

  useEffect(() => {
    setResult(mockOutfits?.[0]);
  }, []);

  const navigate = useNavigate();
  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        수정할 아이템을 선택해주세요
      </h1>
      <div className="mt-[40px] mr-[24px] flex justify-beteewn gap-[16px]">
        <div className="flex-163 aspect-[163/439] overflow-hidden bg-blue">
          <img
            className="rounded-r-[24px] h-full object-cover"
            src={result?.imageUrl}
            alt={result?.createdAt}
          ></img>
        </div>

        {selectItem ? (
          <div className="flex-172 aspect-[172/439]  relative">
            <div className="bg-[#F6F7F8] rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]">
              <div className="h-[48px] w-[48px] object-cover">
                <img className="object-cover h-full" src={selectItem.imageUrl}></img>
              </div>
              <div className="pl-[8px]">
                <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
                  {selectItem.category}
                </p>
                <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
                  {selectItem.id}
                </h5>
              </div>
            </div>
            <div
              onClick={() => setSelectItem(null)}
              className="mt-[4px] flex justify-end items-center gap-[4px] text-[#5A6169] text-[10px] font-[500] leading-[165%] tracking-[-2%]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M8.01169 4.67373H10.5077L8.91719 3.08223C8.40513 2.57016 7.76729 2.20192 7.06779 2.01453C6.3683 1.82713 5.63179 1.82719 4.93232 2.01469C4.23285 2.20219 3.59507 2.57052 3.08309 3.08266C2.57111 3.5948 2.20297 4.2327 2.01569 4.93223M3.98869 7.32573H1.49269V9.82173M1.49269 7.32573L3.08269 8.91723C3.59475 9.42929 4.23258 9.79753 4.93208 9.98492C5.63158 10.1723 6.36808 10.1723 7.06755 9.98477C7.76702 9.79727 8.40481 9.42893 8.91679 8.91679C9.42877 8.40465 9.79691 7.76675 9.98419 7.06723M10.5077 2.17773V4.67273"
                  stroke="#6F7881"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              수정할 아이템 바꾸기
            </div>
            <h2 className="mt-[40px] text-[#474C52] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
              아래 아이템을 추천해요
            </h2>
            <div className="mt-[17px] flex flex-col h-[calc(100%-170px)] overflow-y-auto">
              {recommendItems
                .filter((item) => selectItem.category === item.category)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {}}
                    className="bg-[#F6F7F8] rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]"
                  >
                    <div className="h-[48px] w-[48px] object-cover">
                      <img className="object-cover h-full" src={item.imageUrl}></img>
                    </div>
                    <div className="pl-[8px]">
                      <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
                        {item.category}
                      </p>
                      <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
                        {item.id}
                      </h5>
                    </div>
                  </div>
                ))}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="15"
              viewBox="0 0 17 15"
              fill="none"
              className="absolute bottom-[-24px] right-1/2 translate-x-1/2"
            >
              <path
                d="M0.75 0.75L8.25 8.25L15.75 0.75M0.75 6.75L8.25 14.25L15.75 6.75"
                stroke="#CED1D5"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div className="flex gap-[24px] flex-col flex-172 aspect-[172/439] overflow-y-auto">
            {result?.items.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectItem(item)}
                className="bg-[#F6F7F8] rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]"
              >
                <div className="h-[48px] w-[48px] object-cover">
                  <img className="object-cover h-full" src={item.imageUrl}></img>
                </div>
                <div className="pl-[8px]">
                  <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
                    {item.category}
                  </p>
                  <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
                    {item.id}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-[48px] mx-[24px]">
        {selectItem ? (
          <div>
            <button className="w-full bg-[#E6E8EA] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
              추가 아이템 보러가기
            </button>
            <button className="mt-[8px] w-full bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
              수정하기
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate('/codyplay');
            }}
            className="w-full bg-[#E6E8EA] rounded-[32px] py-[16px] text-[#959BA7] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
          >
            수정하기
          </button>
        )}
      </div>
    </PageLayout>
  );
};

export default CodyRetouch;
