'use client';
import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Modal from '../../Modal/Modal';

interface Props {
  onConfirm: () => Promise<void> | void;
  children: (args: {
    handleClose: () => void;
    handleConfirm: () => void;
    isLoading: boolean;
  }) => ReactNode;
}

export default function ConfirmationModal({ onConfirm, children }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (!isLoading) router.back();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      router.back(); // Закриваємо при успіху
    } catch (error) {
      toast.error('Сталася помилка. Спробуйте ще раз.');
      throw new Error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return <Modal onClose={handleClose}>{children({ handleClose, handleConfirm, isLoading })}</Modal>;
}
