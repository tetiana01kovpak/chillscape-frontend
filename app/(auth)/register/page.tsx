import { Suspense } from 'react';
import AuthNav from '@/components/auth/AuthNav/AuthNav';
import RegistrationForm from '@/components/auth/RegistrationForm/RegistrationForm';
import css from '../authLayout.module.css';

export default function RegisterPage() {
  return (
    <div className={css.card}>
      <AuthNav />
      <Suspense>
        <RegistrationForm />
      </Suspense>
    </div>
  );
}
