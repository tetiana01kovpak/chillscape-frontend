import HeroBlock from '@/components/blocks/HeroBlock/HeroBlock';
import { AdvantagesBlock } from '@/components/blocks/AdvantagesBlock/AdvantagesBlock';
import PopularLocationsBlock from '@/components/blocks/PopularLocationsBlock/PopularLocationsBlock';
import ReviewsBlock from '@/components/blocks/ReviewsBlock/ReviewsBlock';

export default function HomePage() {
  return (
    <>
      <HeroBlock />
      <div className="section">
        <AdvantagesBlock />
        <PopularLocationsBlock />
        <ReviewsBlock />
      </div>
    </>
  );
}
