import { createPortal } from 'react-dom';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 px-[24px]"
      onClick={onCancel}
    >
      <div
        className="w-full rounded-[16px] bg-white px-[20px] pb-[20px] pt-[28px] text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-confirm-title" className="text-[20px] font-[600] text-[#1F2124]">
          코디를 삭제할까요?
        </h2>
        <p className="mt-[8px] text-[14px] font-[500] leading-[160%] text-[#6F7881]">
          삭제한 코디는 최근 삭제된 코디에서 확인할 수 있어요.
        </p>
        <div className="mt-[24px] flex gap-[8px]">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-[32px] bg-[#F6F7F8] py-[14px] text-[15px] font-[600] text-[#1F2124]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-[32px] bg-[#1F2124] py-[14px] text-[15px] font-[600] text-white"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>,
    container,
  );
};

export default DeleteConfirmModal;
