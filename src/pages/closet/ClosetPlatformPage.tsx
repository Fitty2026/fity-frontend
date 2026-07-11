import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { SelectableListRow, BottomCTA } from '@/features/closet/components';
import musinsaLogo from '@/assets/images/platform/musinsa.jpg';
import ablyLogo from '@/assets/images/platform/ably.jpg';
import zigzagLogo from '@/assets/images/platform/zigzag.jpg';
import wconceptLogo from '@/assets/images/platform/wconcept.jpg';
import cm29Logo from '@/assets/images/platform/29cm.jpg';
import kreamLogo from '@/assets/images/platform/kream.jpg';

/** 뒤로가기 아이콘 — Figma 에셋 */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="black" />
  </svg>
);

/**
 * 연동 가능한 쇼핑몰 목록 (와이어프레임용)
 * - logo 있으면 이미지, 없으면 이니셜(mark) 표시. 실제 연동 시 데이터로 대체 예정
 */
const PLATFORMS: { id: string; label: string; mark: string; logo?: string }[] = [
  { id: 'musinsa', label: 'MUSINSA', mark: 'M', logo: musinsaLogo },
  { id: 'ably', label: 'ABLY', mark: 'A', logo: ablyLogo },
  { id: 'zigzag', label: 'ZIGZAG', mark: 'Z', logo: zigzagLogo },
  { id: 'wconcept', label: 'W-CONCEPT', mark: 'W', logo: wconceptLogo },
  { id: '29cm', label: '29CM', mark: '29', logo: cm29Logo },
  { id: 'kream', label: 'KREAM', mark: 'K', logo: kreamLogo },
];

/**
 * 쇼핑몰 선택 (Platform Selection, DAT-02)
 * - 복수 선택 가능. 기본값: MUSINSA 선택
 */
const ClosetPlatformPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set(['musinsa']));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNext = () => {
    // TODO: 권한 안내(Permission) 화면 라우트 추가 예정
    navigate('/closet/register/permission');
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col h-[100dvh] min-h-0 bg-[#F9F9F9]">
        {/* 헤더 (Figma: 높이 64) — 고정 */}
        <header className="flex items-center h-16 px-4 bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <BackIcon />
          </button>
        </header>

        {/* 스크롤 영역 (이 층만 스크롤) — Figma Main: padding T24 R20 B48 L20, gap 24 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col gap-6 pt-6 px-5 pb-12">
            {/* 타이틀 영역 */}
            <div>
              <h1 className="text-2xl font-medium leading-8 tracking-[-0.24px] text-[#1A1C1C]">
                연동할 쇼핑몰을 선택해주세요
              </h1>
              <p className="mt-2 text-sm font-medium leading-5 text-[#5E5E5E]">
                사용 중인 쇼핑몰을 선택하면 구매 내역을 불러올 수 있어요
              </p>
              <p className="mt-1 text-xs font-medium leading-4 text-[#A3A3A3]">복수 선택 가능</p>
            </div>

            {/* 쇼핑몰 리스트 (카드 간 gap 16) */}
            <div className="flex flex-col gap-4">
              {PLATFORMS.map((p) => (
                <SelectableListRow
                  key={p.id}
                  label={p.label}
                  leading={
                    p.logo ? (
                      <img src={p.logo} alt={p.label} className="w-full h-full object-cover" />
                    ) : (
                      p.mark
                    )
                  }
                  selected={selected.has(p.id)}
                  onToggle={() => toggle(p.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Figma: Fixed Bottom Button Section (390×97) */}
        <BottomCTA className="shrink-0">
          <button
            type="button"
            onClick={handleNext}
            disabled={selected.size === 0}
            className="w-full h-14 rounded-lg bg-black! text-white text-base font-medium leading-6 disabled:opacity-40"
          >
            다음
          </button>
        </BottomCTA>
      </div>
    </PageLayout>
  );
};

export default ClosetPlatformPage;
