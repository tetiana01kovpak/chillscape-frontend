'use client';
import ConfirmationModal from '@/components/blocks/ConfirmationModal/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import css from './LogoutConfirmation.module.css';
import { Button } from '@/components/ui/Button/Button';

export default function LogoutConfirmation() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');

      console.log('Вихід виконано');

      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Помилка при виході:', error);
      toast.error('Не вдалося вийти. Спробуйте пізніше.');
    }
  };

  return (
    <ConfirmationModal onConfirm={handleLogout}>
      {({ handleClose, handleConfirm, isLoading }) => (
        <>
          <h2 className={css.title}>Ви точно хочете вийти?</h2>
          <p className={css.text}>Ми будемо сумувати за вами!</p>
          <ul className={css.list}>
            <li>
              <Button
                className={css.btn}
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Відмінити
              </Button>
            </li>
            <li>
              <Button
                className={css.btn}
                variant="primary"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Завантаження...' : 'Вийти'}
              </Button>
            </li>
          </ul>
        </>
      )}
    </ConfirmationModal>
  );
}
