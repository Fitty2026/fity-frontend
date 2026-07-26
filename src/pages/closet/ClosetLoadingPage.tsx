import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { HangerLoader, OnboardingTopBar } from '@/features/closet/components';
import type { ClosetLoadingVariant } from '@/features/closet/types';
import useAddClosetItem from '@/features/closet/hooks/useAddClosetItem';
import type { ApiClosetCategory, ImportType } from '@/features/closet/api/closetApi';

// 옷걸이 그리기 시간 (시각용) / 최소 노출 시간 / 완료 표시 유지
const FILL_MS = 5500;
const MIN_SHOW_MS = 2000;
const DONE_HOLD_MS = 1200;

// TODO(스펙): category enum·선택 UI 미확정 → 임시 기본값 (BE3 확인 후 교체)
const DEFAULT_CATEGORY: ApiClosetCategory = 'TOP';

const COPY: Record<ClosetLoadingVariant, { loading: string; done: string }> = {
  import: { loading: '구매내역을 불러 오는 중이에요', done: '구매내역을 불러왔어요' },
  analyze: { loading: '사진을 분석하는 중이에요', done: '사진 분석이 끝났어요' },
};

/**
 * 옷 등록 로딩 — 옷걸이 채우기 + 안내 문구. 완료 후 추가 완료 화면으로 자동 이동.
 * analyze 변형은 이전 화면에서 넘어온 file로 IMAGE-01 업로드 → CLOSET-02 등록을 실제 수행.
 * (file 없이 진입하면 시각용 타이머로 폴백)
 */
const ClosetLoadingPage = ({ variant = 'analyze' }: { variant?: ClosetLoadingVariant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { file, importType } = (location.state ?? {}) as { file?: File; importType?: ImportType };
  const { addItemAsync, error } = useAddClosetItem();
  const [done, setDone] = useState(false);
  const submittedRef = useRef(false); // 등록 1회 보장 (StrictMode/재마운트 중복 호출 방지)

  const copy = COPY[variant];

  // 등록 실행 — file 있으면 실제 API(업로드→등록)
  useEffect(() => {
    let alive = true;

    // analyze인데 file 없음(새로고침/직접 진입) → 등록 없이 완료 표시하면 안 되므로 업로드부터 다시
    if (variant === 'analyze' && !file) {
      navigate('/closet/register/upload', { replace: true });
      return;
    }

    // (비-analyze 등 file 없는 경우 방어 — 시각용 타이머 폴백)
    if (!file) {
      const t = setTimeout(() => alive && setDone(true), FILL_MS);
      return () => {
        alive = false;
        clearTimeout(t);
      };
    }

    if (submittedRef.current) return; // 이미 등록 요청함 → 재실행 무시
    submittedRef.current = true;

    (async () => {
      try {
        // 최소 노출 시간을 함께 기다려 애니메이션이 너무 빨리 사라지지 않게
        await Promise.all([
          addItemAsync({ file, category: DEFAULT_CATEGORY, importType: importType ?? '앨범' }),
          new Promise((resolve) => setTimeout(resolve, MIN_SHOW_MS)),
        ]);
        if (alive) setDone(true);
      } catch {
        // 실패 시 error(ApiError)로 화면에 표시
      }
    })();

    return () => {
      alive = false;
    };
  }, [variant, file, importType, addItemAsync, navigate]);

  // 완료 표시 후 추가 완료 화면으로 이동
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate('/closet/register/added'), DONE_HOLD_MS);
    return () => clearTimeout(t);
  }, [done, navigate]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} onSkip={() => navigate('/closet')} />

        {/* 안내 문구 — 로딩바 아래 156px */}
        <h1 className="mt-[156px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          {error ? '등록에 실패했어요' : done ? copy.done : copy.loading}
        </h1>

        {/* 옷걸이 — 타이틀 아래 72px */}
        <div className="mt-[72px]">
          <HangerLoader state={done ? 'done' : 'loading'} durationMs={FILL_MS} />
        </div>

        {/* 실패 시 메시지 + 다시 시도 */}
        {error && (
          <div className="mt-10 flex flex-col items-center gap-4 px-6">
            <p className="text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#E5484D]">
              {(error as Error).message || '잠시 후 다시 시도해주세요.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/closet/register/upload')}
              className="h-[48px] rounded-[32px] bg-[#1F2124] px-8 text-[14px] font-semibold text-[#F6F7F8] cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ClosetLoadingPage;
