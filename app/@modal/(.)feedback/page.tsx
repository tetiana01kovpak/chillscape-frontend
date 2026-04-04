'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import css from './AuthPromptModal.module.css';

export default function AuthPromptModal() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <h2 className={css.title}>Помилка під час додавання відгуку</h2>
      <p>Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису зареєструйтесь</p>
      <Link href={'/login'}>
        <Button variant="secondary">Увійти</Button>
      </Link>
      <Link href={'/register'}>
        <Button variant="primary">Зараєструватись</Button>
      </Link>
    </Modal>
  );
}
