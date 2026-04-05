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
      {locations.map(location => (
        <LocationCard key={location.id} location={location} showEditButton={showEditButton} />
      ))}
    </div>
  );
}
