import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudioHeader, HangerLoader } from '@/features/styling/components';
import useStudioBack from '@/features/styling/hooks/useStudioBack';
import useGenerateOutfit from '@/features/styling/hooks/useGenerateOutfit';
import useOutfitJob from '@/features/styling/hooks/useOutfitJob';
import useActiveOutfitJob from '@/features/styling/hooks/useActiveOutfitJob';
import useMyProfile from '@/features/auth/hooks/useMyProfile';
import usePuzzleBalance, { useRefreshPuzzleBalance } from '@/features/puzzle/hooks/usePuzzleBalance';
import { ApiError } from '@/lib/apiError';
import type { OutfitJobInput } from '@/features/styling/types';

/** 이전 화면에서 넘어오는 코디 생성 입력값 (체형 프로필은 서버가 JWT로 조회) */
type LoadingLocationState = Partial<OutfitJobInput>;

/**
 * 코디 생성 (로딩 → 완료)
 * - 헤더(뒤로·88개) + 문구(헤더↔156) + 옷걸이(문구↔76, 189×160 중앙)
 * - 옷걸이가 고리부터 보라색으로 그려지고, 완료 시 체크 + 문구 변경
 * - 입력값이 있으면 OUTFIT-01로 생성 요청 후 OUTFIT-02를 폴링
 * - 입력값이 없으면(새로고침·재진입으로 jobId 유실) 진행 중인 job을 조회해 폴링을 이어받고,
 *   그것도 없으면 실패로 처리한다 (예전 목업 타이머는 가짜 완료를 만들어서 제거)
 * - 실패 시 문구만 남기고 옷걸이는 숨긴다 (재시도 수단은 시안 미수급)
 * - 입력값이 모두 있으면 OUTFIT-01로 생성 요청 후 OUTFIT-02를 폴링,
 *   없으면 기존 목업 타이머로 진행 (입력값 확정 전까지 화면 확인용)
 */
const StylingLoadingPage = () => {
  const navigate = useNavigate();
  const goBack = useStudioBack();
  const { state } = useLocation() as { state: LoadingLocationState | null };
  const { closetItemIds, situation, selectedDate, weather } = state ?? {};

  // 스타일 태그는 온보딩에서 고른 값 — /users/me의 styleTagIds를 그대로 보낸다
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const styleTagIds = state?.styleTagIds ?? profile?.styleTagIds ?? undefined;

  // 옷장 아이템만 필수 — 나머지는 선택값이라 없으면 빼고 보낸다.
  // 프로필 조회가 끝난 뒤 요청해야 스타일 태그가 빠지지 않는다.
  const hasInput = !!closetItemIds?.length;
  const canRequest = hasInput && !profileLoading;

  const { generate, accepted, jobId: newJobId, error: generateError } = useGenerateOutfit();

  // 입력값이 없으면 새로고침·재진입으로 jobId를 잃은 경우 — 진행 중인 job을 찾아 폴링을 이어받는다
  const {
    data: activeJob,
    isPending: activePending,
    error: activeError,
  } = useActiveOutfitJob(!hasInput);

  const jobId = newJobId ?? activeJob?.jobId ?? null;
  const { job, progress: jobProgress, isCompleted, isFailed, error: jobError } = useOutfitJob(jobId);

  const puzzleBalance = usePuzzleBalance();
  const refreshPuzzleBalance = useRefreshPuzzleBalance();

  // 차감은 서버가 한다 (생성 접수 시 10개). 접수됐으면 잔량을 다시 받아온다.
  useEffect(() => {
    if (accepted && !accepted.isExistingJob) refreshPuzzleBalance();
  }, [accepted, refreshPuzzleBalance]);

  // 생성 요청 — 입력값이 갖춰진 경우에만 1회
  useEffect(() => {
    if (!canRequest) return;
    generate({ closetItemIds: closetItemIds as number[], styleTagIds, situation, selectedDate, weather });
    // 진입 시 1회만 요청
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRequest]);

  // 진행 중인 job 조회가 끝났는데 아무것도 없으면 이어받을 게 없다
  const noJobToResume = !hasInput && !activePending && !activeJob;
  const failed = isFailed || !!generateError || !!jobError || !!activeError || noJobToResume;

  // 실패 사유별 안내 — 문구는 시안 미수급이라 임시.
  // 체형 프로필이 없으면 서버가 생성 자체를 받지 않는다(404 NOT_FOUND404).
  // 만료(JOB_TIMEOUT)는 정상 200 응답의 status: expired + failure.code로 온다.
  const noBodyProfile =
    generateError instanceof ApiError && generateError.code === 'NOT_FOUND404';
  const failedMessage = noBodyProfile
    ? '체형 정보를 먼저 등록해야 코디를 만들 수 있어요'
    : job?.status === 'expired'
      ? '생성 시간이 초과됐어요. 다시 시도해주세요'
      : '코디 생성에 실패했어요';

  // 서버 progress(0~100) → 옷걸이 채움 비율(0~1).
  // 접수 응답 / 이어받은 job의 값을 먼저 쓰고 폴링값으로 갱신
  const serverProgress = jobProgress || accepted?.progress || activeJob?.progress || 0;
  const progress = serverProgress / 100;
  const done = isCompleted;

  // 완성 1초 후 코디 플레이로 이동 (결과는 state로 전달)
  useEffect(() => {
    if (!done) return;
    // 서버 차감이 반영된 잔량을 완료 시점에 한 번 더 맞춘다
    refreshPuzzleBalance();
    const timer = setTimeout(
      () =>
        navigate('/codyplay', {
          state: job
            ? { jobId, outfitResultId: job.outfitResultId, generatedImageUrl: job.generatedImageUrl }
            : undefined,
        }),
      1000,
    );
    return () => clearTimeout(timer);
  }, [done, job, jobId, navigate, refreshPuzzleBalance]);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col">
        <StudioHeader onBack={goBack} count={puzzleBalance} />

        <div className="flex-1 flex flex-col items-center pt-[156px]">
          {/* 문구 — Title/T3: Pretendard 600 / 20px / lh150% / -2% / #1F2124, 헤더↔문구 156 */}
          {/* 실패 문구는 시안 미수급 — 확정되면 교체 */}
          <p className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-center text-[#1F2124]">
            {failed ? failedMessage : done ? '코디가 완성되었어요' : '코디를 만들고 있어요'}
          </p>

          {/* 옷걸이 189×160 중앙, 문구↔옷걸이 76. 실패 시엔 진행 표시가 의미 없어 숨긴다 */}
          {!failed && <HangerLoader progress={progress} className="mt-[76px]" />}
        </div>
      </div>
    </div>
  );
};

export default StylingLoadingPage;
