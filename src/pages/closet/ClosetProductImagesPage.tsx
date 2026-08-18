import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import { colorChipStyle } from '@/features/closet/colors';
import useClosetStore, { receiptProducts } from '@/store/closetStore';
import useRegisterClosetItems from '@/features/closet/hooks/useRegisterClosetItems';
import type { OcrImportType } from '@/features/closet/api/ocrApi';
import { getErrorMessage } from '@/lib/apiError';

/** 이미지 추가 — 34×34 원형 플러스, 원 #9D98F0 / 선 #F6F7F8 */
const AddPhotoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="#9D98F0" />
    <path d="M12 8.25V15.75M8.25 12H15.75" stroke="#F6F7F8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** 등록 완료 — 16×16 체크, 원 #1F2124 / 선 #F6F7F8 */
const PhotoDoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="8" cy="8" r="7.4" fill="#1F2124" />
    <path
      d="M4.9 8.2L7 10.3L11.1 6.2"
      stroke="#F6F7F8"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 이미지 교체 — 11×10 연필, stroke #F6F7F8 (viewBox 32를 11로 렌더해 두께를 2.33으로 환산) */
const EditPhotoIcon = () => (
  <svg width="11" height="10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M22.4827 5.983L24.732 3.73233C25.2009 3.26343 25.8369 3 26.5 3C27.1631 3 27.7991 3.26343 28.268 3.73233C28.7369 4.20123 29.0003 4.8372 29.0003 5.50033C29.0003 6.16346 28.7369 6.79943 28.268 7.26833L14.1093 21.427C13.4044 22.1315 12.5352 22.6493 11.58 22.9337L8 24.0003L9.06667 20.4203C9.35104 19.4652 9.86885 18.5959 10.5733 17.891L22.4827 5.983ZM22.4827 5.983L26 9.50033M24 18.667V25.0003C24 25.796 23.6839 26.559 23.1213 27.1216C22.5587 27.6843 21.7956 28.0003 21 28.0003H7C6.20435 28.0003 5.44129 27.6843 4.87868 27.1216C4.31607 26.559 4 25.796 4 25.0003V11.0003C4 10.2047 4.31607 9.44162 4.87868 8.87901C5.44129 8.3164 6.20435 8.00033 7 8.00033H13.3333"
      stroke="#F6F7F8"
      strokeWidth="2.33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 카드 한 장이 가리키는 대상 — 어느 영수증의 몇 번째 상품인지 */
interface ProductEntry {
  receiptIndex: number;
  productIndex: number;
  name: string;
  tags: string[];
  colors: { label: string; hex: string }[];
  photo?: string;
}

/** 태그 칩 — 저장은 # 없이 하고 보여줄 때만 붙인다 */
const Chip = ({ label }: { label: string }) => (
  <span className="flex h-[19px] shrink-0 items-center rounded-[32px] border-[0.8px] border-[#E6E8EA] px-2 pt-px pb-0.5 text-[10px] font-medium leading-[1.65] tracking-[-0.02em] text-[#959BA7]">
    {label.startsWith('#') ? label : `#${label}`}
  </span>
);

/**
 * 인식 성공한 영수증 — 상품마다 옷 이미지를 등록한다.
 * 사진은 서버 필수 필드라 전부 채워야 다음으로 넘어갈 수 있다.
 */
const ClosetProductImagesPage = () => {
  const navigate = useNavigate();
  const results = useClosetStore((state) => state.ocrResults);
  // 어느 갈래로 왔는지가 서버에 남길 등록 경로가 된다
  const registerEntry = useClosetStore((state) => state.registerEntry);
  const { registerAsync, isLoading } = useRegisterClosetItems();
  const [saveError, setSaveError] = useState('');

  // 인식 성공분만 상품 단위로 펼친다. 카드 순서가 곧 수정 화면의 ?product=N 순번이다
  const entries: ProductEntry[] = results.flatMap((result, receiptIndex) =>
    result.failed
      ? []
      : receiptProducts(result).map((product, productIndex) => ({
          receiptIndex,
          productIndex,
          name: product.name,
          tags: product.tags ?? [],
          colors: product.colors ?? (product.color.label ? [product.color] : []),
          photo: product.photo,
        })),
  );

  const doneCount = entries.filter((entry) => entry.photo).length;
  const allDone = entries.length > 0 && doneCount === entries.length;

  /** 다음 — 상품마다 사진을 올리고 옷장에 등록한 뒤 완료 화면으로 */
  const handleNext = async () => {
    setSaveError('');
    const targets = results
      .filter((result) => !result.failed)
      .flatMap((result) =>
        receiptProducts(result).map((product) => ({
          product,
          // 서버가 그대로 저장하는 등록 경로 — 인식 요청에 실었던 값과 같게 맞춘다
          importType: (registerEntry === 'purchase' ? 'PURCHASE_LOG' : 'RECEIPT') as OcrImportType,
        })),
      );

    try {
      const { failed, reason } = await registerAsync(targets);
      // 일부만 실패해도 등록된 것은 살린다 — 처음부터 다시 하게 만들지 않는다
      if (failed.length) {
        setSaveError(reason ?? `${failed.length}건을 등록하지 못했어요. 다시 시도해주세요.`);
        return;
      }
      navigate('/closet/register/added');
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip />

        <div className="flex-1 overflow-y-auto">
          {/* 문구 블록 375×52 — 진행 바 아래 52 (Figma top 159) */}
          <div className="mt-[52px] flex flex-col items-center">
            {/* Title/T3 */}
            <p className="w-full text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
              인식된 상품마다 이미지를 등록해주세요
            </p>
            {/* Body/B7 */}
            <p className="w-full text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
              모든 상품의 이미지를 등록해야 다음 단계로 넘어갈 수 있어요
            </p>
          </div>

          {/* 진행 카운터 30×27 — 문구 아래 8 (Figma top 219) */}
          <p className="mt-2 text-center text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#34363C]">
            {doneCount}/{entries.length}
          </p>

          {/* 상품 카드 158×201 — 카운터 아래 32, 열 간 11 / 행 간 16 (Figma top 278) */}
          <div className="mt-8 grid grid-cols-2 gap-x-[11px] gap-y-4 px-6 pb-10">
            {entries.map((entry, order) => {
              const key = `${entry.receiptIndex}-${entry.productIndex}`;
              return (
                <div
                  key={key}
                  // padding 10/8, border 1 #E6E8EA, radius 8
                  className="flex h-[201px] items-center rounded-lg border border-[#E6E8EA] px-2 py-2.5"
                >
                  {/* 안쪽 열 140×179, gap 4 */}
                  <div className="flex h-full w-full flex-col gap-1">
                    {entry.photo ? (
                      // 등록됨 — 사진 140×102, 좌상단 완료 표시 / 우상단 교체 버튼
                      <div className="relative h-[102px] w-full overflow-hidden rounded-lg">
                        <img src={entry.photo} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2">
                          <PhotoDoneIcon />
                        </span>
                        <button
                          type="button"
                          aria-label={`${entry.name} 수정`}
                          onClick={() =>
                            navigate(`/closet/register/product-images/edit?product=${order + 1}`)
                          }
                          className="absolute right-2 top-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black/50"
                        >
                          <EditPhotoIcon />
                        </button>
                      </div>
                    ) : (
                      // 미등록 — 박스를 누르면 수정 화면에서 사진을 고른다 (별도 수정 아이콘 없음)
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/closet/register/product-images/edit?product=${order + 1}`)
                        }
                        // dash 5.29 = 1.76 × 3 이라 브라우저 기본 dashed 패턴과 같다
                        className="flex h-[102px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[14.11px] border-[1.76px] border-dashed border-[#9D98F0]"
                      >
                        <AddPhotoIcon />
                        {/* Caption/C6 */}
                        <span className="text-[10px] font-semibold leading-[1.65] tracking-[-0.02em] text-[#34363C]">
                          옷 이미지 추가
                        </span>
                      </button>
                    )}

                    {/* 상품 정보 140×73, gap 4 */}
                    <div className="flex flex-col gap-1">
                      {/* Body/B3 */}
                      <p className="truncate text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-black">
                        {entry.name}
                      </p>
                      {/* 칩·색상 140×43, gap 4 */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-0.5 overflow-hidden">
                          {entry.tags.map((tag) => (
                            <Chip key={tag} label={tag} />
                          ))}
                        </div>
                        {/* 색상 원 20×20, border 0.8 — 최대 2개, 간격 4 */}
                        <div className="flex h-5 items-center gap-1">
                          {entry.colors.map((color) => (
                            <span
                              key={color.label}
                              className="h-5 w-5 rounded-full border-[0.8px] border-[#E6E8EA]"
                              style={colorChipStyle(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 CTA — 327×58 (px 24), 하단 40 */}
        <div className="w-full px-6 pt-[10px] pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          {/* 등록 실패 안내 — 문구·위치 시안 미수급이라 임시 */}
          {saveError && (
            <p className="mb-2 text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#C74440]">
              {saveError}
            </p>
          )}
          <button
            type="button"
            disabled={!allDone || isLoading}
            onClick={handleNext}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? '등록 중...' : '다음'}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetProductImagesPage;
