import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';

/** 인식 결과 — API 연동 전 목업 */
const RESULTS = [
  { store: '무신사 스탠다드 강남점', date: '2026.06.28.', failed: false },
  { store: 'ZARA 코엑스점', date: '2026.07.11.', failed: false },
  { store: '', date: '', failed: true },
];

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

/** 인식 실패 — 24×24 경고, stroke #B2B8BD */
const FailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M11.5002 9.86798V13.1294M3.2696 16.0656C2.50343 17.3702 3.46159 19 4.99306 19H18.0074C19.538 19 20.4962 17.3702 19.7309 16.0656L13.2246 4.97843C12.4584 3.67386 10.5421 3.67386 9.77591 4.97843L3.2696 16.0656ZM11.5002 15.7386H11.5064V15.7455H11.5002V15.7386Z"
      stroke="#B2B8BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 상세 이동 — 20×20 화살표, stroke #1F2124 */
const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M6.875 3.75L13.125 10L6.875 16.25"
      stroke="#1F2124"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 구매일 — 20×20 캘린더, stroke #5A6169 */
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M5.77778 3V4.66667M13.5556 3V4.66667M3 14.6667V6.33333C3 5.89131 3.17559 5.46738 3.48816 5.15482C3.80072 4.84226 4.22464 4.66667 4.66667 4.66667H14.6667C15.1087 4.66667 15.5326 4.84226 15.8452 5.15482C16.1577 5.46738 16.3333 5.89131 16.3333 6.33333V14.6667M16.3333 14.6667V9.11111C16.3333 8.66908 16.1577 8.24516 15.8452 7.9326C15.5326 7.62004 15.1087 7.44444 14.6667 7.44444H4.66667C4.22464 7.44444 3.80072 7.62004 3.48816 7.9326C3.17559 8.24516 3 8.66908 3 9.11111V14.6667C3 15.1087 3.17559 15.5326 3.48816 15.8452C3.80072 16.1577 4.22464 16.3333 4.66667 16.3333H14.6667C15.1087 16.3333 15.5326 16.1577 15.8452 15.8452C16.1577 15.5326 16.3333 15.1087 16.3333 14.6667Z"
      stroke="#5A6169"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 영수증 인식 완료 — 장별 결과를 보여주고 다음 행동을 고르게 한다.
 * ※ 카드 내부 간격·타이포·아이콘은 시안 값 미수급이라 임시.
 */
const ClosetReceiptDonePage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 타이틀 — 375×30 (Title/T3) */}
          <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            영수증 인식이 완료되었어요
          </h1>

          {/* 결과 카드 — 327×131(실패 157), 좌우 24, 타이틀 아래 56, 카드 간 24 (Figma) */}
          <div className="mt-14 flex flex-col gap-6 px-6">
            {RESULTS.map((result, index) => (
              // padding 20/16, radius 8, border 1px #E6E8EA
              <div key={index} className="flex flex-col gap-2 rounded-lg border border-[#E6E8EA] px-4 py-5">
                {/* 머리줄 — 아이콘 24 + gap 8 + 이름, 우측 화살표 20 */}
                <div className="flex h-[26px] items-center justify-between">
                  <span className="flex items-center gap-2">
                    {result.failed ? <FailIcon /> : <DoneIcon />}
                    {/* Body/B2 — 16px SemiBold, Primary/700 */}
                    <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#474C52]">
                      영수증 {index + 1}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`영수증 ${index + 1} 상세`}
                    onClick={() =>
                      navigate('/closet/register/ocr-confirm', { state: { from: 'list' } })
                    }
                    className="cursor-pointer"
                  >
                    <ChevronIcon />
                  </button>
                </div>

                {result.failed ? (
                  // 실패 — 문구와 버튼 사이 16
                  <div className="flex flex-col gap-4">
                    <p className="text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-black">
                      일부 정보를 인식하지 못했어요
                    </p>
                    {/* 복구 수단 — 144×36, radius 32, border #CED1D5, 사이 5 */}
                    <div className="flex gap-[5px]">
                      <button
                        type="button"
                        onClick={() =>
                          navigate('/closet/register/ocr-manual', { state: { from: 'list' } })
                        }
                        className="h-9 flex-1 cursor-pointer rounded-[32px] border border-[#CED1D5] text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
                      >
                        직접 입력
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate('/closet/register/receipt-upload', {
                            state: { replaceIndex: index },
                          })
                        }
                        className="h-9 flex-1 cursor-pointer rounded-[32px] border border-[#CED1D5] text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
                      >
                        다시 업로드
                      </button>
                    </div>
                  </div>
                ) : (
                  // 성공 — 상호명과 날짜 사이 4
                  <div className="flex flex-col gap-1">
                    <p className="text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-black">
                      {result.store}
                    </p>
                    <p className="flex items-center gap-0.5 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
                      <CalendarIcon />
                      {result.date}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 고정 버튼 — 327×58, 사이 8 */}
        <div className="flex flex-col gap-2 px-6 pt-4 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            onClick={() => navigate('/closet/items')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#F6F7F8] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
          >
            옷장 보러가기
          </button>
          <button
            type="button"
            onClick={() => navigate('/styling')}
            className="h-[58px] w-full cursor-pointer rounded-[32px] bg-[#1F2124] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
          >
            코디 시작하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetReceiptDonePage;
