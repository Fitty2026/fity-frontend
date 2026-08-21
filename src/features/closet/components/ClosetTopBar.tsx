import PuzzleTopBar from '@/components/layout/PuzzleTopBar';

interface ClosetTopBarProps {
  showBack?: boolean;
  height?: 50 | 53;
}

const ClosetTopBar = ({ showBack = true, height = 53 }: ClosetTopBarProps) => (
  <PuzzleTopBar title="옷장" showBack={showBack} height={height} />
);

export default ClosetTopBar;
