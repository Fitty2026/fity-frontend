import PageLayout from '@/components/layout/PageLayout';

import MyPageHeader from './MyPageHeader';

interface MyPageScaffoldProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}

const MyPageScaffold = ({
  title,
  children,
  footer,
  contentClassName = '',
}: MyPageScaffoldProps) => (
  <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
    <MyPageHeader title={title} showBack />
    <div className={`min-h-0 flex-1 overflow-y-auto ${contentClassName}`}>{children}</div>
    {footer ? <div className="shrink-0 bg-white px-6 pb-10 pt-3">{footer}</div> : null}
  </PageLayout>
);

export default MyPageScaffold;
