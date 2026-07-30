import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudioHeader, ScreenTitle, DateField, StudioCalendar, WheelDatePicker, BottomCTA } from '@/features/styling/components';

/** OUTFIT-01 selectedDate 형식 (YYYY-MM-DD) */
const toApiDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/**
 * 날짜 선택 (상황별 추천 플로우)
 * - 헤더(뒤로·스튜디오·건너뛰기) + 안내 + 날짜 필드 + 캘린더 + 다음 CTA
 * - 날짜 필드 탭 시 휠 데이트 피커 드롭다운
 * ※ 세부 px/타이포/색은 Figma 스펙으로 확정 예정
 */
const StylingDatePage = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const [selectedDay, setSelectedDay] = useState(28);
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
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-white flex flex-col">
        <StudioHeader onBack={() => navigate(-1)} onSkip={() => navigate('/styling/mood')} />

        <div className="flex-1 overflow-y-auto px-6 pt-14">
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
              onNext={() => navigate('/styling/weather', { state: { year, month, day: selectedDay } })}
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
