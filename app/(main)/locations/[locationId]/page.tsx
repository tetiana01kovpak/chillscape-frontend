import { notFound } from 'next/navigation';

import { getLocationById, getUserById, getLocationTypes } from '@/lib/clientApi';

import LocationInfoBlock from '@/components/blocks/LocationInfoBlock/LocationInfoBlock';
import LocationGallery from '@/components/blocks/LocationGallery/LocationGallery';
import LocationDescription from '@/components/blocks/LocationDescription/LocationDescription';
import ReviewsSection from '@/components/blocks/ReviewsSection/ReviewsSection';
import css from './page.module.css';

type Props = {
  params: Promise<{ locationId: string }>;
};

export default async function LocationDetailsPage({ params }: Props) {
  const { locationId } = await params;

  const location = await getLocationById(locationId);

  if (!location) return notFound();

  const types = await getLocationTypes();
  const typeName = types.find(t => t.slug === location.locationType)?.type ?? location.locationType;

  const author = await getUserById(location.ownerId);
  const authorName = author.name;

  return (
    <div className="section">
      <div className="container">
        <div className={css.hero}>
          <LocationInfoBlock location={location} typeName={typeName} authorName={authorName} />
          <LocationGallery image={location.image} name={location.name} />
        </div>
        <LocationDescription description={location.description} />
        <ReviewsSection locationId={locationId} />
      </div>
    </div>
  );
}
