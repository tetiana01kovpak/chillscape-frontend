import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

import HeroBlock from '@/components/blocks/HeroBlock/HeroBlock';
import AdvantagesBlock from '@/components/blocks/AdvantagesBlock/AdvantagesBlock';
import PopularLocationsBlock from '@/components/blocks/PopularLocationsBlock/PopularLocationsBlock';
import ReviewsBlock from '@/components/blocks/ReviewsBlock/ReviewsBlock';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroBlock />
        <AdvantagesBlock />
        <PopularLocationsBlock />
        <ReviewsBlock />
      </main>
    </>
  );
}
