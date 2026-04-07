'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LocationForm } from '@/components/LocationForm/LocationForm';
import { getLocationById } from '@/lib/clientApi';
import { Loader } from '@/components/ui/Loader/Loader';
import toast from 'react-hot-toast';

interface LocationData {
  _id: string;
  name: string;
  locationType: string;
  region: string;
  description: string;
  image: string;
}

export default function EditLocationPage() {
  const params = useParams();
  const id = params.locationId || params.id;

  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (!id || typeof id !== 'string') return;

        const response = await getLocationById(id);
        const rawLocation = response as Record<string, unknown> & { images?: unknown };

        setLocation({
          _id: String(rawLocation._id || id),
          name: String(rawLocation.name || ''),
          locationType: String(rawLocation.locationType || rawLocation.type || ''),
          region: String(rawLocation.region || ''),
          description: String(rawLocation.description || ''),
          image:
            typeof rawLocation.image === 'string'
              ? rawLocation.image
              : Array.isArray(rawLocation.images) && typeof rawLocation.images[0] === 'string'
                ? rawLocation.images[0]
                : '',
        });
      } catch (error) {
        toast.error('Не вдалося завантажити дані локації');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (isLoading) return <Loader />;
  if (!location) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Локацію не знайдено</p>;
  }

  const initialValues = {
    name: location.name,
    locationType: location.locationType,
    region: location.region,
    description: location.description,
    image: location.image,
  };

  return (
    <main className="section">
      <div className="container">
        <LocationForm
          title="Редагування місця"
          initialData={initialValues}
          id={location._id}
        />
      </div>
    </main>
  );
}
