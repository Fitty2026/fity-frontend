import type { ComponentProps } from 'react';

import PageLayout from '@/components/layout/PageLayout';
import PuzzleTopBar from '@/components/layout/PuzzleTopBar';

const MyOutfitPageLayout = ({
  title = '',
  showBack = false,
  showHeader = true,
  ...props
}: ComponentProps<typeof PageLayout>) => (
  <PageLayout
    {...props}
    title={title}
    showBack={showBack}
    showHeader={showHeader}
    customHeader={showHeader ? <PuzzleTopBar title={title} showBack={showBack} /> : undefined}
  />
);

export default MyOutfitPageLayout;
