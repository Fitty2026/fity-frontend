import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudioHeader, ScreenTitle, DateField, StudioCalendar, WheelDatePicker, BottomCTA } from '@/features/styling/components';
import useStudioBack from '@/features/styling/hooks/useStudioBack';

/** OUTFIT-01 selectedDate 형식 (YYYY-MM-DD) */
const toApiDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/**
 * 날짜 선택 (상황별 추천 플로우)
 * - 헤더(뒤로·스튜디오·건너뛰기) + 안내 + 날짜 필드 + 캘린더 + 다음 CTA
 * - 날짜 필드(본문·보라 화살표 모두) 탭 시 휠 데이트 피커 드롭다운. 화면 이동은 하단 CTA만
 * - CTA 위 안내 문구는 상시 노출 (선택 여부와 무관)
 * ※ 세부 px/타이포/색은 Figma 스펙으로 확정 예정
 */
const StylingDatePage = () => {
  const navigate = useNavigate();
  const goBack = useStudioBack('/styling/method');
  // 화면에 들어온 시점의 오늘로 시작한다 (시안의 고정 날짜는 예시값이었다)
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [pickerOpen, setPickerOpen] = useState(false);

  const prevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handlePick = (y: number, m: number, d: number) => {
    setYear(y);
    setMonth(m);
    setSelectedDay(d);
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-100 flex justify-center" style={{ height: '100dvh' }}>
      <div className="relative w-full max-w-[430px] h-full bg-white flex flex-col">
        <StudioHeader onBack={goBack} onSkip={() => navigate('/styling/mood')} />

        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-14">
          {/* 헤더↔타이틀 56 */}
          <ScreenTitle
            title="코디가 필요한 날을 선택해주세요"
            subtitle="자동으로 날씨를 반영해줘요"
          />

          {/* 날짜 필드 + 휠 피커 드롭다운 (서브타이틀↔날짜필드 48) */}
          <div className="relative mt-12">
            <DateField
              label={`${year}년 ${month}월 ${selectedDay}일`}
              onClick={() => setPickerOpen((v) => !v)}
            />
            {pickerOpen && (
              <>
                {/* 바깥 클릭 시 닫기 */}
                <button
                  type="button"
                  aria-label="닫기"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setPickerOpen(false)}
                />
                {/* Figma: 123×94, top298/left55 → 필드 텍스트 시작(좌 31)·필드 하단 살짝 겹침 */}
                <WheelDatePicker
                  className="absolute left-[31px] top-[calc(100%-3px)] z-20"
                  year={year}
                  month={month}
                  day={selectedDay}
                  onChange={handlePick}
                />
              </>
            )}
          </div>

          <StudioCalendar
            className="mt-6"
            year={year}
            month={month}
            selectedDay={selectedDay}
            todayDay={
              year === new Date().getFullYear() && month === new Date().getMonth() + 1
                ? new Date().getDate()
                : undefined
            }
            onSelectDay={setSelectedDay}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
        </div>

        {/* 안내 문구 (Figma: Frame46 327×20, left24, gap8, 문구 240×20 / CTA 버튼까지 47) */}
        <div className="shrink-0 flex items-center justify-center gap-2 px-6 mb-[35px]">
          <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.99988 5.99995V8.49995M1.79788 10.7506C1.22055 11.7506 1.94255 13 3.09655 13H12.9032C14.0565 13 14.7785 11.7506 14.2019 10.7506L9.29921 2.25195C8.72188 1.25195 7.27788 1.25195 6.70055 2.25195L1.79788 10.7506ZM7.99988 10.5H8.00455V10.5053H7.99988V10.5Z" stroke="#B2B8BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Figma: Typography/Caption — Pretendard 400 / 12px / lh165% / -2% / #959BA7 */}
          <span className="text-[12px] font-normal leading-[1.65] tracking-[-0.02em] text-[#959BA7]">
            날짜를 선택하지 않으면 정확도가 떨어질 수 있습니다
          </span>
        </div>

        <BottomCTA
          label="다음"
          onClick={() => navigate('/styling/weather', {
                state: { year, month, day: selectedDay, selectedDate: toApiDate(year, month, selectedDay) },
              })}
        />
      </div>
    </div>
  );
};

export default StylingDatePage;
