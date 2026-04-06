'use client';

import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { Button } from '../ui/Button/Button';

interface ModalProps {
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ className, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={`${css.modal} ${className}`}>
        <Button onClick={onClose} variant="icon" className={css.btn}>
          <Icon name="icon-close" width={32} height={32}></Icon>
        </Button>
        {children}
      </div>
    </div>,
    document.body
  );
}
