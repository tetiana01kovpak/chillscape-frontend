'use client';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Icon } from '@/components/ui/Icon/Icon';
import { Loader } from '@/components/ui/Loader/Loader';
import { saveLocation } from '@/lib/locationsApi';
import s from './LocationForm.module.css';
import Image from 'next/image';

// 1. Типізація значень форми (для ESLint та TS)
interface LocationValues {
  name: string;
  locationType: string;
  region: string;
  description: string;
  images: File | null;
}

interface LocationFormProps {
  initialData?: Partial<LocationValues> & { id?: string };
  id?: string; // Якщо id є — ми в режимі редагування
  title: string;
}

// 2. Схема валідації Yup
const LocationSchema = Yup.object().shape({
  name: Yup.string().required('Назва обов’язкова'),
  locationType: Yup.string().required('Оберіть тип місця'),
  region: Yup.string().required('Оберіть регіон'),
  description: Yup.string()
    .min(20, 'Опис має бути не менше 20 символів')
    .max(6000, 'Опис не може перевищувати 6000 символів')
    .required('Додайте опис'),
  images: Yup.mixed().required('Додайте фото обкладинки'),
});

export const LocationForm = ({ initialData, title, id }: LocationFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const formik = useFormik<LocationValues>({
    initialValues: {
      name: initialData?.name || '',
      locationType: initialData?.locationType || '',
      region: initialData?.region || '',
      description: initialData?.description || '',
      images: initialData?.images || null,
    },
    validationSchema: LocationSchema,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('locationType', values.locationType);
        formData.append('region', values.region);
        formData.append('description', values.description);

        if (values.images) {
          formData.append('images', values.images);
        }

        if (id) {
          // Перехід на сторінку деталей
          router.push(`/locations/${id}`);
          router.refresh(); // Оновлюємо кеш серверних компонентів
        } else {
          // РЕЖИМ СТВОРЕННЯ
          const response = await saveLocation(formData);
          toast.success('Локацію створено!');

          // Отримуємо ID з відповіді твого API
          const newId = response?.data?._id;

          if (newId) {
            router.push(`/locations/${newId}`);
            router.refresh();
          } else {
            // Якщо ID чомусь не прийшов, можна кинути на загальний список
            router.push('/locations');
          }
        }
      } catch (error) {
        toast.error('Помилка при збереженні');
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('images', file);
    }
  };

  return (
    <div className={s.root}>
      {/* 3. Наш кастомний Loader поверх форми під час сабміту */}
      {formik.isSubmitting && (
        <div className={s.loaderOverlay}>
          <Loader />
        </div>
      )}

      <h1 className={s.pageTitle}>{title}</h1>

      <form className={s.formCard} onSubmit={formik.handleSubmit}>
        {/* Секція обкладинки */}
        <div className={s.uploadSection}>
          <label className={s.label}>Обкладинка</label>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className={s.dropzone} onClick={() => fileInputRef.current?.click()}>
            {formik.values.images ? (
              <Image
                src={URL.createObjectURL(formik.values.images as File)}
                alt="Preview"
                width={600} // Або використай fill, якщо контейнер має розміри
                height={400}
                className={s.previewImage}
                unoptimized // КРИТИЧНО для blob-посилань
                onLoad={e => {
                  // Очищуємо пам'ять після завантаження
                  const target = e.target as HTMLImageElement;
                  if (target.src.startsWith('blob:')) {
                    URL.revokeObjectURL(target.src);
                  }
                }}
              />
            ) : (
              <Icon name="icon-image" width={64} height={64} className={s.placeholderIcon} />
            )}
          </div>
          <Button
            variant="secondary"
            type="button"
            className={s.uploadBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            {formik.values.images ? 'Змінити фото' : 'Завантажити фото'}
          </Button>
          {formik.touched.images && formik.errors.images && (
            <span className={s.errorText}>{formik.errors.images as string}</span>
          )}
        </div>

        {/* Поля вводу */}
        <div className={s.fieldsGroup}>
          <Input
            name="name"
            label="Назва місця"
            placeholder="Введіть назву"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? formik.errors.name : undefined}
          />

          <Select
            label="Тип місця"
            value={formik.values.locationType}
            options={[
              { value: 'nature', label: 'Природа' },
              { value: 'hotel', label: 'Готель' },
              { value: 'culture', label: 'Культура' },
            ]}
            onChange={val => formik.setFieldValue('locationType', val)}
            error={formik.touched.locationType ? formik.errors.locationType : undefined}
          />

          <Select
            label="Регіон"
            value={formik.values.region}
            options={[
              { value: 'kyiv', label: 'Київська обл.' },
              { value: 'odesa', label: 'Одеська обл.' },
              { value: 'lviv', label: 'Львівська обл.' },
            ]}
            onChange={val => formik.setFieldValue('region', val)}
            error={formik.touched.region ? formik.errors.region : undefined}
          />

          <TextArea
            name="description"
            label="Детальний опис"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description ? formik.errors.description : undefined}
          />
        </div>

        {/* Кнопки */}
        <div className={s.formActions}>
          <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting}>
            Опублікувати
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => formik.resetForm()}
            disabled={formik.isSubmitting}
          >
            Відмінити
          </Button>
        </div>
      </form>
    </div>
  );
};
