'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LocationForm } from '@/components/LocationForm/LocationForm';
import { getLocationById } from '@/lib/clientApi';
import { Loader } from '@/components/ui/Loader/Loader';
import toast from 'react-hot-toast';

// 1. Оновлюємо інтерфейс під нову схему бекенду
interface LocationData {
  _id: string;        // MongoDB використовує _id
  name: string;
  locationType: string; // Згідно з твоєю моделлю на бекенді
  region: string;
  description: string;
  image: string;      // Тепер це поодинокий URL (рядок)
}

// 2. Додаємо default export, щоб Next.js міг відрендерити сторінку
export default function EditLocationPage() {
  const params = useParams();
  const id = params.locationId || params.id; // Перевір назву папки в [id] або [locationId]
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (!id || typeof id !== 'string') return;
        
        // Отримуємо дані. Припускаємо, що API повертає { data: { ... } }
        const response = await getLocationById(id);
        const data = response.data || response; 
        
        setLocation(data);
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
  if (!location) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Локацію не знайдено</p>;

  // 3. Мапимо дані з БД (location) у формат, який очікує LocationForm (initialValues)
  const initialValues = {
    name: location.name,
    locationType: location.locationType, // Передаємо locationType, щоб Select його підхопив
    region: location.region,
    description: location.description,
    image: location.image,
  };

  return (
    <LocationForm 
      title="Редагувати локацію" 
      initialData={initialValues} 
      id={location._id} // Передаємо ID, щоб форма знала, що це PATCH, а не POST
    />
  );
}