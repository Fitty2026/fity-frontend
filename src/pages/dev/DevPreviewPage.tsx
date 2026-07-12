import { useState } from 'react';
import PageLayout from '@/components/layout/PageeLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';

const TABS = ['로딩', '에러', '404'] as const;
type Tab = (typeof TABS)[number];

/** 개발 모드 전용 - 로딩/에러/404 화면을 탭으로 전환하며 확인 */
const DevPreviewPage = () => {
  const [tab, setTab] = useState<Tab>('로딩');

  return (
    <PageLayout title="로딩/에러 미리보기 (dev)" showBottomNav={false}>
      <div className="flex gap-2 p-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? 'border-black bg-black text-white'
                : 'border-neutral-300 bg-white text-neutral-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex min-h-[70vh]">
        {tab === '로딩' && <LoadingScreen />}
        {tab === '에러' && <ErrorScreen onRetry={() => window.alert('다시 시도 클릭됨')} />}
        {tab === '404' && (
          <ErrorScreen
            title="페이지를 찾을 수 없어요"
            description="주소가 잘못되었거나 삭제된 페이지예요"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default DevPreviewPage;
