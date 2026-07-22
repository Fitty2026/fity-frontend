import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { HangerLoader, OnboardingTopBar } from '@/features/closet/components';
import type { ClosetLoadingVariant } from '@/features/closet/types';

// 채우기 속도 2cm/s = 75.5906px/s (1cm=37.7953px). 높이 160px → 160/75.5906 ≈ 2.1167s
const FILL_MS = 2116.7; // TODO: 백엔드 실제 완료 시점과 연결 (지금은 채우기 시간 후 자동 전환)
const DONE_HOLD_MS = 1200; // 완료 표시 유지 후 다음 화면으로

const COPY: Record<ClosetLoadingVariant, { loading: string; done: string }> = {
  import: { loading: '구매내역을 불러 오는 중이에요', done: '구매내역을 불러왔어요' },
  analyze: { loading: '사진을 분석하는 중이에요', done: '사진 분석이 끝났어요' },
};

/**
 * 옷 등록 로딩 — 옷걸이 채우기 + 안내 문구. 완료 후 태그 확인 화면으로 자동 이동.
 * variant: import(구매내역 불러오기) / analyze(사진 분석)
 */
const ClosetLoadingPage = ({ variant = 'analyze' }: { variant?: ClosetLoadingVariant }) => {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const copy = COPY[variant];

  useEffect(() => {
    const t = setTimeout(() => setDone(true), FILL_MS);
    return () => clearTimeout(t);
  }, []);

  // 완료 표시 후 태그 확인 화면으로 이동 (임시: 추후 백엔드 완료 응답과 연동)
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
          {done ? copy.done : copy.loading}
        </h1>

        {/* 옷걸이 — 타이틀 아래 72px */}
        <div className="mt-[72px]">
          <HangerLoader state={done ? 'done' : 'loading'} durationMs={FILL_MS} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetLoadingPage;
