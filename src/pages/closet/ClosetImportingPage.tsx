import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';

const HANGER_PATH =
  'M187.585 137.751C186.929 136.222 186.174 134.669 185.005 133.603L173.942 123.529L164.496 114.94L156.445 107.64L147.989 99.9986L143.385 95.7814L135.286 88.4278L127.914 81.725L105.174 61.122C105.053 61.083 105.051 60.9404 105.178 60.8645L122.825 44.8535C123.673 44.0832 124.455 43.3198 124.997 42.2138C125.601 40.979 125.982 39.5625 125.98 38.0495C125.963 26.9846 122.038 16.7108 115.249 9.46754C105.169 -1.28921 90.5683 -3.02988 78.9078 5.01584C71.7902 9.92743 66.4733 18.0329 64.2009 27.6722C63.3699 31.1995 62.9193 34.874 63.0391 38.5255C63.1912 43.1497 66.6121 46.3574 70.3069 45.6468C73.3951 45.0536 75.5629 41.9838 75.5952 38.1691C75.6542 31.1926 78.2955 24.5173 82.8479 20.2013C88.391 14.9448 95.9898 13.8871 102.392 17.4374C108.204 20.6612 112.022 26.9524 113.1 34.5291L110.356 37.0286L104.003 42.8162L83.9603 60.9795L43.7931 97.4324L36.877 103.742L29.2745 110.624L24.7563 114.717L11.0288 127.159L4.2458 133.389C2.71692 134.794 1.66154 136.87 0.937036 139.015C-0.335126 142.782 -0.308504 147.02 0.995985 150.742C2.95082 156.316 7.39102 159.947 12.4721 159.959L33.439 160L176.609 159.963C179.527 159.963 182.358 158.567 184.524 156.401C189.046 151.878 190.286 144.06 187.582 137.758L187.585 137.751ZM176.005 144.729H14.9898L12.7288 144.695L28.7668 130.151L39.6857 120.243L50.268 110.64L61.862 100.12L73.1764 89.8581L84.2208 79.8624L94.4913 70.5129L106.855 81.725L135.223 107.446L160.313 130.225L170.631 139.553L176.195 144.573C176.326 144.663 176.227 144.886 176.007 144.729H176.005Z';

/** 옷걸이 189×160, 단색 채움 */
const Hanger = ({ fill }: { fill: string }) => (
  <svg width="189" height="160" viewBox="0 0 189 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={HANGER_PATH} fill={fill} />
  </svg>
);

/** 완료 체크 배지 48×48 — 원 #F6F7F8 + 체크 #1F2124 */
const CheckBadge = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1461_117472)">
      <circle cx="24" cy="24" r="24" fill="#F6F7F8" />
      <path d="M13 25L21.8 33L35 15" stroke="#1F2124" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_1461_117472">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// 채우기 속도 2cm/s = 75.5906px/s (1cm=37.7953px). 높이 160px → 160/75.5906 ≈ 2.1167s
const FILL_DURATION = '2.1167s';
const FILL_MS = 2116.7; // TODO: 백엔드 실제 완료 시점과 연결 (지금은 채우기 시간 후 자동 전환)

/**
 * 구매내역 불러오기 로딩 — 진행 바 + 안내 문구 + 옷걸이(위→아래 보라 채움).
 * 채우기 완료 후 완료 상태(타이틀 변경 + 체크 배지)로 자동 전환.
 */
const ClosetImportingPage = () => {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), FILL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <style>{`@keyframes hangerFill { from { height: 0; } to { height: 160px; } }`}</style>
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} onSkip={() => navigate('/closet')} />

        {/* 안내 문구 — 로딩바 아래 156px */}
        <h1 className="mt-[156px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          {done ? '구매내역을 불러왔어요' : '구매내역을 불러 오는 중이에요'}
        </h1>

        {/* 옷걸이 — 타이틀 아래 72px, 중앙. 회색 위에 보라를 위→아래로 채움 */}
        <div className="relative mt-[72px] mx-auto h-[160px] w-[189px]">
          <Hanger fill="#CED1D5" />
          <div
            className="absolute left-0 top-0 overflow-hidden"
            style={{ width: 189, height: 0, animation: `hangerFill ${FILL_DURATION} linear forwards` }}
          >
            <Hanger fill="#9D98F0" />
          </div>
          {/* 완료 체크 배지 — 옷걸이 박스 내 left 71 / top 92 */}
          {done && (
            <div className="absolute" style={{ left: 71, top: 92 }}>
              <CheckBadge />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetImportingPage;
