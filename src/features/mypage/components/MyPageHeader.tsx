import { useNavigate } from 'react-router-dom';

import backIcon from '@/assets/images/mypage/back.svg';

interface MyPageHeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

const MyPageHeader = ({ title, showBack = false, right }: MyPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="relative flex h-[54px] shrink-0 items-center justify-center border-b border-[#E6E8EA] px-6">
      {showBack ? (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="absolute left-6 h-6 w-6"
        >
          <img src={backIcon} alt="" className="h-full w-full" />
        </button>
      ) : null}
      <h1 className="text-[20px] font-semibold leading-[150%] tracking-[-0.4px] text-[#1F2124]">
        {title}
      </h1>
      {right ? <div className="absolute right-6">{right}</div> : null}
    </header>
  );
};

export default MyPageHeader;
