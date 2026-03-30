import { Suspense } from 'react';
import AuthNav from '@/components/auth/AuthNav/AuthNav';
import LoginForm from '@/components/auth/LoginForm/LoginForm';
import css from '../authLayout.module.css';

export default function LoginPage() {
  return (
    <div className={css.card}>
      <AuthNav />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
