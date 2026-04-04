'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import css from './AuthPromptModal.module.css';

export default function AuthPromptModal() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()} className={css.modal}>
      <h2 className={css.title}>Помилка під час додавання відгуку</h2>
      <p className={css.text}>
        Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису зареєструйтесь
      </p>
      <ul className={css.list}>
        <li>
          <Link className={css.link} href={'/login'}>
            <Button className={css.btn} variant="secondary">
              Увійти
            </Button>
          </Link>
        </li>
        <li>
          <Link className={css.link} href={'/register'}>
            <Button className={css.btn} variant="primary">
              Зараєструватись
            </Button>
          </Link>
        </li>
      </ul>
    </Modal>
  );
}
