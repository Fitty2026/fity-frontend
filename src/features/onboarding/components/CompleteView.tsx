import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

/** 체크가 회색→검정으로 차오른 뒤 다음 버튼이 나타나기까지의 시간 */
const ACTIVATE_DELAY_MS = 800;

/**
 * 촬영/업로드 완료 화면 — 회색 체크로 떴다가 잠시 후 검정 체크로 바뀌며 다음 버튼이 나타난다.
 * (Figma '이미지 확인' 비활성 → 활성 두 프레임)
 */
const CompleteView = ({ message, onNext }: { message: string; onNext: () => void }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), ACTIVATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${
            ready ? 'bg-black' : 'bg-neutral-100'
          }`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={ready ? 'white' : 'black'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="text-base font-medium">{message}</p>
      </div>
      <div
        className={`px-6 transition-opacity duration-300 ${
          ready ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Button label="다음" shape="pill" fullWidth onClick={onNext} />
      </div>
    </>
  );
};

export default CompleteView;
