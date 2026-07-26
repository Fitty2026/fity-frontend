import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudioHeader, HangerLoader } from '@/features/styling/components';

/** 채움 속도: 1초에 2cm ≈ 75.6px (96dpi), 옷걸이 높이 160px → 약 2.1초 */
const FILL_SPEED_PX_PER_SEC = 75.6;
const HANGER_HEIGHT_PX = 160;

/**
 * 코디 생성 (로딩 → 완료)
 * - 헤더(뒤로·88개) + 문구(헤더↔156) + 옷걸이(문구↔76, 189×160 중앙)
 * - 옷걸이가 위→아래로 보라색으로 채워지고, 완료 시 체크 + 문구 변경
 * ※ 완료 후 이동은 미정 (스코프 확인 필요)
 */
const StylingLoadingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const filled = ((now - start) / 1000) * FILL_SPEED_PX_PER_SEC;
      const next = Math.min(1, filled / HANGER_HEIGHT_PX);
      setProgress(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const done = progress >= 1;

  // 완성 1초 후 코디 플레이로 이동
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => navigate('/codyplay'), 1000);
    return () => clearTimeout(timer);
  }, [done, navigate]);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col">
        <StudioHeader onBack={() => navigate(-1)} count={88} />

        <div className="flex-1 flex flex-col items-center pt-[156px]">
          {/* 문구 — Title/T3: Pretendard 600 / 20px / lh150% / -2% / #1F2124, 헤더↔문구 156 */}
          <p className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-center text-[#1F2124]">
            {done ? '코디가 완성되었어요' : '코디를 만들고 있어요'}
          </p>

          {/* 옷걸이 189×160 중앙, 문구↔옷걸이 76 */}
          <HangerLoader progress={progress} className="mt-[76px]" />
        </div>
      </div>
    </div>
  );
};

export default StylingLoadingPage;
