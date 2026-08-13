import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useClosetStore, { emptyOcrResult } from '@/store/closetStore';
import useReceiptOcr from '@/features/closet/hooks/useReceiptOcr';
import { ocrErrorMessage } from '@/features/closet/api/ocrApi';

/** 인식 완료 — 24×24, 원 채움 #9D98F0 / 체크 흰색 */
const DoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442Z"
      fill="#9D98F0"
    />
    <path
      d="M9 12.75L11.25 15L15 9.75M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 대기 중 — 24×24 시계, stroke #B2B8BD */
const WaitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M12 6V12H16.5M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
      stroke="#B2B8BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 회전 스피너 — 트랙 #E6E8EA / 진행 #9D98F0 */
const Spinner = ({ size }: { size: number }) => (
  <>
    <style>{`@keyframes closetReceiptSpin { to { transform: rotate(360deg); } }`}</style>
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ animation: 'closetReceiptSpin 1s linear infinite' }}
    >
      <circle cx="30" cy="30" r="26" stroke="#E6E8EA" strokeWidth="4" />
      <path d="M30 4C44.3594 4 56 15.6406 56 30" stroke="#9D98F0" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </>
);

/**
 * 영수증 인식 중 — 업로드한 장수만큼 순서대로 인식 상태를 보여준다.
 * ※ 진행은 API 연동 전까지 고정 시간으로 흉내낸다. 카드 내부 간격은 시안 값 미수급.
 */
const ClosetReceiptRecognizingPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const images = useClosetStore((state) => state.receiptImages);
  const files = useClosetStore((state) => state.receiptFiles);
  const platform = useClosetStore((state) => state.selectedPlatforms[0] ?? '');
  // 실물 영수증인지 구매내역 캡처인지 — 서버가 파싱 방식을 가른다
  const registerEntry = useClosetStore((state) => state.registerEntry);
  const setOcrResults = useClosetStore((state) => state.setOcrResults);
  const updateOcrResult = useClosetStore((state) => state.updateOcrResult);
  const { recognizeAsync } = useReceiptOcr();
  // 실패분 한 장만 다시 올린 경우 — 그 장만 인식하고 나머지는 건드리지 않는다
  const replaceIndex = (location.state as { replaceIndex?: number } | null)?.replaceIndex;
  const single = typeof replaceIndex === 'number';
  // 체크 화면에서 뺀 장은 보내지 않는다. 지정이 없으면 전부
  const keep = (location.state as { keep?: number[] } | null)?.keep;
  const sending = single
    ? files.slice(replaceIndex, replaceIndex + 1)
    : keep
      ? keep.map((i) => files[i]).filter(Boolean)
      : files;
  // 업로드분이 없으면(직접 진입) 최소 1장으로 화면을 유지
  const total = single ? 1 : Math.max(sending.length || images.length, 1);
  // 지금까지 인식이 끝난 장수 — 장마다 요청이 따로 나가 실제 응답 수를 센다
  const [doneCount, setDoneCount] = useState(0);

  // 요청을 두 번 보내지 않게 한 번만 통과시킨다
  const settled = useRef(false);

  // 진입하자마자 인식 요청 — 응답이 오면 결과에 따라 화면을 나눈다
  useEffect(() => {
    if (settled.current) return;
    settled.current = true;

    // 보낼 파일이 없으면(주소 직접 진입 등) 더 진행할 수 없다
    if (sending.length === 0) {
      navigate('/closet/register/receipt-failed', { replace: true });
      return;
    }

    recognizeAsync({
      importType: registerEntry === 'purchase' ? 'PURCHASE_LOG' : 'RECEIPT',
      platform,
      files: sending,
      // 장마다 요청이 따로 끝나므로 진행 표시가 실제 진척도를 그린다
      onSettled: setDoneCount,
    })
      // 요청을 장별로 나눠 보내므로 결과는 보낸 파일과 길이·순서가 같고,
      // 실패한 장만 failed로 표시돼 온다 (한 장이 나머지를 끌고 내려가지 않는다)
      .then((recognized) => {
        if (single) {
          // 다시 올린 장 — 읽혔으면 그 자리를 채우고, 또 실패했으면 시도 횟수만 올린다
          const before = useClosetStore.getState().ocrResults[replaceIndex];
          const retried = recognized[0];
          updateOcrResult(
            replaceIndex,
            retried && !retried.failed
              ? retried
              : {
                  ...emptyOcrResult,
                  ...before,
                  failed: true,
                  failReason: retried?.failReason ?? before?.failReason,
                  retryCount: (before?.retryCount ?? 0) + 1,
                },
          );
          navigate('/closet/register/receipt-failed', { replace: true });
          return;
        }

        setOcrResults(recognized);
        navigate(
          recognized.some((result) => result.failed)
            ? '/closet/register/receipt-failed'
            : '/closet/register/product-images',
          { replace: true },
        );
      })
      .catch((error) => {
        // 실패 사유는 실패 화면이 한 줄로 보여준다
        setOcrResults(
          sending.map(() => ({ ...emptyOcrResult, failed: true, failReason: ocrErrorMessage(error) })),
        );
        navigate('/closet/register/receipt-failed', { replace: true });
      });
    // 마운트 시 한 번만 — settled로 막고 있어 의존성 변화로 다시 보내지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        {/* 스피너 60×60 — 진행 바 아래 156, 가로 중앙 (Figma) */}
        <div className="mt-[156px] flex justify-center">
          <Spinner size={60} />
        </div>

        {/* Title/T3 — 260×30, 스피너 아래 16 */}
        <p className="mt-4 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          영수증을 인식하고 있어요
        </p>
        {/* Body/B3 — 260×26, 타이틀 아래 10 */}
        <p className="mt-2.5 text-center text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
          예상 소요시간은 약 7~9초예요
        </p>

        {/* 진행 카운터 — 29×27, 문구 아래 9. 18px SemiBold, 현재 번호만 Point 색 */}
        <p className="mt-[9px] text-center text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#34363C]">
          <span className="text-[#9D98F0]">{Math.min(doneCount + 1, total)}</span>/{total}
        </p>

        {/* 장별 상태 카드 — 327×226(border-box), 좌우 24, 카운터 아래 56, radius 8 (Figma) */}
        <div className="mt-14 px-6">
          <div className="flex flex-col rounded-lg border border-[#E6E8EA] bg-white">
            {Array.from({ length: total }, (_, index) => {
              const done = index < doneCount;
              const doing = index === doneCount;
              const last = index === total - 1;
              return (
                <div
                  key={index}
                  className={[
                    // 행 75(마지막 74) = 내용 74 + 아래 구분선 1
                    'flex h-[74px] items-center justify-between px-6',
                    last ? '' : 'border-b border-[#E6E8EA]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* 아이콘 + 이름, 간격 8 */}
                  <span className="flex items-center gap-2">
                    {done ? <DoneIcon /> : doing ? <Spinner size={18} /> : <WaitIcon />}
                    {/* Body/B2 — 16px SemiBold */}
                    <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                      영수증 {index + 1}
                    </span>
                  </span>
                  <span
                    className={[
                      'text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
                      doing ? 'text-[#9D98F0]' : 'text-[#1F2124]',
                    ].join(' ')}
                  >
                    {done ? '인식 완료' : doing ? '인식 중' : '대기 중'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptRecognizingPage;
