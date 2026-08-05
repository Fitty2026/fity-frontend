import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import registerBgBlob from '@/assets/images/closet-register-bg-blob.png';

const AlbumIcon = () => (
  <svg width="32" height="32" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 16L7.87867 9.12133C8.15724 8.84275 8.48796 8.62177 8.85194 8.47101C9.21592 8.32024 9.60603 8.24264 10 8.24264C10.394 8.24264 10.7841 8.32024 11.1481 8.47101C11.512 8.62177 11.8428 8.84275 12.1213 9.12133L19 16M17 14L18.8787 12.1213C19.1572 11.8428 19.488 11.6218 19.8519 11.471C20.2159 11.3202 20.606 11.2426 21 11.2426C21.394 11.2426 21.7841 11.3202 22.1481 11.471C22.512 11.6218 22.8428 11.8428 23.1213 12.1213L27 16M3 21H25C25.5304 21 26.0391 20.7893 26.4142 20.4142C26.7893 20.0391 27 19.5304 27 19V3C27 2.46957 26.7893 1.96086 26.4142 1.58579C26.0391 1.21071 25.5304 1 25 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21ZM17 6H17.0107V6.01067H17V6ZM17.5 6C17.5 6.13261 17.4473 6.25979 17.3536 6.35355C17.2598 6.44732 17.1326 6.5 17 6.5C16.8674 6.5 16.7402 6.44732 16.6464 6.35355C16.5527 6.25979 16.5 6.13261 16.5 6C16.5 5.86739 16.5527 5.74022 16.6464 5.64645C16.7402 5.55268 16.8674 5.5 17 5.5C17.1326 5.5 17.2598 5.55268 17.3536 5.64645C17.4473 5.74022 17.5 5.86739 17.5 6Z" stroke="#1F2124" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.10267 8.23361C8.86265 8.61349 8.54243 8.93625 8.16445 9.17925C7.78647 9.42225 7.3599 9.57961 6.91467 9.64027C6.408 9.71227 5.90533 9.78961 5.40267 9.87361C3.99867 10.1069 3 11.3429 3 12.7656V24.0003C3 24.7959 3.31607 25.559 3.87868 26.1216C4.44129 26.6842 5.20435 27.0003 6 27.0003H26C26.7957 27.0003 27.5587 26.6842 28.1213 26.1216C28.6839 25.559 29 24.7959 29 24.0003V12.7656C29 11.3429 28 10.1069 26.5973 9.87361C26.0943 9.78979 25.5902 9.71201 25.0853 9.64027C24.6403 9.57942 24.214 9.42198 23.8363 9.17899C23.4586 8.936 23.1385 8.61333 22.8987 8.23361L21.8027 6.47894C21.5565 6.07907 21.2176 5.7444 20.8147 5.50325C20.4118 5.26211 19.9567 5.1216 19.488 5.09361C17.1643 4.9688 14.8357 4.9688 12.512 5.09361C12.0433 5.1216 11.5882 5.26211 11.1853 5.50325C10.7824 5.7444 10.4435 6.07907 10.1973 6.47894L9.10267 8.23361Z" stroke="#34363C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 17C22 18.5913 21.3679 20.1174 20.2426 21.2426C19.1174 22.3679 17.5913 23 16 23C14.4087 23 12.8826 22.3679 11.7574 21.2426C10.6321 20.1174 10 18.5913 10 17C10 15.4087 10.6321 13.8826 11.7574 12.7574C12.8826 11.6321 14.4087 11 16 11C17.5913 11 19.1174 11.6321 20.2426 12.7574C21.3679 13.8826 22 15.4087 22 17ZM25 14H25.0107V14.0107H25V14Z" stroke="#34363C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BagIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 14V8C21 6.67392 20.4732 5.40215 19.5355 4.46447C18.5978 3.52678 17.3261 3 16 3C14.6739 3 13.4021 3.52678 12.4644 4.46447C11.5268 5.40215 11 6.67392 11 8V14M26.1413 11.3427L27.8253 27.3427C27.9186 28.2293 27.2253 29 26.3333 29H5.66665C5.45626 29.0002 5.24817 28.9562 5.05591 28.8708C4.86365 28.7853 4.69151 28.6604 4.55068 28.5041C4.40984 28.3478 4.30347 28.1636 4.23845 27.9635C4.17344 27.7634 4.15125 27.5519 4.17331 27.3427L5.85865 11.3427C5.89752 10.9741 6.07148 10.6329 6.34698 10.385C6.62248 10.1371 6.98002 9.99993 7.35065 10H24.6493C25.4173 10 26.0613 10.58 26.1413 11.3427ZM11.5 14C11.5 14.1326 11.4473 14.2598 11.3535 14.3536C11.2598 14.4473 11.1326 14.5 11 14.5C10.8674 14.5 10.7402 14.4473 10.6464 14.3536C10.5527 14.2598 10.5 14.1326 10.5 14C10.5 13.8674 10.5527 13.7402 10.6464 13.6464C10.7402 13.5527 10.8674 13.5 11 13.5C11.1326 13.5 11.2598 13.5527 11.3535 13.6464C11.4473 13.7402 11.5 13.8674 11.5 14ZM21.5 14C21.5 14.1326 21.4473 14.2598 21.3535 14.3536C21.2598 14.4473 21.1326 14.5 21 14.5C20.8674 14.5 20.7402 14.4473 20.6464 14.3536C20.5527 14.2598 20.5 14.1326 20.5 14C20.5 13.8674 20.5527 13.7402 20.6464 13.6464C20.7402 13.5527 20.8674 13.5 21 13.5C21.1326 13.5 21.2598 13.5527 21.3535 13.6464C21.4473 13.7402 21.5 13.8674 21.5 14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11H29M3 12H29M7 19H15M7 22H11M6 26H26C26.7957 26 27.5587 25.6839 28.1213 25.1213C28.6839 24.5587 29 23.7956 29 23V9C29 8.20435 28.6839 7.44129 28.1213 6.87868C27.5587 6.31607 26.7957 6 26 6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V23C3 23.7956 3.31607 24.5587 3.87868 25.1213C4.44129 25.6839 5.20435 26 6 26Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OPTIONS = [
  { key: 'album', label: '앨범에서 선택', icon: <AlbumIcon />, to: '/closet/register/receipt-upload' },
  { key: 'camera', label: '카메라로 촬영', icon: <CameraIcon />, to: '/closet/register/photo' },
  { key: 'platform', label: '쇼핑몰 연동하기', icon: <BagIcon />, to: '/closet/register/platform' },
  { key: 'receipt', label: '영수증 불러오기', icon: <ReceiptIcon />, to: '/closet/register/receipt' },
];

/**
 * 옷장 등록 방식 선택 (자동/직접).
 * 타이틀 + 4가지 등록 방식(앨범/카메라/쇼핑몰/영수증) 그룹 카드.
 */
const ClosetRegisterPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
        {/* 배경 blob — Figma: 1078.79², top 0, left -451, angle 10.07°(=CSS -10.07°) */}
        <img
          src={registerBgBlob}
          alt=""
          className="pointer-events-none select-none absolute max-w-none"
          style={{
            width: '1078.79px',
            height: '1078.79px',
            top: '50px',
            left: '-351px',
            transform: 'rotate(-10.07deg)',
            opacity: 1,
          }}
          draggable={false}
        />

        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div className="relative flex-1 overflow-y-auto px-6 pt-[68px]">
          {/* 타이틀 (Figma: Pretendard 700 / 24px / lh150% / -2%) */}
          <h1 className="text-[24px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            옷을 등록해
            <br />
            코디를 완성해보세요
          </h1>
          {/* 부제 (Figma: Pretendard 500 / 14px / lh160% / -2% / #5A6169) */}
          <p className="mt-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
            보유한 옷을 추가하면
            <br />
            더 정확한 코디를 추천해드려요
          </p>

          {/* 옵션 그룹 카드 (Figma: bg #FFF 20%, radius16, shadow 0/8/16 #000 8%, backdrop blur) */}
          <div className="mt-[111px] overflow-hidden rounded-2xl bg-white/20 shadow-[0_8px_16px_0_rgba(0,0,0,0.08)] backdrop-blur-md">
            {OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => navigate(opt.to)}
                className="flex items-center gap-[40px] w-full h-20 pl-6 pr-[14px] text-left cursor-pointer border-b border-[#E6E8EA] last:border-b-0"
              >
                <span className="shrink-0">{opt.icon}</span>
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetRegisterPage;
