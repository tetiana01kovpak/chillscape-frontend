"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import styles from "./ConfirmationModal.module.css";

interface ModalProps {
  title: string;
  description?: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => Promise<void> | void;
  children?: ReactNode;
}

export default function ConfirmationModal({
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
}: ModalProps) {
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
      toast.error("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={handleClose} 
            disabled={isLoading}
          >
            {cancelButtonText}
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Завантаження..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}