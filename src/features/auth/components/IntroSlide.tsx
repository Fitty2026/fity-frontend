import Badge from '@/components/ui/Badge';

interface IntroSlideProps {
  imageSrc: string;
  title: string;
  description: string;
  badges?: string[];
}

/** 서비스 인트로 슬라이드 1장 */
const IntroSlide = ({ imageSrc, title, description, badges }: IntroSlideProps) => (
  <div className="flex w-full shrink-0 flex-col items-center px-6">
    <img
      src={imageSrc}
      alt=""
      className="mt-12 w-full max-w-[260px] rounded-2xl"
    />
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
