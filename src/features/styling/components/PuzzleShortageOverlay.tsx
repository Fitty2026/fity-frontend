interface PuzzleShortageOverlayProps {
  balance: number;
  onClose: () => void;
}

/** 옷걸이 — 헤더 배지와 같은 에셋을 크기·색만 바꿔 쓴다 (시안: 48 #CED1D5 / 20 #5A6169) */
const HangerIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.0982 10.7L8.83321 6L10.2995 4.9C10.3617 4.85349 10.4122 4.79313 10.447 4.7237C10.4818 4.65427 10.5 4.57768 10.5001 4.5C10.5001 3.83696 10.2367 3.20107 9.76785 2.73223C9.29901 2.26339 8.66312 2 8.00008 2C7.33704 2 6.70115 2.26339 6.23231 2.73223C5.76347 3.20107 5.50008 3.83696 5.50008 4.5C5.50008 4.63261 5.55276 4.75979 5.64653 4.85355C5.7403 4.94732 5.86747 5 6.00008 5C6.13269 5 6.25987 4.94732 6.35363 4.85355C6.4474 4.75979 6.50008 4.63261 6.50008 4.5C6.50109 4.12339 6.64374 3.76094 6.89968 3.48466C7.15561 3.20837 7.50612 3.03848 7.88155 3.00872C8.25699 2.97896 8.62988 3.09152 8.92615 3.32403C9.22242 3.55655 9.42038 3.892 9.48071 4.26375L7.70883 5.59312L7.69133 5.60625L0.901955 10.7C0.734177 10.8258 0.610207 11.0012 0.54758 11.2014C0.484953 11.4015 0.48684 11.6163 0.552974 11.8153C0.619107 12.0144 0.74614 12.1876 0.916103 12.3104C1.08607 12.4333 1.29036 12.4996 1.50008 12.5H14.5001C14.71 12.5 14.9145 12.434 15.0848 12.3112C15.2551 12.1885 15.3824 12.0153 15.4488 11.8162C15.5151 11.6171 15.5172 11.4022 15.4546 11.2018C15.392 11.0015 15.268 10.8259 15.1001 10.7H15.0982ZM14.5001 11.5H1.50008L8.00008 6.625L14.5001 11.5Z" fill={color} />
  </svg>
);

/**
 * 퍼즐 부족 팝업 — 잔량이 생성 비용 미만일 때 생성 CTA에서 띄운다 (2026-08-14 시안 반영).
 * 딤 30%, 카드 306(#F6F7F8 r8, py-32 gap-16), 중앙에서 위로 10.
 * '퍼즐 충전하기'는 충전 기능이 MVP 밖이라 연결할 화면이 없다 — 시안대로 두되 동작은 TODO.
 */
const PuzzleShortageOverlay = ({ balance, onClose }: PuzzleShortageOverlayProps) => (
  <div className="absolute inset-0 z-40 bg-black/30" onClick={onClose}>
    <div
      className="absolute left-1/2 top-[calc(50%-10px)] flex w-[306px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-lg bg-[#F6F7F8] py-8"
      onClick={(event) => event.stopPropagation()}
    >
      <HangerIcon size={48} color="#CED1D5" />

      {/* 타이틀 T3 + 본문 B3, 제목↔본문 10 */}
      <div className="flex w-full flex-col gap-[10px]">
        <h3 className="text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          퍼즐이 부족해요
        </h3>
        <p className="text-center text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
          퍼즐이 부족해 코디를 생성할 수 없어요
          <br />
          퍼즐을 충전한 뒤 다시 시도해 주세요
        </p>
      </div>

      {/* 보유 퍼즐 칩 — 118×38 #E6E8EA r36 */}
      <div className="flex items-center gap-[6px] rounded-[36px] bg-[#E6E8EA] px-3 py-2">
        <HangerIcon size={20} color="#5A6169" />
        <span className="flex items-center gap-2 text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
          <span>보유 퍼즐</span>
          <span>{balance}</span>
        </span>
      </div>

      {/* 버튼 258×44 r32, 간격 8 */}
      <div className="flex w-[258px] flex-col gap-2">
        <button
          type="button"
          // TODO: 충전 화면이 생기면 연결 (충전·거래내역은 MVP 범위 밖 — 2026-08-14 PM)
          className="h-11 w-full rounded-[32px] border border-[#CED1D5] bg-[#1F2124] text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#F6F7F8]"
        >
          퍼즐 충전하기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-[32px] border border-[#CED1D5] text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#1F2124]"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
);

export default PuzzleShortageOverlay;
