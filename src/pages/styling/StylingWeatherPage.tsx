import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudioHeader } from '@/features/styling/components';
import rainBg from '@/assets/images/styling/weather-rain.png';

interface WeatherLocationState {
  year?: number;
  month?: number;
  day?: number;
}

/**
 * 날짜 기준_일정 (날씨 안내)
 * - 전면 비 사진 배경 + 헤더(뒤로·스튜디오) + 날씨 문구
 * - 날짜 선택에서 넘어온 선택 날짜(router state)를 문구에 표시
 * - 화면 탭하면 상황 선택으로 이동
 * ※ 문구 타이포/우산 아이콘은 Figma 스펙으로 확정 예정
 */
const StylingWeatherPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: WeatherLocationState | null };
  const { year = 2026, month = 6, day = 28 } = state ?? {};

  // 1초 후 상황 선택으로 자동 이동 (탭하면 즉시 이동)
  useEffect(() => {
    const timer = setTimeout(() => navigate('/styling/mood'), 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div
        className="relative w-full max-w-[430px] min-h-screen flex flex-col overflow-hidden"
        onClick={() => navigate('/styling/mood')}
      >
        {/* 전면 비 배경 */}
        <img
          src={rainBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative">
          <StudioHeader onBack={() => navigate(-1)} />

          {/* 문구 — Figma: 375×60, 헤더↔문구 56, Pretendard 600 / 20px / lh150% / -2% / #1F2124 */}
          <p className="mt-14 px-6 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            {year}년 {month}월 {day}일에
            <br />
            <span className="inline-flex items-center gap-1">
              비가 오네요
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M30.0001 15.8289C29.7718 13.2113 28.8143 10.7101 27.2363 8.60917C25.6583 6.50824 23.5229 4.89172 21.0726 3.94309C18.6223 2.99445 15.9551 2.75169 13.3737 3.24234C10.7924 3.733 8.40027 4.93743 6.46887 6.71893C3.89044 9.08769 2.29745 12.3397 2.00637 15.8289C1.98264 16.1051 2.01656 16.3832 2.10599 16.6455C2.19543 16.9078 2.33841 17.1487 2.52588 17.3529C2.71334 17.5571 2.9412 17.72 3.19499 17.8314C3.44877 17.9429 3.72295 18.0003 4.00012 18.0002H15.0001V25.0002C15.0001 26.061 15.4215 27.0785 16.1717 27.8286C16.9218 28.5788 17.9393 29.0002 19.0001 29.0002C20.061 29.0002 21.0784 28.5788 21.8285 27.8286C22.5787 27.0785 23.0001 26.061 23.0001 25.0002C23.0001 24.735 22.8948 24.4806 22.7072 24.2931C22.5197 24.1055 22.2653 24.0002 22.0001 24.0002C21.7349 24.0002 21.4805 24.1055 21.293 24.2931C21.1055 24.4806 21.0001 24.735 21.0001 25.0002C21.0001 25.5306 20.7894 26.0393 20.4143 26.4144C20.0393 26.7895 19.5306 27.0002 19.0001 27.0002C18.4697 27.0002 17.961 26.7895 17.5859 26.4144C17.2108 26.0393 17.0001 25.5306 17.0001 25.0002V18.0002H28.0001C28.2778 18.0012 28.5527 17.9444 28.8072 17.8333C29.0617 17.7223 29.2904 17.5595 29.4785 17.3552C29.6666 17.151 29.8102 16.9098 29.9 16.647C29.9898 16.3842 30.0239 16.1056 30.0001 15.8289ZM4.00012 16.0002C4.22175 13.4242 5.26819 10.9883 6.98409 9.05418C8.69998 7.12008 10.9938 5.79088 13.5251 5.26393C12.0601 7.25018 10.2314 10.7639 10.0214 16.0002H4.00012ZM12.0189 16.0002C12.1926 12.1539 13.3351 9.39893 14.3064 7.72018C14.7853 6.88625 15.3532 6.10669 16.0001 5.39518C16.6459 6.1068 17.2125 6.88636 17.6901 7.72018C19.3501 10.5877 19.8751 13.6602 19.9776 16.0002H12.0189ZM21.9751 16.0002C21.7651 10.7639 19.9364 7.25018 18.4751 5.25768C21.0081 5.78346 23.3035 7.11313 25.0198 9.04877C26.736 10.9844 27.7813 13.4225 28.0001 16.0002H21.9751Z" fill="black" />
              </svg>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StylingWeatherPage;
