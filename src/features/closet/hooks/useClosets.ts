import { useQuery } from '@tanstack/react-query';
import { getClosets } from '../api/closetApi';

/**
 * 옷장 목록 조회(CLOSET-03). 홈·전체 아이템에서 공유 (react-query 캐시로 중복 요청 dedupe).
 * TODO(백엔드 확인 후): 카테고리 쿼리 파라미터·페이지네이션 반영. 현재는 전체 일괄 조회.
 */
const useClosets = () =>
  useQuery({
    queryKey: ['closets'],
    queryFn: getClosets,
  });

export default useClosets;
