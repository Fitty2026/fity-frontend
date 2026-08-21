import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import { registerStartPath } from '@/features/closet/registerFlow';
import useOnboardingStore from '@/store/onboardingStore';
import registerBgBlob from '@/assets/images/closet-register-bg-blob.png';
import useClosetStore from '@/store/closetStore';

/** 카메라 — 32×32 */
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

/** 사진(앨범) — 32×32 */
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

/** 영수증 — 32×32 */
const ReceiptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M3 11H29M3 12H29M7 19H15M7 22H11M6 26H26C26.7957 26 27.5587 25.6839 28.1213 25.1213C28.6839 24.5587 29 23.7956 29 23V9C29 8.20435 28.6839 7.44129 28.1213 6.87868C27.5587 6.31607 26.7957 6 26 6H6C5.20435 6 4.44129 6.31607 3.87868 6.87868C3.31607 7.44129 3 8.20435 3 9V23C3 23.7956 3.31607 24.5587 3.87868 25.1213C4.44129 25.6839 5.20435 26 6 26Z"
      stroke="black"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 직접 입력 — 32×32 */
const PencilIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M22.4827 5.983L24.732 3.73233C25.2009 3.26343 25.8369 3 26.5 3C27.1631 3 27.7991 3.26343 28.268 3.73233C28.7369 4.20123 29.0003 4.8372 29.0003 5.50033C29.0003 6.16346 28.7369 6.79943 28.268 7.26833L14.1093 21.427C13.4044 22.1315 12.5352 22.6493 11.58 22.9337L8 24.0003L9.06667 20.4203C9.35104 19.4652 9.86885 18.5959 10.5733 17.891L22.4827 5.983ZM22.4827 5.983L26 9.50033M24 18.667V25.0003C24 25.796 23.6839 26.559 23.1213 27.1216C22.5587 27.6843 21.7956 28.0003 21 28.0003H7C6.20435 28.0003 5.44129 27.6843 4.87868 27.1216C4.31607 26.559 4 25.796 4 25.0003V11.0003C4 10.2047 4.31607 9.44162 4.87868 8.87901C5.44129 8.3164 6.20435 8.00033 7 8.00033H13.3333"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 등록 방식 4종 — 시안 순서대로 카메라 / 앨범 / 영수증 / 구매내역.
 * 영수증·구매내역은 권한 안내를 먼저 거치고, 그 다음이 갈린다.
 * 영수증  → 촬영·앨범 방식 선택(receipt-method)
 * 구매내역 → 쇼핑몰 선택(platform) → 앨범 업로드(upload-guide)
 * 카메라  → 촬영(photo) → 태그 확인(tags)
 * 앨범    → 파일 선택 후 바로 태그 확인(tags)
 */
const OPTIONS = [
  {
    key: 'camera',
    entry: undefined,
    label: '카메라로 촬영',
    icon: <CameraIcon />,
  },
  {
    key: 'album',
    entry: undefined,
    label: '앨범에서 선택',
    icon: <PhotoIcon />,
  },
  {
    key: 'receipt',
    entry: 'receipt' as const,
    label: '영수증 불러오기',
    icon: <ReceiptIcon />,
  },
  {
    key: 'purchase',
    entry: 'purchase' as const,
    label: '구매내역 불러오기',
    icon: <PencilIcon />,
  },
];

/**
 * 옷장 등록 방식 선택 — 안내 문구 + 등록 방식 카드 4개.
 */
const ClosetRegisterPage = () => {
  const navigate = useNavigate();
  const startOcrFlow = useClosetStore((state) => state.startOcrFlow);
  // 권한 안내는 최초 1회만 거친다
  const permissionSeen = useOnboardingStore((state) => state.closetPermissionSeen);

  // 앨범에서 고른 옷 사진 — 브라우저 파일 선택으로 사진 접근 권한을 받는다
  const fileInput = useRef<HTMLInputElement>(null);

  // 등록 플로우의 시작점 — 지난 회차 영수증이 남아 장수가 계속 불어나지 않게 여기서 비운다
  useEffect(() => {
    startOcrFlow();
  }, [startOcrFlow]);

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photos = Array.from(e.target.files ?? []).map((file) => URL.createObjectURL(file));
    if (photos.length) navigate('/closet/register/tags', { state: { photos } });
  };

  // 영수증·구매내역은 권한 안내를 거쳐 갈래가 갈리고, 카메라·앨범은 곧바로 사진을 받는다
  const handleSelect = (option: (typeof OPTIONS)[number]) => {
    if (option.entry) {
      navigate(registerStartPath(option.entry, permissionSeen), { state: { entry: option.entry } });
      return;
    }
    if (option.key === 'camera') navigate('/closet/register/photo');
    else fileInput.current?.click();
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white overflow-hidden">
        {/* 배경 blob — Figma: 1078.79², top 0, left -451, angle 10.07°(=CSS -10.07°).
            좌표는 Figma 그대로가 아니라 화면에서 맞춰 본 값이다(스펙대로 넣으면 어긋난다) */}
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
          }}
          draggable={false}
        />

        <OnboardingTopBar progress={300 / 375} showSkip />

        <div className="relative flex flex-1 flex-col overflow-y-auto px-6 pt-[68px]">
          {/* 문구 블록 327×120 — 진행 바 아래 68 (Figma top 175) */}
          <h1 className="text-[24px] font-bold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            옷을 등록해
            <br />
            코디를 완성해보세요
          </h1>
          {/* Body/B7 — 14px Medium, Primary/600 */}
          <p className="mt-1 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
            보유한 옷을 추가하면
            <br />
            더 정확한 코디를 추천해드려요
          </p>

          {/* 등록 방식 카드 — 327×80, 카드 간 12. 4장이라 문구에서 띄우는 대신 바닥에 붙인다
              (시안: 마지막 카드 아래 40 + 홈 인디케이터) */}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handlePickFiles}
          />
          <div className="mt-auto flex flex-col gap-3 pt-10 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
            {OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleSelect(option)}
                // padding 24, radius 16, bg 흰색 20%, shadow 0 8 16 #00000014
                className="flex h-20 w-full cursor-pointer items-center gap-7 rounded-2xl bg-white/20 p-6 text-left shadow-[0_8px_16px_0_#00000014] backdrop-blur-md"
              >
                {/* 아이콘만 12 오른쪽으로 (라벨 위치는 그대로 유지하려고 gap을 28로) */}
                <span className="ml-3 shrink-0">{option.icon}</span>
                {/* Body/B1 — 16px Bold */}
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetRegisterPage;
