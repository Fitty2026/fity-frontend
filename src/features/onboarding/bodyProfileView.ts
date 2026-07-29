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

// enum(분석) → 한글. 이미 한글(조회)이거나 미확정 값이면 그대로 통과.
const balanceKo: Record<string, string> = { BALANCED: '균형형' };
const boneKo: Record<string, string> = { SMALL: '가는', MEDIUM: '중간', LARGE: '굵은' };
const muscleKo: Record<string, string> = { LOW: '적음', NORMAL: '보통', HIGH: '많음' };
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
  { label: '골격', value: ko(boneKo, t.boneStructure), percent: 50 },
  { label: '근육량', value: ko(muscleKo, t.muscleMass), percent: 50 },
];

/** 분석/조회 응답을 결과 화면 표시용 형태로 변환 */
export const toBodyResultView = ({ measurements, bodyTypeResult }: BodyAnalyzeResult): BodyResultView => ({
  typeName: bodyTypeResult.bodyTypeName,
  typeDescription: bodyTypeResult.description,
  celebrities: bodyTypeResult.celebrities,
  measurements: toMeasurementViews(measurements),
  traits: toTraitViews(bodyTypeResult),
});
