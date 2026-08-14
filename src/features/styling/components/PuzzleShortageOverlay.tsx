import { GENERATION_COST } from '@/store/puzzleStore';

interface PuzzleShortageOverlayProps {
  balance: number;
  onClose: () => void;
}

/**
 * 퍼즐 부족 안내 오버레이 — 잔량이 생성 비용(10) 미만일 때 생성 CTA에서 띄운다.
 * 충전이 MVP 범위 밖이라 안내 후 닫기만 제공한다.
 * ※ 시안 미수급 — 딤 40% + 260 카드(옷장 인식 실패 오버레이 패턴 준용). 시안 오면 교체.
 */
const PuzzleShortageOverlay = ({ balance, onClose }: PuzzleShortageOverlayProps) => (
  <div
    className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 px-6"
    onClick={onClose}
  >
    <div
      className="w-[260px] rounded-2xl bg-white px-6 py-8 text-center"
      onClick={(event) => event.stopPropagation()}
    >
      <h3 className="text-base font-semibold text-[#1F2124]">퍼즐이 부족해요</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#6F7881]">
        코디 생성에는 퍼즐 {GENERATION_COST}개가 필요해요
        <br />
        (현재 {balance}개)
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 h-11 w-full rounded-full bg-[#1F2124] text-sm font-semibold text-white"
      >
        확인
      </button>
    </div>
  </div>
);

export default PuzzleShortageOverlay;
