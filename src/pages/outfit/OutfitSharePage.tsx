import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageeLayout';

import { mockOutfits } from '../../mocks/data/outfit';
import type { Outfit } from '../../types';

const OutfitSharePage = () => {
  const [result, setResult] = useState<Outfit>();

  useEffect(() => {
    setResult(mockOutfits?.[0]);
  }, []);

  const navigate = useNavigate();

  const downloadImg = () => {
    const imgUrl = 'image.jpg'; // 다운로드할 이미지 경로
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `fitty${new Date()}.jpg`; // 저장될 파일 이름
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareSns = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '공유할 제목',
          text: '공유할 내용',
          url: 'https://example.com',
        })
        .then(() => console.log('성공적으로 공유되었습니다.'))
        .catch((error) => console.log('공유 실패:', error));
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="mt-[32px] mx-[24px]">
        <img
          className="rounded-[24px] aspect-[327/376] object-cover"
          src={result?.imageUrl}
          alt={result?.createdAt}
        ></img>
      </div>
      <div className="mt-[16px] mx-[24px] flex justify-between">
        <div>
          {' '}
          <h2 className="text-[#1F2124] text-[24px] font-[600] leading-[150%] tracking-[-2%]">
            {result?.context}
          </h2>
          <div className="flex">
            {result?.styleTags.map((tag) => (
              <p
                key={tag}
                className="text-[#6F7881] text-[14px] font-[500] leading-[160%] tracking-[-2%]"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
        <div className="flex gap-[24px] mt-[18px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={downloadImg}
          >
            <path
              d="M3 16.5V18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H18.75C19.3467 21 19.919 20.7629 20.341 20.341C20.7629 19.919 21 19.3467 21 18.75V16.5M7.5 12L12 16.5L16.5 12M12 16.5V3"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            onClick={shareSns}
          >
            <path
              d="M4.96669 11.5552C5.14669 11.2322 5.24969 10.8592 5.24969 10.4622C5.24969 10.0652 5.14669 9.6932 4.96669 9.3692C4.72455 8.93351 4.34459 8.59056 3.88646 8.39418C3.42832 8.1978 2.91794 8.15911 2.43544 8.28418C1.95293 8.40925 1.52562 8.691 1.22057 9.0852C0.915516 9.4794 0.75 9.96375 0.75 10.4622C0.75 10.9606 0.915516 11.445 1.22057 11.8392C1.52562 12.2334 1.95293 12.5151 2.43544 12.6402C2.91794 12.7653 3.42832 12.7266 3.88646 12.5302C4.34459 12.3338 4.72455 11.9909 4.96669 11.5552ZM4.96669 9.3692L14.5327 4.0552M4.96669 11.5552L14.5327 16.8692M14.5327 4.0552C14.6729 4.31934 14.8644 4.55286 15.096 4.74213C15.3276 4.93139 15.5945 5.07259 15.8813 5.15747C16.1681 5.24236 16.4689 5.26922 16.7661 5.23649C17.0634 5.20376 17.3512 5.1121 17.6126 4.96686C17.874 4.82162 18.1039 4.62572 18.2887 4.39061C18.4736 4.1555 18.6097 3.88591 18.6891 3.59758C18.7685 3.30925 18.7897 3.00799 18.7513 2.71139C18.713 2.4148 18.6159 2.12883 18.4657 1.8702C18.1698 1.36054 17.6857 0.987334 17.1175 0.83081C16.5493 0.674287 15.9424 0.746939 15.4272 1.03315C14.912 1.31936 14.5297 1.79628 14.3624 2.36139C14.1952 2.9265 14.2563 3.53468 14.5327 4.0552ZM14.5327 16.8692C14.3892 17.1276 14.2979 17.4117 14.2642 17.7053C14.2304 17.999 14.2549 18.2964 14.3361 18.5806C14.4173 18.8648 14.5537 19.1302 14.7375 19.3617C14.9212 19.5931 15.1488 19.7862 15.4072 19.9297C15.6656 20.0732 15.9497 20.1645 16.2433 20.1982C16.537 20.2319 16.8344 20.2075 17.1185 20.1263C17.4027 20.0451 17.6682 19.9087 17.8996 19.7249C18.1311 19.5411 18.3242 19.3136 18.4677 19.0552C18.7576 18.5334 18.8283 17.9178 18.6643 17.3438C18.5003 16.7699 18.115 16.2846 17.5932 15.9947C17.0714 15.7048 16.4558 15.6341 15.8818 15.7981C15.3079 15.9621 14.8226 16.3474 14.5327 16.8692Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-[12px] mx-[24px]">
        <textarea
          name=""
          id=""
          placeholder="설명을 작성해 주세요"
          className="w-full bg-[#F6F7F8] rounded-[4px] px-[8px] py-[10px] text-[#B2B8BD] text-[12px] font-[500] leading-[165%] tracking-[-2%] outline-none resize-none overflow-hidden "
        ></textarea>
      </div>
      <div className="mt-[40px] mx-[24px] flex flex-col gap-[6px] ">
        <button
          onClick={() => {
            navigate('/home');
          }}
          className="bg-[#F6F7F8] rounded-[32px] py-[16px] text-[#1F2124] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          홈으로 가기
        </button>
        <button
          onClick={() => {
            navigate('/styling');
          }}
          className="bg-[#1F2124] rounded-[32px] py-[16px] text-[#F6F7F8] text-[16px] font-[600] leading-[160%] tracking-[-2%]"
        >
          추가로 코디 생성하기
        </button>
      </div>
    </PageLayout>
  );
};

export default OutfitSharePage;
