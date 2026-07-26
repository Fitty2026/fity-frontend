import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudioHeader, HangerLoader } from '@/features/styling/components';
import useGenerateOutfit from '@/features/styling/hooks/useGenerateOutfit';
import useOutfitJob from '@/features/styling/hooks/useOutfitJob';
import type { OutfitJobStatus } from '@/features/styling/types';

/** 채움 속도: 1초에 2cm ≈ 75.6px (96dpi), 옷걸이 높이 160px → 약 2.1초 */
const FILL_SPEED_PX_PER_SEC = 75.6;
const HANGER_HEIGHT_PX = 160;

/** 작업 상태별 옷걸이 진행도 — 서버가 진행률을 안 주므로 단계로 근사 */
const STATUS_PROGRESS: Record<OutfitJobStatus, number> = {
  queued: 0.1,
  validating: 0.25,
  uploading: 0.4,
  processing: 0.65,
  qc_pending: 0.85,
  completed: 1,
  failed: 0,
  expired: 0,
};

/** 이전 화면에서 넘어오는 코디 생성 입력값 */
interface LoadingLocationState {
  bodyProfileId?: number;
  closetItemIds?: number[];
  styleTagIds?: number[];
}

/**
 * 코디 생성 (로딩 → 완료)
 * - 헤더(뒤로·88개) + 문구(헤더↔156) + 옷걸이(문구↔76, 189×160 중앙)
 * - 옷걸이가 고리부터 보라색으로 그려지고, 완료 시 체크 + 문구 변경
 * - 입력값이 모두 있으면 OUTFIT-01로 생성 요청 후 OUTFIT-02를 폴링,
 *   없으면 기존 목업 타이머로 진행 (입력값 확정 전까지 화면 확인용)
 */
const StylingLoadingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LoadingLocationState | null };
  const { bodyProfileId, closetItemIds, styleTagIds } = state ?? {};

  // 세 값이 모두 있어야 실제 요청 (하나라도 없으면 목업 진행)
  const canRequest =
    typeof bodyProfileId === 'number' && !!closetItemIds?.length && !!styleTagIds?.length;

  const { generate, jobId, error: generateError } = useGenerateOutfit();
  const { job, status, isCompleted, isFailed, error: jobError } = useOutfitJob(jobId);

  const [mockProgress, setMockProgress] = useState(0);

  // 생성 요청 — 입력값이 갖춰진 경우에만 1회
  useEffect(() => {
    if (!canRequest) return;
    generate({
      bodyProfileId: bodyProfileId as number,
      closetItemIds: closetItemIds as number[],
      styleTagIds: styleTagIds as number[],
    });
    // 진입 시 1회만 요청
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRequest]);

  // 목업 진행 — 요청을 못 보내는 경우에만 타이머로 채운다
  useEffect(() => {
    if (canRequest) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const filled = ((now - start) / 1000) * FILL_SPEED_PX_PER_SEC;
      const next = Math.min(1, filled / HANGER_HEIGHT_PX);
      setMockProgress(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [canRequest]);

  const failed = isFailed || !!generateError || !!jobError;
  const progress = canRequest ? (status ? STATUS_PROGRESS[status] : 0.05) : mockProgress;
  const done = canRequest ? isCompleted : mockProgress >= 1;

  // 완성 1초 후 코디 플레이로 이동 (결과는 state로 전달)
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(
      () =>
        navigate('/codyplay', {
          state: job
            ? { outfitResultId: job.outfitResultId, generatedImageUrl: job.generatedImageUrl }
            : undefined,
        }),
      1000,
    );
    return () => clearTimeout(timer);
  }, [done, job, navigate]);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col">
        <StudioHeader onBack={() => navigate(-1)} count={88} />

        <div className="flex-1 flex flex-col items-center pt-[156px]">
          {/* 문구 — Title/T3: Pretendard 600 / 20px / lh150% / -2% / #1F2124, 헤더↔문구 156 */}
          {/* 실패 문구는 시안 미수급 — 확정되면 교체 */}
          <p className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-center text-[#1F2124]">
            {failed ? '코디 생성에 실패했어요' : done ? '코디가 완성되었어요' : '코디를 만들고 있어요'}
          </p>

          {/* 옷걸이 189×160 중앙, 문구↔옷걸이 76 */}
          <HangerLoader progress={progress} className="mt-[76px]" />
        </div>
      </div>
    </div>
  );
};

export default StylingLoadingPage;
