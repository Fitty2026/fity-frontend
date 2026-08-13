import axios from 'axios';
import type { WeatherCondition } from '../types';

// ── 날씨 조회 (OpenWeatherMap) ──
// 백엔드는 날씨를 조회하지 않는다. FE가 화면에 표시한 날씨를 그대로 OUTFIT-01 weather 필드로 보낸다.
// 사내 API가 아니라 공용 axios 인스턴스(baseURL·토큰 인터셉터)를 타지 않도록 별도 클라이언트를 쓴다.
const owm = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 8000,
});

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/** 무료 플랜 예보 범위 — 5일 / 3시간 간격 */
const FORECAST_DAYS = 5;

/** 화면 날씨 종류 (배경·문구·아이콘 키) */
export type WeatherType = 'rain' | 'snow' | 'sun' | 'wind' | 'cloud';

export interface WeatherResult {
  type: WeatherType;
  condition: WeatherCondition;
  /** 섭씨, 정수 */
  temperature: number;
}

/**
 * OpenWeatherMap `weather[0].main` → 화면 종류 + API condition.
 * WINDY는 2026-08-13 확정 — 바람 계열(Squall·Tornado)이 제 값으로 간다.
 */
const MAIN_MAP: Record<string, { type: WeatherType; condition: WeatherCondition }> = {
  Clear: { type: 'sun', condition: 'SUNNY' },
  Clouds: { type: 'cloud', condition: 'CLOUDY' },
  Rain: { type: 'rain', condition: 'RAINY' },
  Drizzle: { type: 'rain', condition: 'RAINY' },
  Thunderstorm: { type: 'rain', condition: 'RAINY' },
  Snow: { type: 'snow', condition: 'SNOWY' },
  Squall: { type: 'wind', condition: 'WINDY' },
  Tornado: { type: 'wind', condition: 'WINDY' },
};

/** 안개·미세먼지 등(Mist/Fog/Haze/Dust/Sand/Smoke/Ash)은 흐림 화면 + UNKNOWN */
const FALLBACK = { type: 'cloud' as WeatherType, condition: 'UNKNOWN' as WeatherCondition };

const toResult = (main: string, temp: number): WeatherResult => {
  const mapped = MAIN_MAP[main] ?? FALLBACK;
  return { ...mapped, temperature: Math.round(temp) };
};

interface OwmCurrent {
  weather: { main: string }[];
  main: { temp: number };
}

interface OwmForecast {
  list: { dt_txt: string; weather: { main: string }[]; main: { temp: number } }[];
}

/** 로컬 기준 YYYY-MM-DD (Date.toISOString은 UTC로 밀려서 쓰지 않는다) */
const toLocalDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** 오늘부터 며칠 뒤인지 (음수 = 과거) */
const daysFromToday = (selectedDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = selectedDate.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};

/**
 * 선택한 날짜의 날씨. 조회할 수 없으면 null (호출부에서 weather 필드를 생략한다).
 * - 오늘: 현재 날씨
 * - 1~5일 뒤: 3시간 예보 중 해당 날짜 정오에 가장 가까운 값
 * - 과거 / 5일 초과 / 키 없음 / 위치 없음: null
 */
export const getWeather = async (
  selectedDate: string,
  coords: { lat: number; lon: number },
): Promise<WeatherResult | null> => {
  if (!API_KEY) return null;

  const offset = daysFromToday(selectedDate);
  if (offset < 0 || offset > FORECAST_DAYS) return null;

  const params = { lat: coords.lat, lon: coords.lon, units: 'metric', appid: API_KEY };

  if (offset === 0) {
    const { data } = await owm.get<OwmCurrent>('/weather', { params });
    return toResult(data.weather[0]?.main ?? '', data.main.temp);
  }

  const { data } = await owm.get<OwmForecast>('/forecast', { params });
  // dt_txt는 UTC 기준 문자열이라, 로컬 날짜로 변환해 비교한 뒤 정오에 가장 가까운 항목을 고른다
  const sameDay = data.list.filter((it) => toLocalDate(new Date(it.dt_txt.replace(' ', 'T') + 'Z')) === selectedDate);
  if (!sameDay.length) return null;

  const noon = sameDay.reduce((best, it) => {
    const hour = (t: string) => new Date(t.replace(' ', 'T') + 'Z').getHours();
    return Math.abs(hour(it.dt_txt) - 12) < Math.abs(hour(best.dt_txt) - 12) ? it : best;
  });

  return toResult(noon.weather[0]?.main ?? '', noon.main.temp);
};
