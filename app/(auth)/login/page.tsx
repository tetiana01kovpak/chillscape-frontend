import { Suspense } from 'react';
import AuthNav from '@/components/auth/AuthNav/AuthNav';
import LoginForm from '@/components/auth/LoginForm/LoginForm';
import { Loader } from '@/components/ui/Loader/Loader';
import css from '../authLayout.module.css';

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <div className={css.card}>
        <AuthNav />
        <LoginForm />
      </div>
    </Suspense>
  );
}
