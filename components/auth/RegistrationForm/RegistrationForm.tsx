'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { registerUser } from '@/lib/clientApi';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import css from '../AuthForm.module.css';

const registrationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Мінімум 2 символи')
    .max(32, 'Максимум 32 символи')
    .required("Обов'язкове поле"),
  email: Yup.string()
    .email('Невірний формат пошти')
    .matches(/@.+\..+/, 'Невірний формат пошти')
    .max(64, 'Максимум 64 символи')
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(128, 'Максимум 128 символів')
    .required("Обов'язкове поле"),
});

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore(state => state.setUser);
  const rawRedirect = searchParams.get('redirect');
  const redirect =
    rawRedirect &&
    rawRedirect !== '/register' &&
    rawRedirect !== '/login' &&
    !rawRedirect.startsWith('/register?') &&
    !rawRedirect.startsWith('/login?')
      ? rawRedirect
      : '/';

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: registrationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const user = await registerUser(values);
        localStorage.setItem('hasSession', 'true');
        setUser(user);
        router.push(redirect);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Щось пішло не так';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <h1 className={css.title}>Реєстрація</h1>

      <form className={css.form} onSubmit={formik.handleSubmit} noValidate>
        <Input
          id="name"
          name="name"
          type="text"
          label="Ім'я*"
          placeholder="Ваше ім'я"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          error={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? formik.errors.name : undefined}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Пошта*"
          placeholder="hello@relaxmap.ua"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          error={(formik.touched.email || formik.submitCount > 0) && formik.errors.email ? formik.errors.email : undefined}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Пароль*"
          placeholder="********"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          error={
            (formik.touched.password || formik.submitCount > 0) && formik.errors.password ? formik.errors.password : undefined
          }
        />

        <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Зачекайте...' : 'Зареєструватись'}
        </Button>
      </form>
    </>
  );
}
