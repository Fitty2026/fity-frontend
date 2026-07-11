import PageLayout from '@/components/layout/PageeLayout';
import { Link } from 'react-router-dom';

const OutfitSharePage = () => {
  const downloadImg = () => {
    const imgUrl = 'image.jpg'; // 다운로드할 이미지 경로
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `${'코디 이름'}.jpg`; // 저장될 파일 이름
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const url = 'https://example.com';
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 클립보드에 복사되었습니다.');
    });
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
    <PageLayout
      className="pb-[250px]"
      showBottomNav={false}
      showHeader={true}
      showBack={true}
      title="코디 저장"
    >
      <div className="ResultImg  mx-[20px] mt-[20px]  rounded-[12px] aspect-[3/4] flex flex-col  ">
        <img
          src="https://static.lookpin.co.kr/20250223125033-a52c/bb8a724e255a4399b2975545a33d16fa.jpg"
          alt="코디완성 이미지"
          className="w-[100%] h-[100%] object-cover bg-[#F5F5F5] rounded-[12px] shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
        />
        <h2 className="text-[24px] text-[#000000] text-[500] mt-[15px]">미니멀 시티룩</h2>
        <div className="flex gap-[4px]">
          {['#데일리', '#데이트', '#오피스룩', '#출근길'].map((tag) => (
            <p key={tag} className="text-[14px] text-[#5E5E5E]  text-[500] mb-[15px]">
              {tag}
            </p>
          ))}
        </div>
      </div>

      <div className="mx-[20px] flex justify-between ">
        <div
          onClick={() => {
            downloadImg();
          }}
          className="flex flex-col  items-center justify-center cursor-pointer gap-[8px] bg-[#FFFFFF] border-[#E4E4E7] border rounded-[8px] py-[16px]  w-[106px] h-[106px]"
        >
          <div className="bg-[#f4f4f5] w-[48px] h-[48px] shrink-0 items-center  rounded-full flex justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z"
                fill="#1A1C1C"
              />
            </svg>
          </div>
          <p className="text-[12px] text-[#1A1C1C] text-center">이미지 저장</p>
        </div>
        <div
          onClick={() => {
            copyToClipboard();
          }}
          className="flex flex-col  items-center justify-center cursor-pointer gap-[8px] bg-[#FFFFFF] border-[#E4E4E7] border rounded-[8px] py-[16px]  w-[106px] h-[106px]"
        >
          <div className="bg-[#f4f4f5] w-[48px] h-[48px] shrink-0 items-center  rounded-full flex justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="10"
              viewBox="0 0 20 10"
              fill="none"
            >
              <path
                d="M9 10H5C3.61667 10 2.4375 9.5125 1.4625 8.5375C0.4875 7.5625 0 6.38333 0 5C0 3.61667 0.4875 2.4375 1.4625 1.4625C2.4375 0.4875 3.61667 0 5 0H9V2H5C4.16667 2 3.45833 2.29167 2.875 2.875C2.29167 3.45833 2 4.16667 2 5C2 5.83333 2.29167 6.54167 2.875 7.125C3.45833 7.70833 4.16667 8 5 8H9V10ZM6 6V4H14V6H6ZM11 10V8H15C15.8333 8 16.5417 7.70833 17.125 7.125C17.7083 6.54167 18 5.83333 18 5C18 4.16667 17.7083 3.45833 17.125 2.875C16.5417 2.29167 15.8333 2 15 2H11V0H15C16.3833 0 17.5625 0.4875 18.5375 1.4625C19.5125 2.4375 20 3.61667 20 5C20 6.38333 19.5125 7.5625 18.5375 8.5375C17.5625 9.5125 16.3833 10 15 10H11Z"
                fill="#1A1C1C"
              />
            </svg>
          </div>
          <p className="text-[12px] text-[#1A1C1C] text-center">링크 공유</p>
        </div>
        <div
          onClick={() => {
            shareSns();
          }}
          className="flex flex-col items-center justify-center cursor-pointer gap-[8px] bg-[#FFFFFF] border-[#E4E4E7] border rounded-[8px] py-[16px]  w-[106px] h-[106px]"
        >
          <div className="bg-[#f4f4f5] w-[48px] h-[48px] shrink-0 items-center  rounded-full flex justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
            >
              <path
                d="M15 20C14.1667 20 13.4583 19.7083 12.875 19.125C12.2917 18.5417 12 17.8333 12 17C12 16.9 12.025 16.6667 12.075 16.3L5.05 12.2C4.78333 12.45 4.475 12.6458 4.125 12.7875C3.775 12.9292 3.4 13 3 13C2.16667 13 1.45833 12.7083 0.875 12.125C0.291667 11.5417 0 10.8333 0 10C0 9.16667 0.291667 8.45833 0.875 7.875C1.45833 7.29167 2.16667 7 3 7C3.4 7 3.775 7.07083 4.125 7.2125C4.475 7.35417 4.78333 7.55 5.05 7.8L12.075 3.7C12.0417 3.58333 12.0208 3.47083 12.0125 3.3625C12.0042 3.25417 12 3.13333 12 3C12 2.16667 12.2917 1.45833 12.875 0.875C13.4583 0.291667 14.1667 0 15 0C15.8333 0 16.5417 0.291667 17.125 0.875C17.7083 1.45833 18 2.16667 18 3C18 3.83333 17.7083 4.54167 17.125 5.125C16.5417 5.70833 15.8333 6 15 6C14.6 6 14.225 5.92917 13.875 5.7875C13.525 5.64583 13.2167 5.45 12.95 5.2L5.925 9.3C5.95833 9.41667 5.97917 9.52917 5.9875 9.6375C5.99583 9.74583 6 9.86667 6 10C6 10.1333 5.99583 10.2542 5.9875 10.3625C5.97917 10.4708 5.95833 10.5833 5.925 10.7L12.95 14.8C13.2167 14.55 13.525 14.3542 13.875 14.2125C14.225 14.0708 14.6 14 15 14C15.8333 14 16.5417 14.2917 17.125 14.875C17.7083 15.4583 18 16.1667 18 17C18 17.8333 17.7083 18.5417 17.125 19.125C16.5417 19.7083 15.8333 20 15 20ZM15 18C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17C16 16.7167 15.9042 16.4792 15.7125 16.2875C15.5208 16.0958 15.2833 16 15 16C14.7167 16 14.4792 16.0958 14.2875 16.2875C14.0958 16.4792 14 16.7167 14 17C14 17.2833 14.0958 17.5208 14.2875 17.7125C14.4792 17.9042 14.7167 18 15 18ZM3 11C3.28333 11 3.52083 10.9042 3.7125 10.7125C3.90417 10.5208 4 10.2833 4 10C4 9.71667 3.90417 9.47917 3.7125 9.2875C3.52083 9.09583 3.28333 9 3 9C2.71667 9 2.47917 9.09583 2.2875 9.2875C2.09583 9.47917 2 9.71667 2 10C2 10.2833 2.09583 10.5208 2.2875 10.7125C2.47917 10.9042 2.71667 11 3 11ZM15 4C15.2833 4 15.5208 3.90417 15.7125 3.7125C15.9042 3.52083 16 3.28333 16 3C16 2.71667 15.9042 2.47917 15.7125 2.2875C15.5208 2.09583 15.2833 2 15 2C14.7167 2 14.4792 2.09583 14.2875 2.2875C14.0958 2.47917 14 2.71667 14 3C14 3.28333 14.0958 3.52083 14.2875 3.7125C14.4792 3.90417 14.7167 4 15 4Z"
                fill="#1A1C1C"
              />
            </svg>
          </div>
          <p className="text-[12px] text-[#1A1C1C] text-center">sns 공유</p>
        </div>
      </div>

      <div className="fixed backdrop-blur-[24px] max-w-[430px] pb-[20px] z-10 bg-[##FFFFFFE5] bottom-[0px] right-1/2 translate-x-1/2 w-full">
        <Link
          to={'/outfit/save'}
          className="mt-[20px] mx-[20px] border bg-[#000000] h-[48px] rounded-[8px]  text-[16px] text-[#FFFFFF] text-medium font-[500] text-center flex items-center justify-center cursor-pointer"
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

export default OutfitSharePage;
