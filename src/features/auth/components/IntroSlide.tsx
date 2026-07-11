import Badge from '@/components/ui/Badge';

interface IntroSlideProps {
  title: string;
  description: string;
  badges?: string[];
}

/** 서비스 인트로 슬라이드 1장. 이미지 영역은 에셋 확보 전까지 placeholder. */
const IntroSlide = ({ title, description, badges }: IntroSlideProps) => (
  <div className="flex w-full shrink-0 flex-col items-center px-6">
    {/* 이미지 placeholder - 에셋 교체 시 <img>로 대체 */}
    <div className="mt-12 aspect-[4/5] w-full max-w-[260px] rounded-2xl bg-neutral-200" />
    <h2 className="mt-10 whitespace-pre-line text-center text-2xl font-bold leading-snug">
      {title}
    </h2>
    <p className="mt-3 whitespace-pre-line text-center text-sm leading-relaxed text-neutral-500">
      {description}
    </p>
    {badges && (
      <div className="mt-4 flex gap-2">
        {badges.map((badge) => (
          <Badge key={badge} label={badge} />
        ))}
      </div>
    )}
  </div>
);

export default IntroSlide;
