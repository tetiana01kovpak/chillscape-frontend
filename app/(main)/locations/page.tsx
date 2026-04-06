import { Suspense } from 'react';
import { Loader } from '@/components/ui/Loader/Loader';
import LocationsPageClient from './LocationsPageClient';

export default function LocationsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LocationsPageClient />
    </Suspense>
  );
}
