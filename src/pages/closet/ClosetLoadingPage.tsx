import PageLayout from '@/components/layout/PageeLayout';
import { ImportLoadingView } from '@/features/closet/components';
import type { ChecklistStep } from '@/features/closet/components';

/** 플로우별 콘텐츠 — import(연동), analyze(사진) */
type LoadingVariant = 'import' | 'analyze';

const VARIANTS: Record<LoadingVariant, { title: string; firstStep: string }> = {
  import: { title: '옷장을 불러오는 중이에요', firstStep: '구매 내역을 확인하는 중이에요' },
  analyze: { title: '옷을 분석하는 중이에요', firstStep: '업로드 된 사진을 확인하는 중이에요' },
};

interface ClosetLoadingPageProps {
  variant?: LoadingVariant;
}

/**
 * 분석/불러오기 로딩 (Import Loading, DAT-03)
 * - 연동(권한) 플로우 / 사진 등록 플로우 공용. 타이틀·첫 스텝만 플로우별로 분기
 */
const ClosetLoadingPage = ({ variant = 'analyze' }: ClosetLoadingPageProps) => {
  const { title, firstStep } = VARIANTS[variant];

  const steps: ChecklistStep[] = [
    { label: firstStep, status: 'done' },
    { label: '상품 정보를 정리하고 있어요', status: 'current' },
    { label: '옷장을 구성하는 중이에요', status: 'pending' },
  ];

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col justify-center h-[100dvh] min-h-0 px-5 bg-[#F9F9F9]">
        <ImportLoadingView
          title={title}
          subtitle="사용자의 소중한 스타일 데이터를 정리하고 있습니다."
          percent={65}
          progressLabel="진행"
          steps={steps}
          note="잠시만 기다려주세요. 곧 완료돼요."
        />
      </div>
    </PageLayout>
  );
};

export default ClosetLoadingPage;
