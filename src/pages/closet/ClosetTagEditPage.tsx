import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { CtaButton, OnboardingTopBar } from '@/features/closet/components';
import OcrItemRow from '@/features/closet/components/OcrItemRow';
import { itemsForPhotos, type ChipKind, type OcrItem } from '@/features/closet/ocrItems';

/**
 * 태그 수정 — 칩(카테고리/세부/브랜드/해시태그)을 눌러 선택(회색)하고 X로 삭제한다.
 * 확인 → 옷 추가 완료.
 * ※ 태그 생성 API 대기 중이라 고친 값은 아직 서버로 보내지 않는다.
 * ※ 확인 버튼 활성 조건(선택/변경)은 디자이너 확인 대기 — 현재는 선택하거나 지우면 활성
 */
const ClosetTagEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photos = (location.state as { photos?: string[] } | null)?.photos ?? [];
  const [items, setItems] = useState<OcrItem[]>(() => itemsForPhotos(photos));
  // 같은 이름의 칩이 여러 벌에 있어도 하나만 선택되도록 아이템·종류·순번을 합친 키로 관리
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const selectChip = (key: string) => {
    setSelectedKey((prev) => (prev === key ? null : key));
    setTouched(true);
  };

  // 삭제 — 해시태그는 목록에서 빼고, 카테고리/세부/브랜드는 값을 비운다(칩이 사라짐)
  const deleteChip = (itemId: number, kind: ChipKind, index: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (kind === 'tag') return { ...item, tags: item.tags.filter((_, i) => i !== index) };
        return { ...item, [kind]: '' };
      }),
    );
    setSelectedKey(null);
    setTouched(true);
  };

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <OnboardingTopBar progress={300 / 375} showBack onBack={() => navigate(-1)} />

        {/* 타이틀 — 진행 바 아래 52 */}
        <h1 className="mt-[52px] text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
          수정할 태그를 선택해주세요
        </h1>

        {/* 목록 — 327×395(left 24), 타이틀 아래 48, padding 10 / 행 간격 10, 세로 스크롤 */}
        <div className="mx-auto mt-12 h-[395px] w-[327px] overflow-y-auto p-2.5">
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <OcrItemRow
                key={item.id}
                item={item}
                editable
                selectedKey={selectedKey}
                onSelectChip={selectChip}
                onDeleteChip={(kind, index) => deleteChip(item.id, kind, index)}
              />
            ))}
          </div>
        </div>

        {/* 확인 — 수정 전에는 연회색, 수정하면 검정 */}
        <div className="mt-auto px-6 pb-[calc(40px+env(safe-area-inset-bottom,0px))] pt-4">
          <CtaButton
            label="확인"
            variant={touched ? 'dark' : 'fill'}
            onClick={touched ? () => navigate('/closet/register/added') : undefined}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default ClosetTagEditPage;
