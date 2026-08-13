import PageLayout from '@/components/layout/PageLayout';
import ErrorScreen from '@/components/ui/ErrorScreen';

const NotFoundPage = () => (
  <PageLayout showHeader={false} showBottomNav={false} className="flex">
    <ErrorScreen
      title="페이지를 찾을 수 없어요"
      description="주소가 잘못되었거나 삭제된 페이지예요"
    />
  </PageLayout>
);

export default NotFoundPage;
