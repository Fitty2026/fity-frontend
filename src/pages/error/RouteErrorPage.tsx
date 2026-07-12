import { useRouteError } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';

/** 라우트 렌더링 중 발생한 오류를 잡는 전역 에러 화면 (errorElement) */
const RouteErrorPage = () => {
  const error = useRouteError();
  console.error('라우트 렌더링 중 오류:', error);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex">
      <ErrorScreen onRetry={() => window.location.reload()} />
    </PageLayout>
  );
};

export default RouteErrorPage;
