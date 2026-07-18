import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudioHeader, ScreenTitle, DateField, StudioCalendar, BottomCTA } from '@/features/styling/components';

/**
 * 날짜 선택 (상황별 추천 플로우)
 * - 헤더(뒤로·스튜디오·건너뛰기) + 안내 + 날짜 필드 + 캘린더 + 다음 CTA
 * ※ 세부 px/타이포/색은 Figma 스펙으로 확정 예정 (스캐폴드)
 */
const StylingDatePage = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const [selectedDay, setSelectedDay] = useState(28);

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

          {/* 서브타이틀↔날짜필드 48 */}
          <DateField
            className="mt-12"
            label={`${year}년 ${month}월 ${selectedDay}일`}
            onNext={() => navigate('/styling/mood')}
          />

          <StudioCalendar
            className="mt-6"
            year={year}
            month={month}
            selectedDay={selectedDay}
            todayDay={19}
            onSelectDay={setSelectedDay}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
        </div>

        <BottomCTA label="다음" onClick={() => navigate('/styling/mood')} />
      </div>
    </div>
  );
};

export default StylingDatePage;
