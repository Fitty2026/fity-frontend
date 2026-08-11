import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar, PhotoSourceSheet } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 직접 입력 — 20×20 연필, stroke 1.4 #1F2124 (viewBox 32 기준이라 두께를 2.24로 환산) */
const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M22.4827 5.983L24.732 3.73233C25.2009 3.26343 25.8369 3 26.5 3C27.1631 3 27.7991 3.26343 28.268 3.73233C28.7369 4.20123 29.0003 4.8372 29.0003 5.50033C29.0003 6.16346 28.7369 6.79943 28.268 7.26833L14.1093 21.427C13.4044 22.1315 12.5352 22.6493 11.58 22.9337L8 24.0003L9.06667 20.4203C9.35104 19.4652 9.86885 18.5959 10.5733 17.891L22.4827 5.983ZM22.4827 5.983L26 9.50033M24 18.667V25.0003C24 25.796 23.6839 26.559 23.1213 27.1216C22.5587 27.6843 21.7956 28.0003 21 28.0003H7C6.20435 28.0003 5.44129 27.6843 4.87868 27.1216C4.31607 26.559 4 25.796 4 25.0003V11.0003C4 10.2047 4.31607 9.44162 4.87868 8.87901C5.44129 8.3164 6.20435 8.00033 7 8.00033H13.3333"
      stroke="#1F2124"
      strokeWidth="2.24"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 다시 시도 — 20×20 새로고침, stroke 1.4 #F6F7F8 */
const RetryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M13.3526 7.79019H17.5126L14.8618 5.13769C14.0084 4.28425 12.9453 3.67052 11.7795 3.3582C10.6137 3.04588 9.38616 3.04597 8.22037 3.35846C7.05459 3.67096 5.99162 4.28485 5.13832 5.13842C4.28501 5.99198 3.67145 7.05515 3.35932 8.22103M6.64765 12.2102H2.48765V16.3702M2.48765 12.2102L5.13765 14.8627C5.99108 15.7161 7.05414 16.3299 8.21997 16.6422C9.3858 16.9545 10.6133 16.9544 11.7791 16.6419C12.9449 16.3294 14.0078 15.7155 14.8611 14.862C15.7145 14.0084 16.328 12.9452 16.6402 11.7794M17.5126 3.63019V7.78853"
      stroke="#F6F7F8"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 인식 실패 — 48×48 경고, stroke 3 #000 */
const WarnIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M24.0001 17.9999V25.4999M5.39413 32.2519C3.66213 35.2519 5.82813 38.9999 9.29013 38.9999H38.7101C42.1701 38.9999 44.3361 35.2519 42.6061 32.2519L27.8981 6.75586C26.1661 3.75586 21.8341 3.75586 20.1021 6.75586L5.39413 32.2519ZM24.0001 31.4999H24.0141V31.5159H24.0001V31.4999Z"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 카메라 — 32×32, stroke 2.2 #34363C (방식 선택 화면과 같은 도형) */
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

/** 사진(앨범) — 32×32, stroke 2 #1F2124 */
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

/**
 * 인식 실패한 영수증 목록 — 인식이 끝난 뒤 실패분만 모아 보여준다.
 * 장마다 직접 입력 / 다시 시도를 고를 수 있고, 하단 CTA로 통째로 건너뛴다.
 * 한 건도 못 읽었을 때는 목록 대신 '인식된 상품이 없어요' 안내와 다시 올릴 방법 시트를 보여준다.
 */
const ClosetReceiptFailedPage = () => {
  const navigate = useNavigate();
  const results = useClosetStore((state) => state.ocrResults);
  // 카메라로 찍어 온 사람에게 앨범을 열어주면 흐름이 끊긴다 — 왔던 길로 되돌린다
  const receiptMethod = useClosetStore((state) => state.receiptMethod);
  const setReceiptMethod = useClosetStore((state) => state.setReceiptMethod);
  // 구매내역은 촬영 갈래가 없어 항상 구매내역 업로드 안내로 돌아간다
  const registerEntry = useClosetStore((state) => state.registerEntry);
  const retryPath =
    registerEntry === 'purchase'
      ? '/closet/register/purchase-guide'
      : receiptMethod === 'camera'
        ? '/closet/register/capture-guide'
        : '/closet/register/upload-guide';
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);

  // 원본 인덱스를 함께 들고 다녀야 '영수증 N'과 다시 업로드 대상이 어긋나지 않는다
  const failed = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.failed);

  // 한 건도 못 읽었으면 보여줄 목록이 없다 — 다시 올리는 것 말고는 할 게 없는 화면
  const nothingRecognized = results.length > 0 && failed.length === results.length;

  if (nothingRecognized) {
    return (
      <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
        <div className="relative flex flex-col flex-1 min-h-0 bg-white">
          <OnboardingTopBar progress={300 / 375} showBack onBack={() => navigate(-1)} />

          {/* 안내 블록 375×128 — 진행 바 아래 80 (Figma top 187), 아이콘↔문구 24 */}
          <div className="mt-20 flex flex-col items-center gap-6">
            <WarnIcon />
            {/* 문구 375×56, 줄 간격 4 */}
            <div className="flex w-full flex-col items-center gap-1">
              {/* Title/T3 */}
              <p className="w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
                인식된 상품이 없어요
              </p>
              <button
                type="button"
                onClick={() => setUploadSheetOpen(true)}
                className="w-full cursor-pointer text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169] underline"
              >
                다시 업로드하기
              </button>
            </div>
          </div>

          {/* 이미지 업로드 시트 375×294 — radius 상단 56, padding 32/0/40, gap 40.
              구매내역은 촬영 갈래가 없어 앨범 한 줄만 둔다 */}
          <PhotoSourceSheet
            open={uploadSheetOpen}
            onClose={() => setUploadSheetOpen(false)}
            title="이미지 업로드"
            options={
              registerEntry === 'purchase'
                ? [
                    {
                      key: 'album',
                      icon: <PhotoIcon />,
                      label: '앨범에서 선택',
                      onSelect: () => navigate('/closet/register/purchase-guide'),
                    },
                  ]
                : [
                    {
                      key: 'camera',
                      icon: <CameraIcon />,
                      label: '카메라로 촬영',
                      onSelect: () => {
                        setReceiptMethod('camera');
                        navigate('/closet/register/capture-guide');
                      },
                    },
                    {
                      key: 'album',
                      icon: <PhotoIcon />,
                      label: '앨범에서 선택',
                      onSelect: () => {
                        setReceiptMethod('album');
                        navigate('/closet/register/upload-guide');
                      },
                    },
                  ]
            }
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div className="flex-1 overflow-y-auto">
          {/* 문구 블록 375×52 — 진행 바 아래 52 (Figma top 159) */}
          <div className="mt-[52px] flex flex-col items-center">
            {/* Title/T3 */}
            <p className="w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
              인식에 실패한 영수증이에요
            </p>
            {/* Body/B7 */}
            <p className="w-full text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
              다시 시도하거나 직접 입력으로 정보를 등록할 수 있어요
            </p>
          </div>

          {/* 실패 카드 327×165 — 문구 아래 24, 카드 간 12 (Figma top 235 / 412) */}
          <div className="mt-6 flex flex-col gap-3 px-6 pb-10">
            {failed.map(({ result, index }, order) => (
              <div
                key={index}
                // padding 20/16, gap 16, border 1 #E6E8EA, radius 8
                className="flex flex-col gap-4 rounded-lg border border-[#E6E8EA] px-4 py-5"
              >
                {/* 번호·상호·사유 묶음 — 293×71, gap 4 */}
                <div className="flex flex-col gap-1">
                  {/* 위로 4 당겨 블록 45에 맞춘다 (Figma margin -4).
                      뱃지와 날짜가 같이 움직여야 한 줄로 붙어 보인다 */}
                  <div className="-mt-1 flex items-start gap-2">
                    {/* 번호 뱃지 — 16×16 원, 11px SemiBold. 날짜 줄(20) 높이에 세로 중앙 */}
                    <span className="flex h-5 shrink-0 items-center">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1F2124] text-[11px] font-semibold leading-none tracking-[-0.02em] text-[#F6F7F8]">
                        {order + 1}
                      </span>
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      {/* Caption/C3 */}
                      <p className="text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#B2B8BD]">
                        {result.purchasedAt}
                      </p>
                      <p className="text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                        {result.storeLabel || result.store}
                      </p>
                    </div>
                  </div>
                  {/* 실패 사유 — 왼쪽 24로 상호와 줄을 맞춘다 (뱃지 16 + 간격 8) */}
                  <p className="pl-6 text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#6F7881]">
                    {result.failReason}
                  </p>
                </div>

                {/* 복구 수단 — 147×36 두 개, 사이 4 */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/closet/register/manual?receipt=${index + 1}`, {
                        state: { from: 'failed' },
                      })
                    }
                    className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[32px] border border-[#CED1D5] text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
                  >
                    <PencilIcon />
                    직접 입력
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(retryPath, { state: { replaceIndex: index } })}
                    className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[32px] border border-[#CED1D5] bg-[#1F2124] text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
                  >
                    <RetryIcon />
                    다시 시도
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 CTA — 327×58 (px 24), 하단 40 */}
        <div className="w-full px-6 pt-[10px] pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet/register/product-images')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            지금 안 하고 넘어가기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptFailedPage;
