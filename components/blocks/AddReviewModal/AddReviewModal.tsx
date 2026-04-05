'use client';

import { useEffect } from 'react';
import styles from './AddReviewModal.module.css';
import AddReviewForm from './AddReviewForm';
import { Button } from '@/components/ui/Button/Button';
import { Icon } from '@/components/ui/Icon/Icon';

interface Props {
  onClose: () => void;
  locationId: string;
}

export default function AddReviewModal({ onClose, locationId }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <Button
          variant="icon"
          onClick={onClose}
          aria-label="Закрити модальне вікно"
          className={styles.closeBtn}
        >
          <Icon name="icon-close" className={styles.closeIcon} />
        </Button>

        <h2 className={styles.title}>Залишити відгук</h2>

        <AddReviewForm onClose={onClose} locationId={locationId} />
      </div>
    </div>
  );
}
