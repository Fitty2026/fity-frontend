export interface BodyMeasurement {
  label: string;
  value: string;
  /** 결과 화면에서 사진 좌/우 어느 쪽에 표시할지 */
  side: 'left' | 'right';
}

export interface BodyTrait {
  label: string;
  value: string;
  /** 진행 바 채움 비율 (0~100) */
  percent: number;
}

export interface BodyAnalysisResult {
  typeName: string;
  typeDescription: string;
  celebrities: string[];
  measurements: BodyMeasurement[];
  traits: BodyTrait[];
}

const MOCK_DELAY_MS = 3000;

/** Figma 시안 기준 고정 mock 결과 */
const MOCK_RESULT: BodyAnalysisResult = {
  typeName: '슬림 스트레이트',
  typeDescription: '전체적으로 균형이 좋고 슬림한 체형이에요',
  celebrities: ['강민경', '크리스탈', '차정원'],
  measurements: [
    { label: '어깨너비', value: '38cm', side: 'left' },
    { label: '가슴둘레', value: '85cm', side: 'left' },
    { label: '허리둘레', value: '67cm', side: 'left' },
    { label: '엉덩이둘레', value: '92cm', side: 'left' },
    { label: '상체길이', value: '61cm', side: 'right' },
    { label: '하체길이', value: '61cm', side: 'right' },
    { label: '다리길이', value: '61cm', side: 'right' },
  ],
  traits: [
    { label: '상체 비율', value: '47%', percent: 47 },
    { label: '하체 비율', value: '53%', percent: 53 },
    { label: '체형 밸런스', value: '균형형', percent: 50 },
    { label: '골격', value: '중간', percent: 50 },
    { label: '근육량', value: '보통', percent: 50 },
  ],
};

/**
 * mock 체형 분석 - 백엔드 연동 시 이 함수 내부만 실제 API 호출로 교체한다.
 * (촬영/업로드한 사진 전송도 그 시점에 함께 처리)
 */
export const analyzeBody = async (): Promise<BodyAnalysisResult> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return MOCK_RESULT;
};
