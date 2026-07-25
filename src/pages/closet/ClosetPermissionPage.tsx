import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { OnboardingTopBar } from '@/features/closet/components';
import useClosetStore from '@/store/closetStore';

/** 플랫폼 로고 카드 — 72×72 검정 라운드 + 흰 이름 (로고 에셋 확정 시 교체) */
const PlatformLogo = ({ name, bg }: { name: string; bg: string }) => (
  <span
    className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl px-1 text-center text-[12px] font-bold leading-[1.3] tracking-[-0.02em] text-white"
    style={{ background: bg }}
  >
    {name}
  </span>
);

// 스택 카드 배경 — 앞→뒤로 갈수록 옅어짐 (1번째 solid, 2번째 80%, 3번째 40%)
const CARD_BG = ['#1F2124', '#000000CC', '#00000066'];

// 앞 카드 기준 누적 오프셋 (Figma 측정: 1→2 +22/-18, 2→3 +19/-13)
const DX = [0, 22, 41]; // 우측 누적
const DY = [0, 18, 31]; // 위 누적

/**
 * 선택 쇼핑몰 로고 스택 — 최대 3장 겹침(앞=완전 노출), 4개 이상은 "+N".
 * 앞 카드(index 0)가 좌하단·최상단, 뒤로 갈수록 우상단으로 오프셋 (Figma 측정).
 */
const PlatformLogoStack = ({ names }: { names: string[] }) => {
  const visible = names.slice(0, 3);
  const extra = names.length - visible.length;
  const last = visible.length - 1;
  const spanY = DY[last];

  // 컨테이너 폭 = 앞 카드(72)만 → justify-center가 앞 카드를 화면 중앙에 둠.
  // 뒤 카드·+N은 absolute로 우상단 오버플로우.
  return (
    <div className="relative" style={{ width: 72, height: 72 + spanY }}>
      {visible.map((name, i) => (
        <div
          key={name}
          className="absolute"
          style={{ left: DX[i], top: spanY - DY[i], zIndex: visible.length - i }}
        >
          <PlatformLogo name={name} bg={CARD_BG[i] ?? CARD_BG[CARD_BG.length - 1]} />
        </div>
      ))}
      {/* +N — 최상단 카드 오른쪽 12px, 세로 중앙 (top-back 카드 top=0, (72-26)/2=23) */}
      {extra > 0 && (
        <span
          className="absolute whitespace-nowrap text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#6F7881]"
          style={{ left: DX[last] + 72 + 12, top: 23 }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
};

/** 상세보기 화살표 — 9×17, #959BA7 */
const Chevron = () => (
  <svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.75 0.75L8.25 8.25L0.75 15.75" stroke="#959BA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 필수 동의 항목 행 */
const RequiredRow = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <button type="button" onClick={onToggle} className="flex w-full items-center gap-[16px] text-left cursor-pointer">
    <Checkbox checked={checked} />
    <span className="flex items-baseline gap-[4px] whitespace-nowrap text-[14px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
      <span>(필수)</span>
      <span>{label}</span>
    </span>
    <span className="ml-auto shrink-0">
      <Chevron />
    </span>
  </button>
);

/** 체크박스 — 24×24. 미체크: 원 outline #CED1D5 / 체크: 임시(필드 스펙 대기) */
const Checkbox = ({ checked }: { checked: boolean }) =>
  checked ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.2806 9.21937C16.3504 9.28903 16.4057 9.37175 16.4434 9.46279C16.4812 9.55384 16.5006 9.65144 16.5006 9.75C16.5006 9.84856 16.4812 9.94616 16.4434 10.0372C16.4057 10.1283 16.3504 10.211 16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1218 15.6557 10.039 15.6004 9.96938 15.5306L7.71938 13.2806C7.57865 13.1399 7.49959 12.949 7.49959 12.75C7.49959 12.551 7.57865 12.3601 7.71938 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44903 11.9996 8.6399 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.289 9.14964 15.3718 9.09432 15.4628 9.05658C15.5538 9.01884 15.6514 8.99941 15.75 8.99941C15.8486 8.99941 15.9462 9.01884 16.0372 9.05658C16.1283 9.09432 16.211 9.14964 16.2806 9.21937ZM21.75 12C21.75 13.9284 21.1782 15.8134 20.1068 17.4168C19.0355 19.0202 17.5127 20.2699 15.7312 21.0078C13.9496 21.7458 11.9892 21.9389 10.0979 21.5627C8.20656 21.1865 6.46928 20.2579 5.10571 18.8943C3.74215 17.5307 2.81355 15.7934 2.43735 13.9021C2.06114 12.0108 2.25422 10.0504 2.99218 8.26884C3.73013 6.48726 4.97982 4.96451 6.58319 3.89317C8.18657 2.82183 10.0716 2.25 12 2.25C14.585 2.25273 17.0634 3.28084 18.8913 5.10872C20.7192 6.93661 21.7473 9.41498 21.75 12ZM20.25 12C20.25 10.3683 19.7661 8.77325 18.8596 7.41655C17.9531 6.05984 16.6646 5.00242 15.1571 4.37799C13.6497 3.75357 11.9909 3.59019 10.3905 3.90852C8.79017 4.22685 7.32016 5.01259 6.16637 6.16637C5.01259 7.32015 4.22685 8.79016 3.90853 10.3905C3.5902 11.9908 3.75358 13.6496 4.378 15.1571C5.00242 16.6646 6.05984 17.9531 7.41655 18.8596C8.77326 19.7661 10.3683 20.25 12 20.25C14.1873 20.2475 16.2843 19.3775 17.8309 17.8309C19.3775 16.2843 20.2475 14.1873 20.25 12Z" fill="#1F2124" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM12 20.25C10.3683 20.25 8.77326 19.7661 7.41655 18.8596C6.05984 17.9531 5.00242 16.6646 4.378 15.1571C3.75358 13.6496 3.5902 11.9908 3.90853 10.3905C4.22685 8.79016 5.01259 7.32015 6.16637 6.16637C7.32016 5.01259 8.79017 4.22685 10.3905 3.90852C11.9909 3.59019 13.6497 3.75357 15.1571 4.37799C16.6646 5.00242 17.9531 6.05984 18.8596 7.41655C19.7661 8.77325 20.25 10.3683 20.25 12C20.2475 14.1873 19.3775 16.2843 17.8309 17.8309C16.2843 19.3775 14.1873 20.2475 12 20.25Z" fill="#CED1D5" />
    </svg>
  );

/**
 * 구매내역 권한 동의 — 선택 쇼핑몰 로고 + 안내 + 약관 동의(전체/필수 2항목) + 계속하기.
 */
const ClosetPermissionPage = () => {
  const navigate = useNavigate();
  const storedPlatforms = useClosetStore((state) => state.selectedPlatforms);
  // 새로고침·직접 진입으로 선택값이 없으면 레이아웃 유지를 위해 기본 노출
  const selectedPlatforms = storedPlatforms.length > 0 ? storedPlatforms : ['MUSINSA'];
  const [purchase, setPurchase] = useState(false);
  const [data, setData] = useState(false);
  const allChecked = purchase && data;

  const toggleAll = () => {
    const next = !allChecked;
    setPurchase(next);
    setData(next);
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showSkip onSkip={() => navigate('/closet')} />

        <div className="flex-1 overflow-y-auto px-6">
          {/* 선택 쇼핑몰 로고 — 스택(최대 3장 겹침, 4개 이상 +N) */}
          <div className="mt-[52px] flex justify-center">
            <PlatformLogoStack names={selectedPlatforms} />
          </div>

          {/* 안내 */}
          <h1 className="mt-8 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
            선택한 쇼핑몰의
            <br />
            구매 내역을 불러오기 위해
            <br />
            아래 권한이 필요해요
          </h1>

          {/* 약관 전체 동의 (Figma: bg #F6F7F8, radius8, padding10/12, 타이틀→64px) */}
          <button
            type="button"
            onClick={toggleAll}
            className="mt-16 flex h-[46px] w-full items-center gap-[16px] rounded-lg bg-[#F6F7F8] py-[10px] pl-[12px] pr-[12px] text-left cursor-pointer"
          >
            <Checkbox checked={allChecked} />
            <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">
              약관 전체 동의
            </span>
          </button>

          {/* 필수 항목 (Figma: bg #F6F7F8, radius8, border-top1, padding 24/24/10, gap8) */}
          <div className="mt-[12px] flex flex-col gap-[8px] rounded-lg border-t border-[#E6E8EA] bg-[#F6F7F8] pt-[24px] pb-[24px] pl-[10px] pr-[12px]">
            <RequiredRow label="구매 내역 조회" checked={purchase} onToggle={() => setPurchase((v) => !v)} />
            <RequiredRow label="안전한 데이터 처리" checked={data} onToggle={() => setData((v) => !v)} />
          </div>
        </div>

        {/* 동의하고 계속하기 — 필수 전부 동의 시 활성 */}
        <div className="w-full px-6 pt-3 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
          <button
            type="button"
            disabled={!allChecked}
            onClick={allChecked ? () => navigate('/closet/register/importing') : undefined}
            className={[
              'w-full h-[58px] rounded-[32px] text-center text-[16px] font-semibold leading-[1.6] tracking-[-0.02em]',
              allChecked ? 'text-[#F6F7F8] cursor-pointer' : 'text-[#959BA7] cursor-not-allowed',
            ].join(' ')}
            style={{ backgroundColor: allChecked ? '#1F2124' : '#E6E8EA' }}
          >
            동의하고 계속하기
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetPermissionPage;
