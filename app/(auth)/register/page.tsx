import { Suspense } from 'react';
import AuthNav from '@/components/auth/AuthNav/AuthNav';
import RegistrationForm from '@/components/auth/RegistrationForm/RegistrationForm';
import { Loader } from '@/components/ui/Loader/Loader';
import css from '../authLayout.module.css';

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader />}>
      <div className={css.card}>
        <AuthNav />
        <RegistrationForm />
      </div>
    </Suspense>
  );
}
