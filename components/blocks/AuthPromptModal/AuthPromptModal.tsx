'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import css from './AuthPromptModal.module.css';

export default function AuthPromptModal() {
  const router = useRouter();
  const pathname = usePathname();
  const returnTo = pathname.replace(/\/auth-prompt$/, '');
  const registerHref =
    returnTo && returnTo !== '/register' && returnTo !== '/login'
      ? `/register?redirect=${encodeURIComponent(returnTo)}`
      : '/register';
  const loginHref =
    returnTo && returnTo !== '/register' && returnTo !== '/login'
      ? `/login?redirect=${encodeURIComponent(returnTo)}`
      : '/login';

  return (
    <Modal onClose={() => router.back()} className={css.modal}>
      <div className={css.sectionTitle}>
        <h2 className={css.title}>Помилка під час додавання відгуку</h2>
        <p className={css.text}>
          Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису зареєструйтесь
        </p>
      </div>
      <div className={css.buttons}>
        <Link className={css.link} href={loginHref}>
          <Button className={css.btn} variant="secondary">
            Увійти
          </Button>
        </Link>
        <Link className={css.link} href={registerHref}>
          <Button className={css.btn} variant="primary">
            Зареєструватись
          </Button>
        </Link>
      </div>
    </Modal>
  );
}
