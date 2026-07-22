import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';
import RetouchItem from '@/features/codyplay/components/RetouchItem';
import '@/features/codyplay/codyRetouch.css';

import { mockOutfits } from '../../mocks/data/outfit';
import type { ClothingItem, Outfit } from '../../types';

const createRecommendItem = (id: string, category: ClothingItem['category']): ClothingItem => ({
  id,
  category,
  imageUrl: '',
  tags: [],
  createdAt: '',
});

const recommendItems: ClothingItem[] = [
  createRecommendItem('청자켓', '아우터'),
  createRecommendItem('바람막이', '아우터'),
  createRecommendItem('회색 볼레로', '아우터'),
  createRecommendItem('베이지 트렌치코트', '아우터'),
  createRecommendItem('블랙 레더 재킷', '아우터'),
  createRecommendItem('레이어드 티', '상의'),
  createRecommendItem('화이트 셔츠', '상의'),
  createRecommendItem('스트라이프 니트', '상의'),
  createRecommendItem('크롭 후드티', '상의'),
  createRecommendItem('블랙 와이드 팬츠', '하의'),
  createRecommendItem('연청 데님 팬츠', '하의'),
  createRecommendItem('베이지 카고 팬츠', '하의'),
  createRecommendItem('플리츠 미디 스커트', '하의'),
  createRecommendItem('화이트 스니커즈', '신발'),
  createRecommendItem('블랙 로퍼', '신발'),
  createRecommendItem('실버 러닝화', '신발'),
  createRecommendItem('브라운 숄더백', '가방'),
  createRecommendItem('블랙 미니 크로스백', '가방'),
  createRecommendItem('나일론 백팩', '가방'),
  createRecommendItem('실버 체인 목걸이', '액세서리'),
  createRecommendItem('블랙 볼캡', '액세서리'),
  createRecommendItem('심플 링 귀걸이', '액세서리'),
];

const CodyRetouchPage = () => {
  const location = useLocation();
  const [result, setResult] = useState<Outfit | undefined>(() => mockOutfits[0]);
  const [selectItem, setSelectItem] = useState<ClothingItem | null>();
  const [selectCategory, setSelectCategory] = useState<string | null>();
  const [changeItem, setChangeItem] = useState<ClothingItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectItem(result?.items.find((item) => item.category === selectCategory));
  }, [selectCategory]);

  const handleChangeItem = () => {
    if (!selectItem || !changeItem) return;
    setResult((prevResult) => {
      if (!prevResult) return prevResult;

      return {
        ...prevResult,
        items: prevResult.items.map((item) => (item.id === selectItem.id ? changeItem : item)),
      };
    });
    setSelectItem(null);
    setChangeItem(null);
    setSelectCategory(null);
  };

  const deleteItemHandle = () => {
    setResult((prev) => {
      if (!prev || !selectItem) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.category !== selectItem.category),
      };
    });
  };

  return (
    <PageLayout showBottomNav={false} showHeader={true} showBack={true} title="스튜디오">
      <h1 className=" w-full text-[#1F2124] text-[20px] text-center font-[600] leading-[150%] mt-[56px] tracking-[-2%]">
        수정할 아이템을 선택해주세요
      </h1>
      <div className="mt-[40px] mr-[24px] flex justify-beteewn gap-[16px]">
        <div
          className={`${location.state?.animateImage ? 'retouch-image-enter' : ''} relative flex-163 aspect-[163/439] overflow-hidden bg-blue`}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={result?.imageUrl}
            alt={result?.createdAt}
          ></img>
        </div>

        {selectCategory ? (
          <div className="flex-172 aspect-[172/439]  relative">
            <div
              onClick={() => {
                setSelectItem(null);
                setChangeItem(null);
                setSelectCategory(null);
              }}
              className="bg-[#E6E8EA] rounded-[4px] h-[68px] shrink-0 flex items-center pl-[12px]"
            >
              <div className="h-[48px] w-[48px] object-cover">
                {result?.items.find((item=>item.category === selectCategory))?.imageUrl ? (
                  <img className="object-cover h-full" src={result?.items.find((item=>item.category === selectCategory))?.imageUrl}></img>
                ) : (
                  <div className="bg-[#F6F7F8] w-full h-full"></div>
                )}
              </div>
              <div className="pl-[8px]">
                <p className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
                 {selectCategory}
                </p>
                <h5 className="text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]">
                  {result?.items.find((item=>item.category === selectCategory))?.id ? result?.items.find((item=>item.category === selectCategory))?.id : '-'}
                </h5>
              </div>
            </div>
            <div
              onClick={deleteItemHandle}
              className="mt-[4px] flex justify-end items-center gap-[4px] text-[#5A6169] text-[10px] font-[500] leading-[165%] tracking-[-2%]"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.37 4.50026L7.197 9.00026M4.803 9.00026L4.63 4.50026M7.875 2.69676C8.45688 2.74181 9.03693 2.80802 9.614 2.89526C9.785 2.92126 9.955 2.94876 10.125 2.97826M9.614 2.89526L9.08 9.83676C9.05821 10.1194 8.93053 10.3833 8.72251 10.5759C8.51449 10.7684 8.24145 10.8753 7.958 10.8753H4.042C3.75855 10.8753 3.48551 10.7684 3.27749 10.5759C3.06947 10.3833 2.94179 10.1194 2.92 9.83676L2.386 2.89526M2.386 2.89526C2.215 2.92076 2.045 2.94826 1.875 2.97776M2.386 2.89526C2.96307 2.80802 3.54312 2.74181 4.125 2.69676M7.875 2.69676V2.23876C7.875 1.64876 7.42 1.15676 6.83 1.13826C6.27681 1.12058 5.72319 1.12058 5.17 1.13826C4.58 1.15676 4.125 1.64926 4.125 2.23876V2.69676M7.875 2.69676C6.62686 2.6003 5.37314 2.6003 4.125 2.69676"
                  stroke="#6F7881"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              아이템 삭제하기
            </div>
            <h2 className="mt-[40px] text-[#474C52] text-[14px] font-[500] leading-[160%] tracking-[-2%]">
              아래 아이템을 추천해요
            </h2>
            <div className="mt-[17px] flex flex-col h-[calc(100%-170px)] overflow-y-auto">
              {recommendItems
                .filter((item) => selectItem?.category === item.category)
                .map((item, index) => (
                  <RetouchItem
                    key={item.id}
                    item={item}
                    isSelected={changeItem?.id === item.id}
                    animationClassName="retouch-recommend-drop"
                    animationDelay={`${180 + index * 80}ms`}
                    onClick={() => setChangeItem(item)}
                  />
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
          <div className="flex gap-[24px] flex-col flex-172 aspect-[172/439] overflow-x-hidden overflow-y-auto">
            {result?.items.map((item, index) => (
              <RetouchItem
                key={item.id}
                item={item}
                isSelected={selectItem?.id === item.id}
                animationClassName="retouch-item-enter"
                animationDelay={`${120 + index * 90}ms`}
                onClick={() => {
                  setSelectItem(item);
                  setChangeItem(null);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-[48px] mx-[24px]">
        {selectCategory && selectItem ? (
          <div>
            <button
              onClick={() => navigate('/commerce')}
              className="w-full bg-[#E6E8EA] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
            >
              다른 아이템 보러가기
            </button>
            <button
              onClick={handleChangeItem}
              className="mt-[8px] w-full bg-[#1F2124] disabled:bg-[#E6E8EA] rounded-[32px] py-[16px] text-[#F6F7F8] disabled:text-[#959BA7] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
            >
              완료
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSelectCategory(selectItem?.category)}
            disabled={!selectItem}
            className="w-full bg-[#1F2124] disabled:bg-[#E6E8EA] rounded-[32px] py-[16px] text-[#F6F7F8] disabled:text-[#959BA7] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
          >
            확인
          </button>
        )}
      </div>
    </PageLayout>
  );
};

export default CodyRetouchPage;
