import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import './comingSoonModal.css';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      className="coming-soon-backdrop absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-6"
      onClick={onClose}
    >
      <div
        className="coming-soon-panel w-full max-w-[320px] rounded-[24px] bg-white px-6 pb-5 pt-6 text-center shadow-[0_20px_56px_rgba(31,33,36,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F7F8] text-[#1F2124]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 7.5V12L15 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2
          id="coming-soon-title"
          className="mt-4 text-[18px] font-semibold leading-[1.5] tracking-[-0.36px] text-[#1F2124]"
        >
          준비 중인 기능이에요
        </h2>
        <p className="mt-2 text-[13px] font-medium leading-[1.6] tracking-[-0.26px] text-[#6F7881]">
          더 좋은 경험을 위해 준비하고 있어요.
          <br />
          조금만 기다려 주세요!
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-5 w-full cursor-pointer rounded-[32px] bg-[#1F2124] py-[13px] text-[14px] font-semibold leading-[1.5] text-white transition-[transform,background-color] duration-150 hover:bg-[#34363C] active:scale-[0.98]"
        >
          확인
        </button>
      </div>
    </div>,
    container,
  );
};

export default ComingSoonModal;
