import PageLayout from '@/components/layout/PageeLayout';

import MyPageHeader from './MyPageHeader';

interface MyPageScaffoldProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const MyPageScaffold = ({ title, children, footer }: MyPageScaffoldProps) => (
  <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
    <MyPageHeader title={title} showBack />
    <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    {footer ? <div className="shrink-0 bg-white px-6 pb-10 pt-3">{footer}</div> : null}
  </PageLayout>
);

export default MyPageScaffold;
