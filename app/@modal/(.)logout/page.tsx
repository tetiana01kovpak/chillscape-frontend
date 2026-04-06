'use client';

import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/blocks/ConfirmationModal/ConfirmationModal';
import { logoutUser } from '@/lib/clientApi';
import { useAuthStore } from '@/store/authStore';
import css from './LogoutConfirmation.module.css';

export default function LogoutConfirmation() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleCancel = () => {
    router.back();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Помилка при виході:', error);
      throw new Error('Не вдалося вийти. Спробуйте пізніше.');
    }

    localStorage.removeItem('hasSession');
    clearUser();
    router.refresh();
  };

  return (
    <ConfirmationModal
      title="Ви точно хочете вийти?"
      confirmButtonText="Вийти"
      cancelButtonText="Відмінити"
      onConfirm={handleLogout}
      onCancel={handleCancel}
    >
      <p className={css.text}>Ми будемо сумувати за вами!</p>
    </ConfirmationModal>
  );
}
