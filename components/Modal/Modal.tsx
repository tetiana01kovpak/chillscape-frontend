'use client';

import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { Button } from '../ui/Button/Button';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>
        <Button>
          <Icon name="icon-x"></Icon>
        </Button>
        <Icon name="icon-x" width={32} height={32} className={css.icon}></Icon>
        {children}
      </div>
    </div>,
    document.body
  );
}
