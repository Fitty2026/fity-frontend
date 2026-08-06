import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';

/** 카메라 — 32×32, stroke #34363C */
const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M9.10267 8.23361C8.86265 8.61349 8.54243 8.93625 8.16445 9.17925C7.78647 9.42225 7.3599 9.57961 6.91467 9.64027C6.408 9.71227 5.90533 9.78961 5.40267 9.87361C3.99867 10.1069 3 11.3429 3 12.7656V24.0003C3 24.7959 3.31607 25.559 3.87868 26.1216C4.44129 26.6842 5.20435 27.0003 6 27.0003H26C26.7957 27.0003 27.5587 26.6842 28.1213 26.1216C28.6839 25.559 29 24.7959 29 24.0003V12.7656C29 11.3429 28 10.1069 26.5973 9.87361C26.0943 9.78979 25.5902 9.71201 25.0853 9.64027C24.6403 9.57942 24.214 9.42198 23.8363 9.17899C23.4586 8.936 23.1385 8.61333 22.8987 8.23361L21.8027 6.47894C21.5565 6.07907 21.2176 5.7444 20.8147 5.50325C20.4118 5.26211 19.9567 5.1216 19.488 5.09361C17.1643 4.9688 14.8357 4.9688 12.512 5.09361C12.0433 5.1216 11.5882 5.26211 11.1853 5.50325C10.7824 5.7444 10.4435 6.07907 10.1973 6.47894L9.10267 8.23361Z"
      stroke="#34363C"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 17C22 18.5913 21.3679 20.1174 20.2426 21.2426C19.1174 22.3679 17.5913 23 16 23C14.4087 23 12.8826 22.3679 11.7574 21.2426C10.6321 20.1174 10 18.5913 10 17C10 15.4087 10.6321 13.8826 11.7574 12.7574C12.8826 11.6321 14.4087 11 16 11C17.5913 11 19.1174 11.6321 20.2426 12.7574C21.3679 13.8826 22 15.4087 22 17ZM25 14H25.0107V14.0107H25V14Z"
      stroke="#34363C"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 사진(앨범) — 32×32, stroke #1F2124 */
const PhotoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M3 21L9.87867 14.1213C10.1572 13.8428 10.488 13.6218 10.8519 13.471C11.2159 13.3202 11.606 13.2426 12 13.2426C12.394 13.2426 12.7841 13.3202 13.1481 13.471C13.512 13.6218 13.8428 13.8428 14.1213 14.1213L21 21M19 19L20.8787 17.1213C21.1572 16.8428 21.488 16.6218 21.8519 16.471C22.2159 16.3202 22.606 16.2426 23 16.2426C23.394 16.2426 23.7841 16.3202 24.1481 16.471C24.512 16.6218 24.8428 16.8428 25.1213 17.1213L29 21M5 26H27C27.5304 26 28.0391 25.7893 28.4142 25.4142C28.7893 25.0391 29 24.5304 29 24V8C29 7.46957 28.7893 6.96086 28.4142 6.58579C28.0391 6.21071 27.5304 6 27 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V24C3 24.5304 3.21071 25.0391 3.58579 25.4142C3.96086 25.7893 4.46957 26 5 26ZM19 11H19.0107V11.0107H19V11ZM19.5 11C19.5 11.1326 19.4473 11.2598 19.3536 11.3536C19.2598 11.4473 19.1326 11.5 19 11.5C18.8674 11.5 18.7402 11.4473 18.6464 11.3536C18.5527 11.2598 18.5 11.1326 18.5 11C18.5 10.8674 18.5527 10.7402 18.6464 10.6464C18.7402 10.5527 18.8674 10.5 19 10.5C19.1326 10.5 19.2598 10.5527 19.3536 10.6464C19.4473 10.7402 19.5 10.8674 19.5 11Z"
      stroke="#1F2124"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 촬영 CTA용 카메라 — 24×24, stroke #FFFFFF */
const CameraIconSmall = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M6.827 6.17521C6.64699 6.46012 6.40682 6.70219 6.12334 6.88444C5.83985 7.06669 5.51993 7.18471 5.186 7.23021C4.806 7.28421 4.429 7.34221 4.052 7.40521C2.999 7.58021 2.25 8.50721 2.25 9.57421V18.0002C2.25 18.5969 2.48705 19.1692 2.90901 19.5912C3.33097 20.0132 3.90326 20.2502 4.5 20.2502H19.5C20.0967 20.2502 20.669 20.0132 21.091 19.5912C21.5129 19.1692 21.75 18.5969 21.75 18.0002V9.57421C21.75 8.50721 21 7.58021 19.948 7.40521C19.5707 7.34234 19.1927 7.28401 18.814 7.23021C18.4802 7.18457 18.1605 7.06649 17.8772 6.88424C17.5939 6.702 17.3539 6.46 17.174 6.17521L16.352 4.85921C16.1674 4.5593 15.9132 4.3083 15.611 4.12744C15.3089 3.94658 14.9675 3.8412 14.616 3.82021C12.8733 3.7266 11.1267 3.7266 9.384 3.82021C9.03245 3.8412 8.69114 3.94658 8.38896 4.12744C8.08678 4.3083 7.83262 4.5593 7.648 4.85921L6.827 6.17521Z"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 12.75C16.5 13.9435 16.0259 15.0881 15.182 15.932C14.3381 16.7759 13.1935 17.25 12 17.25C10.8065 17.25 9.66193 16.7759 8.81802 15.932C7.97411 15.0881 7.5 13.9435 7.5 12.75C7.5 11.5565 7.97411 10.4119 8.81802 9.56802C9.66193 8.72411 10.8065 8.25 12 8.25C13.1935 8.25 14.3381 8.72411 15.182 9.56802C16.0259 10.4119 16.5 11.5565 16.5 12.75ZM18.75 10.5H18.758V10.508H18.75V10.5Z"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 영수증을 가져오는 방식 */
const METHODS = [
  {
    key: 'camera',
    icon: <CameraIcon />,
    label: '카메라로 캡처',
    to: '/closet/register/capture-guide',
  },
  {
    key: 'album',
    icon: <PhotoIcon />,
    label: '사진 첨부',
    to: '/closet/register/upload-guide',
  },
];

/**
 * 영수증 불러올 방식 선택 — 카메라 촬영 / 앨범 첨부.
 * ※ 방식 선택 UI는 시안 미수급 — 플로우 확인용으로 카드 2장을 임시로 둔다.
 */
const ClosetReceiptMethodPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div className="flex-1 overflow-y-auto">
          {/* Title/T3 */}
          {/* 타이틀 — 375×30 (Title/T3), 진행 바 아래 52 */}
          <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            영수증을 불러올 방식을 선택해주세요
          </h1>

          <div className="mt-10 flex flex-col gap-2 px-6">
            {METHODS.map((method) => (
              <button
                key={method.key}
                type="button"
                onClick={() => navigate(method.to)}
                className="flex h-20 w-full cursor-pointer items-center gap-7 rounded-2xl bg-white/20 p-6 text-left shadow-[0_8px_16px_0_rgba(0,0,0,0.08)] backdrop-blur-md"
              >
                <span className="ml-3 shrink-0">{method.icon}</span>
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  {method.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 CTA — 327×58, 아이콘↔라벨 8 (Figma top 716) */}
        <div className="w-full px-6 pt-3 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          {/* 눌렀을 때 동작은 시안 미수급 — 아직 연결하지 않는다 */}
          <button
            type="button"
            className="flex h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-[32px] bg-[#1F2124] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            <CameraIconSmall />
            촬영하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptMethodPage;
