import { useQuery } from '@tanstack/react-query';
import { getWeather } from '../api/weatherApi';

/** 위치 허가 대기 상한 — 초과하면 날씨 없이 진행한다 */
const GEO_TIMEOUT_MS = 8000;

/** 현재 좌표. 미지원·거부·타임아웃이면 null (날씨 없이 진행) */
const getCurrentCoords = () =>
  new Promise<{ lat: number; lon: number } | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: GEO_TIMEOUT_MS, maximumAge: 10 * 60 * 1000 },
    );
  });

/**
 * 선택한 날짜의 날씨 (OpenWeatherMap).
 * 백엔드가 날씨를 조회하지 않으므로 FE가 받아서 OUTFIT-01 weather 필드로 보낸다.
 * 위치 거부·키 없음·예보 범위 밖이면 data가 null → 호출부에서 weather를 생략한다.
 */
const useWeather = (selectedDate?: string) =>
  useQuery({
    queryKey: ['weather', selectedDate],
    enabled: !!selectedDate,
    // 위치 허가 팝업을 다시 띄우지 않도록 실패 시 재시도하지 않는다
    retry: false,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const coords = await getCurrentCoords();
      if (!coords) return null;
      return getWeather(selectedDate as string, coords);
    },
  });

export default useWeather;
