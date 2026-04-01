'use client';

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
  type: string;
  region: string;
  description: string;
  image: File | null;
}

interface LocationFormProps {
  initialData?: Partial<LocationValues> & { id?: string };
  id?: string; // Якщо id є — ми в режимі редагування
  title: string;
}

// 2. Схема валідації Yup
const LocationSchema = Yup.object().shape({
  name: Yup.string().required('Назва обов’язкова'),
  type: Yup.string().required('Оберіть тип місця'),
  region: Yup.string().required('Оберіть регіон'),
  description: Yup.string().min(10, 'Опис має бути не менше 10 символів').required('Додайте опис'),
  image: Yup.mixed().required('Додайте фото обкладинки'),
});

export const LocationForm = ({ initialData, title, id }: LocationFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<LocationValues>({
    initialValues: {
      name: initialData?.name || '',
      type: initialData?.type || '',
      region: initialData?.region || '',
      description: initialData?.description || '',
      image: initialData?.image || null,
    },
    validationSchema: LocationSchema,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('type', values.type);
        formData.append('region', values.region);
        formData.append('description', values.description);

        if (values.image) {
          formData.append('image', values.image);
        }

        if (id) {
          // Виклик PATCH або PUT для оновлення
          await saveLocation(formData, id);
          toast.success('Локацію оновлено!');
        } else {
          // Виклик POST для створення
          await saveLocation(formData);
          toast.success('Локацію створено!');
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
      formik.setFieldValue('image', file);
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
            {formik.values.image ? (
              <Image
                src={URL.createObjectURL(formik.values.image as File)}
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
            {formik.values.image ? 'Змінити фото' : 'Завантажити фото'}
          </Button>
          {formik.touched.image && formik.errors.image && (
            <span className={s.errorText}>{formik.errors.image as string}</span>
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
            value={formik.values.type}
            options={[
              { value: 'nature', label: 'Природа' },
              { value: 'hotel', label: 'Готель' },
              { value: 'culture', label: 'Культура' },
            ]}
            onChange={val => formik.setFieldValue('type', val)}
            error={formik.touched.type ? formik.errors.type : undefined}
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
