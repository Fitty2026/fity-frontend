import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const isDragging = useRef(false);

  // 열릴 때는 렌더 중에 바로 마운트하고, 닫힐 때는 슬라이드 다운부터 시작한다
  if (isOpen && !visible) setVisible(true);
  if (!isOpen && animated) setAnimated(false);

  // 열림: 다음 프레임에 슬라이드 업 애니메이션 시작 + 배경 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 닫힘: 애니메이션(300ms)이 끝난 뒤 포털을 내린다
  useEffect(() => {
    if (isOpen || !visible) return;
    const timer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen, visible]);

  const handleClose = () => onClose();

  const onDragStart = (clientY: number) => {
    isDragging.current = true;
    dragStartY.current = clientY;
    dragCurrentY.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };

  const onDragMove = (clientY: number) => {
    if (!isDragging.current) return;
    const delta = clientY - dragStartY.current;
    if (delta < 0) return;
    dragCurrentY.current = delta;
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${delta}px)`;
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sheetRef.current) sheetRef.current.style.transition = '';
    if (dragCurrentY.current > 150) {
      handleClose();
    } else {
      if (sheetRef.current) sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  const onTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => onDragMove(e.touches[0].clientY);
  const onMouseDown = (e: React.MouseEvent) => onDragStart(e.clientY);
  const onMouseMove = (e: React.MouseEvent) => onDragMove(e.clientY);
  const onMouseUp = () => onDragEnd();

  if (!visible) return null;

  // app-container 안에 portal로 렌더링
  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <>
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 bg-black/50 z-40 transition-opacity duration-300"
        style={{ opacity: animated ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* 시트 본체 */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl z-50 transition-transform duration-300 ease-out"
        style={{ transform: animated ? 'translateY(0)' : 'translateY(100%)' }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="flex justify-center pt-3 pb-4 cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onDragEnd}
          onMouseDown={onMouseDown}
        >
          <div className="w-10 h-1 bg-neutral-300 rounded-full" />
        </div>

        {title && (
          <div className="px-5 pb-3 border-b border-neutral-100">
            <h3 className="text-base font-semibold text-black">{title}</h3>
          </div>
        )}

        <div className="px-5 pt-4 pb-8">{children}</div>
      </div>
    </>,
    container,
  );
};

export default BottomSheet;