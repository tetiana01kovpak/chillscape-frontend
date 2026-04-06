import LocationCard from '@/components/cards/LocationCard/LocationCard';
import type { LocationCardData } from '@/types/location';
import css from './LocationsGrid.module.css';

type Props = {
  locations: LocationCardData[];
  showEditButton?: boolean;
};

export default function LocationsGrid({ locations, showEditButton = false }: Props) {
  return (
    <div className={css.grid}>
      {locations.map((location, index) => (
        <LocationCard
          key={location.id}
          location={location}
          showEditButton={showEditButton}
          eagerImage={index === 0}
        />
      ))}
    </div>
  );
}
