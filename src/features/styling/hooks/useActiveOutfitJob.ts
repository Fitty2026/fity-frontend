import { useQuery } from '@tanstack/react-query';
import { getActiveOutfitJob } from '../api/stylingApi';

/**
 * 진행 중인 내 코디 생성 작업 조회.
 * jobId는 라우터 state에만 있어 새로고침·재진입 시 유실된다. 그때 이 조회로 폴링을 이어받는다.
 * 진행 중인 작업이 없으면 data가 null (백엔드가 사용자당 job 1개로 제한).
 */
const useActiveOutfitJob = (enabled: boolean) =>
  useQuery({
    queryKey: ['outfitJob', 'active'],
    queryFn: getActiveOutfitJob,
    enabled,
    // 없으면 없는 것 — 재시도해도 달라지지 않는다
    retry: false,
  });

export default useActiveOutfitJob;
