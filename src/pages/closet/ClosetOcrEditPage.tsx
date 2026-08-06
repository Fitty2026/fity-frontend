import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
// 코디 생성 날짜 선택과 동일한 휠 피커를 재사용한다
import { WheelDatePicker } from '@/features/styling/components';
import { SHOPPING_MALLS, toShoppingMallCode } from '@/features/closet/shoppingMalls';
import { COLOR_COLUMNS, COLOR_OPTIONS, colorChipStyle } from '@/features/closet/colors';
import useClosetStore, { emptyOcrResult } from '@/store/closetStore';
import type { OcrResult } from '@/store/closetStore';

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

/**
 * 오늘 이후인지 — 산 적 없는 날짜는 구매일이 될 수 없다.
 * 타이핑 도중처럼 아직 날짜 꼴이 아닌 값은 통과시켜 입력을 막지 않는다.
 */
const isFutureDate = (value: string) => {
  const matched = value.match(/^(\d{4})\.(\d{2})\.(\d{2})\./);
  if (!matched) return false;
  const picked = new Date(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return picked.getTime() > today.getTime();
};

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

/** 캘린더 — 24×24, stroke #6F7881 (실 에셋 미수급, 임시) */
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3.75" y="5.25" width="16.5" height="15" rx="3" stroke="#6F7881" strokeWidth="1.5" />
    <path d="M3.75 9.75H20.25M8.25 3.75V6.75M15.75 3.75V6.75" stroke="#6F7881" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** 드롭다운 화살표 — 24×24, stroke #6F7881 (실 에셋 미수급, 임시) */
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4.5 9L12 16.5L19.5 9" stroke="#6F7881" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

/** 입력 박스 — 327×50, padding 12/8/12/16, radius 8, border #E6E8EA (Figma) */
const InputBox = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={[
      'flex h-[50px] items-center gap-2 rounded-lg border border-[#E6E8EA] bg-white pl-4 pr-2',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

/** 박스 안 텍스트 입력 — Body/B3(16 Medium), placeholder는 라벨과 같은 회색 */
const boxInputClass =
  'min-w-0 flex-1 bg-transparent text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-[#34363C] outline-none placeholder:text-[#B2B8BD]';

/** 수량·사이즈·색상은 Body/B2(16 SemiBold) */
const boxInputBoldClass = boxInputClass.replace('font-medium', 'font-semibold');

/** 구매일만 값 색이 Primary/900 */
const boxInputDateClass = boxInputClass.replace('text-[#34363C]', 'text-[#1F2124]');

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
  bold = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 값 타이포를 Body/B2(SemiBold)로 */
  bold?: boolean;
}) => (
  <Field label={label}>
    <InputBox>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? label}
        className={bold ? boxInputBoldClass : boxInputClass}
      />
      <ClearButton onClear={() => onChange('')} />
    </InputBox>
  </Field>
);

interface ClosetOcrEditPageProps {
  /** edit = 인식된 값 수정 / manual = 인식 실패분 직접 입력 */
  mode?: 'edit' | 'manual';
}

/**
 * OCR 결과 수정 / 직접 입력 — 필드 구성이 같아 한 화면으로 쓴다.
 * ※ 색상 선택·캘린더 화면은 시안 미수급이라 아직 열리지 않는다.
 */
const ClosetOcrEditPage = ({ mode = 'edit' }: ClosetOcrEditPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  // 몇 번째 영수증인지. 직접 입력(:index 없는 경로)은 새 장으로 붙는다
  const { index } = useParams();
  const results = useClosetStore((state) => state.ocrResults);
  const updateOcrResult = useClosetStore((state) => state.updateOcrResult);
  const addOcrResult = useClosetStore((state) => state.addOcrResult);
  const manual = mode === 'manual';
  // 진입 시점의 값을 편집하고, 확인을 눌러야 스토어에 반영한다
  const [values, setValues] = useState<OcrResult>(
    // manual은 인식이 안 된 장이라 스토어 값이 비어 있다 — 빈 값에서 시작
    manual ? emptyOcrResult : (results[Number(index)] ?? emptyOcrResult),
  );

  /**
   * 장을 넘겨도 같은 화면이라 리마운트가 없다 — index가 바뀌면 그 장의 값으로 갈아끼운다.
   * 스토어가 바뀔 때마다 덮어쓰면 입력 중인 값이 튕기므로 index가 실제로 바뀐 경우만 본다.
   */
  const [shownIndex, setShownIndex] = useState(index);
  if (shownIndex !== index) {
    setShownIndex(index);
    const next = results[Number(index)];
    if (!manual && next) setValues(next);
  }

  type FieldKey = Exclude<keyof OcrResult, 'color' | 'failed'>;
  const update = (key: FieldKey, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const pickColor = (option: (typeof COLOR_OPTIONS)[number]) =>
    setValues((prev) => ({ ...prev, color: { label: option.label, hex: option.hex } }));

  // 구매처는 지원 쇼핑몰 3곳 중 하나만 — 원문이 그대로 들어와도 코드로 맞춰 고른 상태를 유지한다
  const storeCode = toShoppingMallCode(values.store);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const purchased = parsePurchasedAt(values.purchasedAt);

  // 미래 날짜를 되돌릴 때 휠을 다시 그리기 위한 값 — 아래 updatePurchasedAt 참고
  const [pickerNonce, setPickerNonce] = useState(0);

  /** 구매일 — 아직 오지 않은 날짜는 받지 않고 원래 값을 그대로 둔다 */
  const updatePurchasedAt = (value: string) => {
    if (isFutureDate(value)) {
      // 휠은 value가 그대로면 스스로 되돌아오지 않는다(스크롤 동기화가 value 변화에만 반응) → 다시 그려 제자리로
      setPickerNonce((nonce) => nonce + 1);
      return;
    }
    update('purchasedAt', value);
  };

  const handlePickDate = (year: number, month: number, day: number) =>
    updatePurchasedAt(formatPurchasedAt(year, month, day, purchased.rest));

  // 필수 항목 — 저장 API(CLOSET-02) 스펙 확정 전 임시 기준
  const canConfirm = Boolean(
    values.brand.trim() && values.name.trim() && values.size.trim() && values.color.label.trim(),
  );

  const handleConfirm = () => {
    if (!canConfirm) return;
    // 인덱스가 있으면 그 장을 덮어쓰고(실패분이면 이때 성공으로 바뀐다), 없으면 새 장으로 붙인다
    const targetIndex = index === undefined ? results.length : Number(index);
    if (index === undefined) addOcrResult(values);
    else updateOcrResult(targetIndex, values);
    // 목록에서 온 직접 입력은 목록으로, 그 외에는 확인 화면으로 (from을 그대로 넘겨 CTA 유지)
    const fromList = (location.state as { from?: string } | null)?.from === 'list';
    if (manual && fromList) {
      navigate('/closet/register/receipt-done');
      return;
    }
    navigate(`/closet/register/ocr-confirm/${targetIndex}`, { state: location.state });
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
            {manual ? '정보를 직접 입력해주세요' : '잘못된 정보를 수정해주세요'}
          </h1>

          {/* 하단 여백 — 마지막 필드(구매일)에서 캘린더를 열어도 잘리지 않게 */}
          <div className="mt-10 px-6 pb-[110px]">
            <div className="flex flex-col gap-4">
              <TextField label="브랜드" value={values.brand} onChange={(v) => update('brand', v)} />
              <TextField label="상품명" value={values.name} onChange={(v) => update('name', v)} />
              <TextField
                label="수량"
                value={values.quantity}
                onChange={(v) => update('quantity', v)}
                bold
              />

              <Field label="옵션">
                {/* 사이즈 111 + 간격 12 + 색상 204 = 327 (Figma). 색상은 남는 폭을 채운다 */}
                <div className="flex gap-3">
                  <div className="w-[111px]">
                    <InputBox>
                      <input
                        value={values.size}
                        onChange={(event) => update('size', event.target.value)}
                        placeholder="사이즈"
                        className={boxInputBoldClass}
                      />
                      <ClearButton onClear={() => update('size', '')} />
                    </InputBox>
                  </div>
                  <div className="relative flex-1">
                    {/* 색상 — 목록에서 고른다. 칩 24 + 간격 10 + 값(B2) */}
                    <button
                      type="button"
                      onClick={() => setColorOpen((open) => !open)}
                      className="w-full cursor-pointer"
                    >
                      <InputBox className="gap-[10px]">
                        <span
                          className="h-6 w-6 shrink-0 rounded-full border-[0.8px] border-[#E6E8EA]"
                          style={colorChipStyle(values.color)}
                        />
                        <span
                          className={[
                            'flex-1 text-left text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
                            values.color.label ? 'text-[#34363C]' : 'text-[#B2B8BD]',
                          ].join(' ')}
                        >
                          {values.color.label || '컬러'}
                        </span>
                        <span className="shrink-0">
                          <ChevronDownIcon />
                        </span>
                      </InputBox>
                    </button>

                    {colorOpen && (
                      <>
                        <button
                          type="button"
                          aria-label="닫기"
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() => setColorOpen(false)}
                        />
                        {/* 드롭다운 228×120 — 76×30 칸을 3열로, radius 8, 그림자 (Figma) */}
                        <div
                          className="absolute right-0 top-[calc(100%+4px)] z-20 grid w-[228px] grid-cols-3 overflow-hidden rounded-lg"
                          style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.24))' }}
                        >
                          {COLOR_OPTIONS.map((option, index) => (
                            <button
                              key={option.code}
                              type="button"
                              onClick={() => {
                                pickColor(option);
                                setColorOpen(false);
                              }}
                              className={[
                                // Body/B6 — 14px SemiBold. 칩 16 + 간격 4 + 이름
                                'flex h-[30px] cursor-pointer items-center justify-center gap-1 border-b border-[#E6E8EA] bg-[#F6F7F8] text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]',
                                // 세로 구분선은 가운데 열의 좌우 테두리로 그린다
                                index % COLOR_COLUMNS === 1 ? 'border-x' : '',
                                values.color.label === option.label ? 'text-[#9D98F0]' : 'text-[#1F2124]',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              <span
                                className="h-4 w-4 shrink-0 rounded-full border-[0.8px] border-[#E6E8EA]"
                                style={colorChipStyle(option)}
                              />
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Field>

              <TextField label="가격" value={values.price} onChange={(v) => update('price', v)} />
              <Field label="구매처">
                <div className="relative">
                  {/* 값·화살표 어디를 눌러도 열리도록 박스 전체를 버튼으로 */}
                  <button
                    type="button"
                    onClick={() => setStoreOpen((open) => !open)}
                    className="w-full cursor-pointer"
                  >
                    <InputBox>
                      <span
                        className={[
                          'flex-1 text-left text-[16px] font-medium leading-[1.6] tracking-[-0.02em]',
                          storeCode ? 'text-[#34363C]' : 'text-[#B2B8BD]',
                        ].join(' ')}
                      >
                        {storeCode || '구매처'}
                      </span>
                      <span className="shrink-0">
                        <ChevronDownIcon />
                      </span>
                    </InputBox>
                  </button>

                  {storeOpen && (
                    <>
                      {/* 바깥 클릭으로 닫기 */}
                      <button
                        type="button"
                        aria-label="닫기"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setStoreOpen(false)}
                      />
                      {/* 드롭다운 120×90 — 항목 30, radius 8, 그림자 (Figma) */}
                      <div
                        className="absolute right-0 top-[calc(100%+4px)] z-20 w-[120px] overflow-hidden rounded-lg"
                        style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.24))' }}
                      >
                        {SHOPPING_MALLS.map((mall, index) => (
                          <button
                            key={mall.code}
                            type="button"
                            onClick={() => {
                              update('store', mall.code);
                              setStoreOpen(false);
                            }}
                            className={[
                              // Body/B6 — 14px SemiBold, 선택된 항목만 Point 색
                              'flex h-[30px] w-full cursor-pointer items-center justify-center bg-[#F6F7F8] px-4 text-[14px] font-semibold leading-[1.6] tracking-[-0.02em]',
                              index < SHOPPING_MALLS.length - 1 ? 'border-b border-[#E6E8EA]' : '',
                              storeCode === mall.code ? 'text-[#9D98F0]' : 'text-[#1F2124]',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {mall.code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Field>

              <Field label="구매일">
                <div className="relative">
                  <InputBox>
                    <input
                      value={values.purchasedAt}
                      onChange={(event) => updatePurchasedAt(event.target.value)}
                      placeholder="구매일"
                      className={boxInputDateClass}
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
                        key={pickerNonce}
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
