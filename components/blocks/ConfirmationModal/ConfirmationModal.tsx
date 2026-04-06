'use client';

import { useState, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '@/components/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { Loader } from '@/components/ui/Loader/Loader';
import css from './ConfirmationModal.module.css';
import styles from '../../ui/Button/Button.module.css';

interface ConfirmationModalProps {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmationModal({
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  children,
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    if (isLoading) {
      return;
    }

    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      await onConfirm();
      onCancel();
    } catch (error) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error('Сталася помилка. Спробуйте ще раз.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={handleCancel} className={css.modal}>
      <div className={css.sectionTitle}>
        <h2 className={css.title}>{title}</h2>
        {children ? <div className={css.content}>{children}</div> : null}
      </div>

      <div className={css.buttons}>
        <Button
          className={`${css.btn} ${styles.secondary}`}
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelButtonText}
        </Button>
        <Button
          className={`${css.btn} ${styles.primary}`}
          variant="primary"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? <Loader size={18} inline /> : confirmButtonText}
        </Button>
      </div>
    </Modal>
  );
}
