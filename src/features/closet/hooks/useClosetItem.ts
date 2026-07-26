import { useQuery } from '@tanstack/react-query';
import { getClosetItem } from '../api/closetApi';

/**
 * 옷장 아이템 상세 조회(CLOSET-04). itemId 있을 때만 실행.
 */
const useClosetItem = (itemId?: string) =>
  useQuery({
    queryKey: ['closets', 'item', itemId],
    queryFn: () => getClosetItem(itemId as string),
    enabled: !!itemId,
  });

export default useClosetItem;
