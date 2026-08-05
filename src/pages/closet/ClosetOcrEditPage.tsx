import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
// 코디 생성 날짜 선택과 동일한 휠 피커를 재사용한다
import { WheelDatePicker } from '@/features/styling/components';
import useClosetStore from '@/store/closetStore';

/** '2026.06.28. 13:45:55' → 연/월/일 + 뒤에 붙는 시각 */
const parsePurchasedAt = (value: string) => {
  const matched = value.match(/^(\d{4})\.(\d{2})\.(\d{2})\.(.*)$/);
  if (!matched) return { year: 2026, month: 1, day: 1, rest: '' };
  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
    rest: matched[4],
  };
};

/** 연/월/일 + 시각 → '2026.06.28. 13:45:55' */
const formatPurchasedAt = (year: number, month: number, day: number, rest: string) =>
  `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}.${rest}`;

/** 입력 지우기 — 24×24 */
const ClearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M11.9526 20.4736C10.785 20.4736 9.68929 20.2523 8.66553 19.8096C7.64176 19.3724 6.74251 18.7664 5.96777 17.9917C5.19303 17.2114 4.58431 16.3122 4.1416 15.2939C3.70443 14.2702 3.48584 13.1745 3.48584 12.0068C3.48584 10.8392 3.70443 9.74349 4.1416 8.71973C4.58431 7.69596 5.19303 6.79671 5.96777 6.02197C6.74251 5.24723 7.64176 4.64128 8.66553 4.2041C9.68929 3.76139 10.785 3.54004 11.9526 3.54004C13.1203 3.54004 14.216 3.76139 15.2397 4.2041C16.2635 4.64128 17.1628 5.24723 17.9375 6.02197C18.7122 6.79671 19.3182 7.69596 19.7554 8.71973C20.1981 9.74349 20.4194 10.8392 20.4194 12.0068C20.4194 13.1745 20.1981 14.2702 19.7554 15.2939C19.3182 16.3122 18.7122 17.2114 17.9375 17.9917C17.1628 18.7664 16.2635 19.3724 15.2397 19.8096C14.216 20.2523 13.1203 20.4736 11.9526 20.4736ZM9.16357 15.4932C9.36279 15.4932 9.53158 15.4268 9.66992 15.2939L11.9609 12.9863L14.2603 15.2939C14.3875 15.4268 14.5508 15.4932 14.75 15.4932C14.9437 15.4932 15.1069 15.4268 15.2397 15.2939C15.3726 15.1556 15.439 14.9924 15.439 14.8042C15.439 14.5994 15.3726 14.4362 15.2397 14.3145L12.9321 12.0151L15.248 9.70752C15.3809 9.56917 15.4473 9.40592 15.4473 9.21777C15.4473 9.02962 15.3809 8.86914 15.248 8.73633C15.1152 8.60352 14.9548 8.53711 14.7666 8.53711C14.584 8.53711 14.4263 8.60352 14.2935 8.73633L11.9609 11.0522L9.64502 8.74463C9.50667 8.61735 9.34619 8.55371 9.16357 8.55371C8.97542 8.55371 8.81494 8.62012 8.68213 8.75293C8.54932 8.88021 8.48291 9.04069 8.48291 9.23438C8.48291 9.41699 8.54932 9.57747 8.68213 9.71582L10.9897 12.0151L8.68213 14.3228C8.54932 14.4556 8.48291 14.616 8.48291 14.8042C8.48291 14.9924 8.54932 15.1556 8.68213 15.2939C8.81494 15.4268 8.97542 15.4932 9.16357 15.4932Z"
      fill="#3C3C43"
      fillOpacity="0.6"
    />
  </svg>
);

/** 캘린더 — 24×24 (실 에셋 미수급, 임시) */
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3.75" y="5.25" width="16.5" height="15" rx="3" stroke="#34363C" strokeWidth="1.5" />
    <path d="M3.75 9.75H20.25M8.25 3.75V6.75M15.75 3.75V6.75" stroke="#34363C" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** 필드 한 칸 — 라벨(327×26) + 입력 박스, 안쪽 간격 4 */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#B2B8BD]">
      {label}
    </span>
    {children}
  </div>
);

/** 입력 박스 — 327×50, padding 12/16, radius 8, border #E6E8EA */
const InputBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[50px] items-center gap-2 rounded-lg border border-[#E6E8EA] bg-white px-4">
    {children}
  </div>
);

/** 박스 안 텍스트 입력 — Body/B3, placeholder는 라벨과 같은 회색 */
const boxInputClass =
  'min-w-0 flex-1 bg-transparent text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] outline-none placeholder:text-[#B2B8BD]';

/** 값 지우기 버튼 */
const ClearButton = ({ onClear }: { onClear: () => void }) => (
  <button type="button" onClick={onClear} aria-label="지우기" className="shrink-0 cursor-pointer">
    <ClearIcon />
  </button>
);

/**
 * 텍스트 입력 + 지우기.
 * ※ 컴포넌트 정의를 페이지 밖에 두어야 입력 중 재마운트로 포커스가 풀리지 않는다.
 */
const TextField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <Field label={label}>
    <InputBox>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? label}
        className={boxInputClass}
      />
      <ClearButton onClear={() => onChange('')} />
    </InputBox>
  </Field>
);

/**
 * OCR 결과 수정 — 인식된 값을 직접 고친다.
 * ※ 색상 선택·캘린더 화면은 시안 미수급이라 아직 열리지 않는다.
 */
const ClosetOcrEditPage = () => {
  const navigate = useNavigate();
  const ocrResult = useClosetStore((state) => state.ocrResult);
  const setOcrResult = useClosetStore((state) => state.setOcrResult);
  // 진입 시점의 값을 편집하고, 확인을 눌러야 스토어에 반영한다
  const [values, setValues] = useState(ocrResult);

  type FieldKey = Exclude<keyof typeof values, 'color'>;
  const update = (key: FieldKey, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const [pickerOpen, setPickerOpen] = useState(false);
  const purchased = parsePurchasedAt(values.purchasedAt);

  const handlePickDate = (year: number, month: number, day: number) =>
    update('purchasedAt', formatPurchasedAt(year, month, day, purchased.rest));

  // 필수 항목 — 저장 API(CLOSET-02) 스펙 확정 전 임시 기준
  const canConfirm = Boolean(
    values.brand.trim() && values.name.trim() && values.size.trim() && values.color.label.trim(),
  );

  const handleConfirm = () => {
    if (!canConfirm) return;
    setOcrResult(values);
    navigate('/closet/register/ocr-confirm');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      {/* 높이를 고정해야 안쪽 flex-1 스크롤 영역이 기준을 잡는다 (#app-container는 min-h-screen) */}
      <div className="flex flex-col h-[100dvh] min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* 타이틀 — 375×30 (Title/T3) */}
          <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            잘못된 정보를 수정해주세요
          </h1>

          {/* 하단 여백 — 마지막 필드(구매일)에서 캘린더를 열어도 잘리지 않게 */}
          <div className="mt-10 px-6 pb-[110px]">
            <div className="flex flex-col gap-4">
              <TextField label="브랜드" value={values.brand} onChange={(v) => update('brand', v)} />
              <TextField label="상품명" value={values.name} onChange={(v) => update('name', v)} />
              <TextField label="수량" value={values.quantity} onChange={(v) => update('quantity', v)} />

              <Field label="옵션">
                {/* 사이즈 + 색상, 사이 간격 13 */}
                <div className="flex gap-[13px]">
                  <div className="w-[92px]">
                    <InputBox>
                      <input
                        value={values.size}
                        onChange={(event) => update('size', event.target.value)}
                        placeholder="사이즈"
                        className={boxInputClass}
                      />
                      <ClearButton onClear={() => update('size', '')} />
                    </InputBox>
                  </div>
                  <div className="flex-1">
                    {/* 색상 — 누르면 선택 UI (시안 미수급) */}
                    <InputBox>
                      {/* 값이 없으면 회색 점 + '컬러' placeholder */}
                      <span
                        className="h-6 w-6 shrink-0 rounded-full"
                        style={{ backgroundColor: values.color.label ? values.color.hex : '#E6E8EA' }}
                      />
                      <span
                        className={[
                          'mr-auto ml-[5px] text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
                          values.color.label ? 'text-[#34363C]' : 'text-[#B2B8BD]',
                        ].join(' ')}
                      >
                        {values.color.label || '컬러'}
                      </span>
                      <span className="shrink-0">
                        <ClearIcon />
                      </span>
                    </InputBox>
                  </div>
                </div>
              </Field>

              <TextField label="가격" value={values.price} onChange={(v) => update('price', v)} />
              <TextField label="구매처" value={values.store} onChange={(v) => update('store', v)} />

              <Field label="구매일">
                <div className="relative">
                  <InputBox>
                    <input
                      value={values.purchasedAt}
                      onChange={(event) => update('purchasedAt', event.target.value)}
                      placeholder="구매일"
                      className={boxInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setPickerOpen((open) => !open)}
                      aria-label="날짜 선택"
                      className="shrink-0 cursor-pointer"
                    >
                      <CalendarIcon />
                    </button>
                  </InputBox>

                  {pickerOpen && (
                    <>
                      {/* 바깥 클릭으로 닫기 */}
                      <button
                        type="button"
                        aria-label="닫기"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setPickerOpen(false)}
                      />
                      {/* Figma: 입력 박스 아래, 좌측 정렬 */}
                      <WheelDatePicker
                        className="absolute left-0 top-[calc(100%-3px)] z-20"
                        year={purchased.year}
                        month={purchased.month}
                        day={purchased.day}
                        onChange={handlePickDate}
                      />
                    </>
                  )}
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼 — 327×58 */}
        <div className="px-6 pt-4 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          {/* 필수 항목이 다 차야 활성 — 비활성 스타일은 다른 등록 화면과 동일 */}
          <button
            type="button"
            disabled={!canConfirm}
            onClick={handleConfirm}
            className={[
              'h-[58px] w-full rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
              canConfirm
                ? 'cursor-pointer bg-[#1F2124] text-[#F6F7F8]'
                : 'cursor-not-allowed bg-[#E6E8EA] text-[#959BA7]',
            ].join(' ')}
          >
            확인
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetOcrEditPage;
