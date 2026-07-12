import { useNavigate } from 'react-router-dom';
import selected1 from '@/assets/images/style-1.png';
import selected2 from '@/assets/images/style-2.png';
import selected3 from '@/assets/images/style-3.png';
import selected4 from '@/assets/images/style-4.png';
import selected5 from '@/assets/images/style-5.png';
import selected6 from '@/assets/images/style-6.png';
import PageLayout from '@/components/layout/PageeLayout';
import Button from '@/components/ui/Button';
import StyleCard from '@/features/onboarding/components/StyleCard';
import useOnboardingStore from '@/store/onboardingStore';
import type { StyleTag } from '@/types';

const STYLE_OPTIONS: { imageSrc: string; label: StyleTag }[] = [
  { imageSrc: selected1, label: '포멀' },
  { imageSrc: selected2, label: '페미닌' },
  { imageSrc: selected3, label: '미니멀' },
  { imageSrc: selected4, label: '캐주얼' },
  { imageSrc: selected5, label: '빈티지' },
  { imageSrc: selected6, label: '스트리트' },
];

const StylePreferencePage = () => {
  const navigate = useNavigate();
  const selectedStyles = useOnboardingStore((s) => s.selectedStyles);
  const toggleStyle = useOnboardingStore((s) => s.toggleStyle);

  return (
    <PageLayout showHeader={false} showBottomNav={false}>
      <div className="flex flex-col px-6 py-8">
        <h1 className="text-2xl font-bold">어떤 스타일을 좋아하세요?</h1>
        <p className="mt-2 text-sm text-neutral-500">
          마음에 드는 스타일을 선택해주세요. 많이 선택할수록 더 정확해져요.
        </p>

        {/* 2열 masonry - 이미지 높이가 제각각이라 columns 사용 */}
        <div className="mt-6 columns-2 gap-3">
          {STYLE_OPTIONS.map(({ imageSrc, label }) => (
            <StyleCard
              key={label}
              imageSrc={imageSrc}
              label={label}
              selected={selectedStyles.includes(label)}
              onToggle={() => toggleStyle(label)}
            />
          ))}
        </div>

        <div className="mt-8">
          <Button
            label="다음"
            fullWidth
            disabled={selectedStyles.length === 0}
            onClick={() => navigate('/onboarding/photo')}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default StylePreferencePage;
