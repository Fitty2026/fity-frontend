interface PermissionDeniedAlertProps {
  /** 첫 줄 — 무엇이 막혔는지 */
  title: string;
  /** 둘째 줄 — 어떻게 푸는지 */
  description: string;
  onConfirm: () => void;
}

/**
 * 권한 거부 안내 — iOS 시스템 알림 형태 (316×152, Figma).
 * 높이 검산: 20(pt) + 60(문구 블록) + 16(gap) + 44(버튼) + 12(pb) = 152.
 * 카메라·사진 권한 안내가 같은 형태라 공통으로 쓴다.
 */
const PermissionDeniedAlert = ({ title, description, onConfirm }: PermissionDeniedAlertProps) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      className="relative isolate flex w-[316px] flex-col items-center gap-4 overflow-hidden rounded-2xl pt-5 pb-3"
    >
      {/* Material/Regular — 불투명 배경 + 뒤 흐리기 */}
      <div aria-hidden className="absolute inset-0 bg-[rgba(31,33,36,0.72)] backdrop-blur-[25px]" />

      {/* Title and Description — 300×60, padding 0/16/16 */}
      <div className="relative flex w-[300px] flex-col items-center px-4 pb-4">
        {/* 17px SemiBold, LH 22, LS -0.43. 문구만 8px 아래로 (아래 버튼 위치는 그대로) */}
        <p className="w-[268px] translate-y-2 text-center text-[17px] font-semibold leading-[22px] tracking-[-0.43px] text-[#F6F7F8]">
          {title}
          <br />
          {description}
        </p>
      </div>

      {/* Buttons — 316×44, 상단 구분선 0.8 */}
      <div className="relative flex w-[316px] items-center justify-center gap-4 border-t-[0.8px] border-[rgba(178,184,189,0.48)]">
        <button
          type="button"
          onClick={onConfirm}
          // 라벨만 6px 아래로 (버튼 박스 44는 그대로)
          className="h-11 w-[270px] cursor-pointer rounded-[99px] pt-[6px] text-center text-[17px] font-semibold leading-[22px] tracking-[-0.43px] text-[#F6F7F8]"
        >
          확인
        </button>
      </div>
    </div>
  </div>
);

export default PermissionDeniedAlert;
