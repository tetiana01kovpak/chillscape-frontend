import { notFound } from 'next/navigation';

import {
  getLocationById,
  getUserById,
  getLocationTypes,
  getLocationRegions,
} from '@/lib/clientApi';

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

  const [location, types, regions] = await Promise.all([
    getLocationById(locationId),
    getLocationTypes(),
    getLocationRegions(),
  ]);
  const isValidMongoId = /^[a-f\d]{24}$/i.test(locationId);

  if (!isValidMongoId) {
    notFound();
  }

  if (!location) return notFound();

  const foundTypeName = types.find(t => t.slug === location.locationType);
  const typeName = foundTypeName ? foundTypeName.type : location.typeName;

  const foundRegion = regions.find(r => r.slug === location.region);

  const regionName = foundRegion ? foundRegion.region : location.region;

  const author = await getUserById(location.ownerId);
  const authorName = author.name;

  return (
    <div className="section">
      <div className="container">
        <div className={css.hero}>
          <LocationInfoBlock
            location={location}
            typeName={typeName}
            regionName={regionName}
            authorName={authorName}
          />
          <LocationGallery image={location.image} name={location.name} />
        </div>
        <LocationDescription description={location.description} />
        <ReviewsSection locationId={locationId} />
      </div>
    </div>
  );
}
