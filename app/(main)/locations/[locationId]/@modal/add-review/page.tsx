'use client';

import { useParams, useRouter } from 'next/navigation';
import AddReviewModal from '@/components/blocks/AddReviewModal/AddReviewModal';

export default function AddReviewPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.locationId as string;

  return <AddReviewModal locationId={locationId} onClose={() => router.back()} />;
}
