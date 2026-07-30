import type { BodyAnalyzeResult, BodyMeasurements, BodyTypeResult } from './api/bodyProfileApi';

export interface BodyMeasurementView {
  label: string;
  value: string;
  /** 결과 화면에서 사진 좌/우 어느 쪽에 표시할지 */
  side: 'left' | 'right';
}

export interface BodyTraitView {
  label: string;
  value: string;
  /** 진행 바 채움 비율 (0~100) */
  percent: number;
}

export interface BodyResultView {
  typeName: string;
  typeDescription: string;
  celebrities: string[];
  measurements: BodyMeasurementView[];
  traits: BodyTraitView[];
}

// 서버 enum → 화면 표시용 한글 (온보딩 체형 특징 표 기준). 미매핑 값은 그대로 통과.
const balanceKo: Record<string, string> = {
  UPPER_BODY_DEVELOPED: '상체 발달형',
  BALANCED: '균형형',
  LOWER_BODY_DEVELOPED: '하체 발달형',
};
const shoulderKo: Record<string, string> = { NARROW: '좁음', AVERAGE: '보통', WIDE: '넓음' };
const frameKo: Record<string, string> = { SMALL: '작음', MEDIUM: '보통', LARGE: '큼' };
const ko = (map: Record<string, string>, value: string) => map[value] ?? value;

const toMeasurementViews = (m: BodyMeasurements): BodyMeasurementView[] => [
  { label: '어깨너비', value: `${m.shoulderWidth}cm`, side: 'left' },
  { label: '가슴둘레', value: `${m.chestCircumference}cm`, side: 'left' },
  { label: '허리둘레', value: `${m.waistCircumference}cm`, side: 'left' },
  { label: '엉덩이둘레', value: `${m.hipCircumference}cm`, side: 'left' },
  { label: '상체길이', value: `${m.upperBodyLength}cm`, side: 'right' },
  { label: '하체길이', value: `${m.lowerBodyLength}cm`, side: 'right' },
  { label: '다리길이', value: `${m.legLength}cm`, side: 'right' },
];

const toTraitViews = (t: BodyTypeResult): BodyTraitView[] => [
  { label: '상체 비율', value: `${t.upperBodyRatio}%`, percent: t.upperBodyRatio },
  { label: '하체 비율', value: `${t.lowerBodyRatio}%`, percent: t.lowerBodyRatio },
  { label: '체형 밸런스', value: ko(balanceKo, t.bodyBalance), percent: 50 },
  { label: '어깨너비', value: ko(shoulderKo, t.shoulderWidth), percent: 50 },
  { label: '체격', value: ko(frameKo, t.frameSize), percent: 50 },
];

/** 분석/조회 응답을 결과 화면 표시용 형태로 변환 */
export const toBodyResultView = ({ measurements, bodyTypeResult }: BodyAnalyzeResult): BodyResultView => ({
  typeName: bodyTypeResult.bodyTypeName,
  typeDescription: bodyTypeResult.description,
  celebrities: bodyTypeResult.celebrities,
  measurements: toMeasurementViews(measurements),
  traits: toTraitViews(bodyTypeResult),
});
