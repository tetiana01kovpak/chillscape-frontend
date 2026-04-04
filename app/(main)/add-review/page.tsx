'use client';

import AddReviewModal from '@/components/blocks/AddReviewModal/AddReviewModal';
import { useRouter, useParams } from 'next/navigation';

export default function AddReviewPage() {
  const router = useRouter();
  const params = useParams(); 
  const locationId = params.locationId as string; 

  const handleClose = () => {
    router.back();
  };

  return <AddReviewModal onClose={handleClose} locationId={locationId} />;
}