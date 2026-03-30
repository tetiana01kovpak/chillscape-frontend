import { LocationForm } from '@/components/LocationForm/LocationForm';

export default function EditLocationPage({ params }: { params: { id: string } }) {
  // Тут буде фетч даних за params.id
  const mockData = { name: 'Старе місце', description: 'Опис...' };

  return (
    <main className="container">
      <LocationForm title="Редагування місця" initialData={mockData} />
    </main>
  );
}