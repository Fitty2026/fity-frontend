import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReceiptGuideScreen } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 사진 — 24×24, stroke white (사진 업로드 버튼 좌측). 실 에셋 미수급 */
const PhotoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="4.5" width="18" height="15" rx="3" stroke="white" strokeWidth="1.5" />
    <path
      d="M3.75 16.5L8.25 12L12 15.75M13.5 14.25L15.75 12L20.25 16.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="15.75" cy="9" r="1.25" stroke="white" strokeWidth="1.5" />
  </svg>
);

/** 최대 장수 안내 아이콘 — 16×16, stroke #B2B8BD */
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M7.5 7.5L7.52733 7.48667C7.61282 7.44396 7.70875 7.42664 7.80378 7.43677C7.8988 7.4469 7.98893 7.48404 8.0635 7.54381C8.13806 7.60357 8.19394 7.68345 8.22451 7.77399C8.25508 7.86453 8.25907 7.96193 8.236 8.05467L7.764 9.94533C7.74076 10.0381 7.74463 10.1356 7.77513 10.2263C7.80563 10.3169 7.86149 10.3969 7.93609 10.4568C8.01069 10.5166 8.10089 10.5538 8.196 10.564C8.2911 10.5741 8.38712 10.5568 8.47267 10.514L8.5 10.5M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.0241 13.2417 10.2961 13.5433C9.56815 13.8448 8.78793 14 8 14C7.21207 14 6.43185 13.8448 5.7039 13.5433C4.97595 13.2417 4.31451 12.7998 3.75736 12.2426C3.20021 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.5913 2 11.1174 2.63214 12.2426 3.75736C13.3679 4.88258 14 6.4087 14 8ZM8 5.5H8.00533V5.50533H8V5.5Z"
      stroke="#B2B8BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 업로드 가능한 영수증 이미지 최대 장수 (OCR API 스펙) */
const MAX_FILES = 5;

/**
 * OCR 업로드 가이드 — 어떤 사진을 올려야 하는지 안내하고 앨범을 연다.
 * 화면 구조는 촬영 가이드와 공유한다 (ReceiptGuideScreen).
 * ※ 고른 파일을 어떻게 다루는지(미리보기·인식 요청)는 시안 미수급.
 */
const ClosetUploadGuidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const images = useClosetStore((state) => state.receiptImages);
  const setReceiptImages = useClosetStore((state) => state.setReceiptImages);
  const fileRef = useRef<HTMLInputElement>(null);

  // 인식 실패분 '다시 업로드' — 그 한 장만 교체하므로 다중 선택을 막는다
  const replaceIndex = (location.state as { replaceIndex?: number } | null)?.replaceIndex;
  const single = typeof replaceIndex === 'number';

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, single ? 1 : MAX_FILES);
    if (files.length === 0) return;
    // 미리보기용 URL만 넘긴다. 실제 업로드는 OCR API 연동 시
    const urls = files.map((file) => URL.createObjectURL(file));

    if (single) {
      const next = [...images];
      next[replaceIndex] = urls[0];
      setReceiptImages(next);
      // 어느 장을 다시 올린 것인지 인식 화면까지 넘긴다 — 그 장만 갱신해야 나머지가 살아남는다
      navigate('/closet/register/receipt-recognizing', { state: { replaceIndex } });
      return;
    }

    setReceiptImages(urls);
    navigate('/closet/register/receipt-check');
  };

  return (
    <ReceiptGuideScreen
      titleSecondLine="다음과 같이 영수증 사진을 업로드해주세요"
      imageAlt="영수증 업로드 예시"
      lastNotice="밝은 곳에서 촬영한 영수증을 업로드해주세요"
      hint={
        // 최대 장수 안내 — 이미지 아래 8, Caption 12px Regular LH165% (블록 138×20)
        <div className="mt-2 flex items-center justify-center gap-2 px-6">
          <InfoIcon />
          <span className="text-[12px] font-normal leading-[1.65] tracking-[-0.02em] text-[#959BA7]">
            {single ? '한 장만 다시 업로드할 수 있어요' : `최대 ${MAX_FILES}장까지 업로드 가능해요`}
          </span>
        </div>
      }
      ctaIcon={<PhotoIcon />}
      ctaLabel="사진 업로드"
      onCta={() => fileRef.current?.click()}
      extra={
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={!single}
          className="hidden"
          onChange={handlePick}
        />
      }
    />
  );
};

export default ClosetUploadGuidePage;
