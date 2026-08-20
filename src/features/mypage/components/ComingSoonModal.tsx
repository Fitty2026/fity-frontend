import { createPortal } from 'react-dom';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  if (!isOpen) return null;

  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        className="w-full rounded-[16px] bg-white px-5 pb-5 pt-7 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="coming-soon-title" className="text-[20px] font-semibold text-[#1F2124]">
          준비중입니다
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-[32px] bg-[#1F2124] py-[14px] text-[15px] font-semibold text-white"
        >
          확인
        </button>
      </div>
    </div>,
    container,
  );
};

export default ComingSoonModal;
