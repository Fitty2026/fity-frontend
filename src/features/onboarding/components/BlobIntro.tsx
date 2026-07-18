import { useEffect, useState } from 'react';

interface BlobIntroProps {
  message: string;
  size: 'sm' | 'md' | 'lg';
}

/** 단계별 목표 크기(px)와, 등장 시 시작 크기(이전 단계 크기) */
const TARGET_PX = { sm: 120, md: 220, lg: 320 } as const;
const START_PX = { sm: 120, md: 120, lg: 220 } as const;

/**
 * 온보딩 단계 인트로의 꿀렁이는 물풍선 블롭.
 * 디자이너 영상(webm/Lottie)으로 교체 시 이 컴포넌트 내부만 바꾸면 된다.
 */
const BlobIntro = ({ message, size }: BlobIntroProps) => {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const px = grown ? TARGET_PX[size] : START_PX[size];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 pb-24">
      <p className="text-base font-medium">{message}</p>
      <div
        className="relative"
        style={{
          width: px,
          height: px,
          transition: 'width 1.2s ease-out, height 1.2s ease-out',
        }}
      >
        {/* 바깥 블롭 - 가장 크게 일렁이는 테두리 */}
        <div
          className="absolute inset-0"
          style={{
            animation: 'blob-wobble 3.8s ease-in-out infinite',
            background:
              'linear-gradient(135deg, rgba(196, 181, 253, 0.55), rgba(221, 214, 254, 0.3) 45%, rgba(167, 139, 250, 0.45))',
            boxShadow: 'inset 0 0 24px rgba(255, 255, 255, 0.7), 0 8px 24px rgba(167, 139, 250, 0.25)',
          }}
        />
        {/* 중간 블롭 - 위상이 어긋난 변형을 겹쳐 테두리가 여러 겹으로 일렁이게 */}
        <div
          className="absolute inset-[5%]"
          style={{
            animation: 'blob-wobble-alt 4.6s ease-in-out infinite',
            background:
              'linear-gradient(315deg, rgba(233, 213, 255, 0.5), rgba(255, 255, 255, 0.35) 55%, rgba(196, 181, 253, 0.4))',
          }}
        />
        {/* 안쪽 블롭 - 반대 방향으로 느리게 꿀렁이는 심 */}
        <div
          className="absolute inset-[16%]"
          style={{
            animation: 'blob-wobble 5.6s ease-in-out infinite reverse',
            background:
              'linear-gradient(45deg, rgba(221, 214, 254, 0.45), rgba(255, 255, 255, 0.5) 60%, rgba(196, 181, 253, 0.35))',
          }}
        />
        {/* 광택 하이라이트 */}
        <div
          className="absolute left-[18%] top-[14%] h-[22%] w-[30%] rounded-full bg-white/70"
          style={{ filter: 'blur(6px)' }}
        />
      </div>
    </div>
  );
};

export default BlobIntro;
