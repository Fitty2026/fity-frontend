import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface cardProps {
  context: string | undefined;
  createdAt: string;
  imageUrl: string;
  isSaved: boolean;
}

const MyOutfitCard = ({ context, createdAt, imageUrl }: cardProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col ">
      <img
        src={imageUrl}
        alt={context}
        className=" relative rounded-[12px] border-[#F3F4F6] bg-[#E2E2E2] h-[248.5px] aspect-[3/2] object-cover"
        onClick={() => navigate(`/myoutfit/${context}`)}
      />{' '}
      <div className=" bg-[#FFFFFFCC] w-[32px] h-[32px] rounded-full flex items-center justify-center absolute top-[8px] right-[8px] shadow-[0px 1px 2px 0px #0000000D] backdrop-blur-[8px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.306 3.70726C11.0861 3.48304 10.825 3.30517 10.5376 3.18381C10.2502 3.06246 9.94222 3 9.63115 3C9.32007 3 9.01205 3.06246 8.72467 3.18381C8.43729 3.30517 8.17619 3.48304 7.95628 3.70726L7.49989 4.17238L7.04349 3.70726C6.59929 3.25456 5.99682 3.00023 5.36862 3.00023C4.74043 3.00023 4.13796 3.25456 3.69375 3.70726C3.24955 4.15996 3 4.77395 3 5.41416C3 6.05438 3.24955 6.66837 3.69375 7.12107L4.15014 7.58619L7.49989 11L10.8496 7.58619L11.306 7.12107C11.526 6.89695 11.7006 6.63086 11.8196 6.33798C11.9387 6.0451 12 5.73119 12 5.41416C12 5.09714 11.9387 4.78322 11.8196 4.49035C11.7006 4.19747 11.526 3.93137 11.306 3.70726Z"
            fill="black"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div className="flex overflow-hidden relative flex-col items-start w-full mt-[12px]">
        <div className=" flex items-center justify-between w-full ">
          <h3 className="pl-[4px] text-[18px] font-[500]">{context}</h3>
          <button
            className="cursor-pointer w-[32px] h-[32px] rounded-full flex items-center justify-center"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M8.49996 9.20866C8.89116 9.20866 9.20829 8.89153 9.20829 8.50033C9.20829 8.10912 8.89116 7.79199 8.49996 7.79199C8.10876 7.79199 7.79163 8.10912 7.79163 8.50033C7.79163 8.89153 8.10876 9.20866 8.49996 9.20866Z"
                stroke="#6A6A6A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.49996 4.24967C8.89116 4.24967 9.20829 3.93254 9.20829 3.54134C9.20829 3.15014 8.89116 2.83301 8.49996 2.83301C8.10876 2.83301 7.79163 3.15014 7.79163 3.54134C7.79163 3.93254 8.10876 4.24967 8.49996 4.24967Z"
                stroke="#6A6A6A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.49996 14.1667C8.89116 14.1667 9.20829 13.8495 9.20829 13.4583C9.20829 13.0671 8.89116 12.75 8.49996 12.75C8.10876 12.75 7.79163 13.0671 7.79163 13.4583C7.79163 13.8495 8.10876 14.1667 8.49996 14.1667Z"
                stroke="#6A6A6A"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="pl-[4px] text-[11px] font-[400] text-[#848484]">
          {createdAt.slice(0, 10).split('-').join('.')}
        </p>

        <div
          className={`absolute top-0 h-full w-full bg-[#FFFFFF] flex flex-row justify-between transition-all duration-300 ease-in-out ${
            openMenu ? 'top-0 opacity-100' : 'top-[-100%] opacity-0'
          }`}
        >
          <div className="flex-1 text-[12px] font-[500] text-[#6A6A6A] text-center content-center cursor-pointer border-r-[1px] border-[#E5E5E5]">
            기능1
          </div>
          <div className="flex-1 text-[12px] font-[500] text-[#6A6A6A] text-center content-center cursor-pointer border-r-[1px] border-[#E5E5E5]">
            기능2
          </div>
          <button
            className="flex-1 text-[12px] font-[500] text-[#6A6A6A] cursor-pointer "
            onClick={() => setOpenMenu(false)}
          >
            {'닫기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyOutfitCard;
