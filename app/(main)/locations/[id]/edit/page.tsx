'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LocationForm } from '@/components/LocationForm/LocationForm';
//import { getLocationById } from '@/lib/locationsApi';
import { Loader } from '@/components/ui/Loader/Loader';
import toast from 'react-hot-toast';


// Тип для даних, які ми отримуємо з бекенду
interface LocationData {
  id: string;
  name: string;
  type: string;
  region: string;
  description: string;
  imageUrl: string; // Бекенд зазвичай повертає рядок (URL)
}
//закоментовано бо поки нема сторінки для перегляду локації.
export default function EditLocationPage() {
  return (<div>Редагування локації</div>);
}
// export const EditLocation = () => {
//   const { id } = useParams(); // Отримуємо ID з URL (Next.js App Router)
//   const [location, setLocation] = useState<LocationData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         if (typeof id !== 'string') return;
//         const data = await getLocationById(id);
//         setLocation(data);
//       } catch (error) {
//         toast.error('Не вдалося завантажити дані локації');
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLocation();
//   }, [id]);

//   if (isLoading) return <Loader />;
//   if (!location) return <p>Локацію не знайдено</p>;

//   // Перетворюємо дані з БД у формат, який очікує наша форма
//   const initialValues = {
//     name: location.name,
//     type: location.type,
//     region: location.region,
//     description: location.description,
//     image: null, // При редагуванні поле файлу зазвичай null, поки не виберуть нове
//   };

//   return (
//     <LocationForm 
//       title="Редагувати локацію" 
//       initialData={initialValues} 
//     />
//   );
// };