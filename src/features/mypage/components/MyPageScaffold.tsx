import PageLayout from '@/components/layout/PageLayout';
import PuzzleTopBar from '@/components/layout/PuzzleTopBar';

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
  <PageLayout
    title={title}
    showBack
    showBottomNav={false}
    className="flex flex-col"
    customHeader={<PuzzleTopBar title={title} />}
  >
    <div className={`min-h-0 flex-1 overflow-y-auto ${contentClassName}`}>{children}</div>
    {footer ? <div className="shrink-0 bg-white px-6 pb-10 pt-3">{footer}</div> : null}
  </PageLayout>
);

export default MyPageScaffold;
