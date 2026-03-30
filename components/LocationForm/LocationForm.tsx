'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Icon } from '@/components/ui/Icon/Icon';
import s from './LocationForm.module.css';

// Описуємо інтерфейс даних для TypeScript
interface LocationValues {
  name: string;
  type: string;
  region: string;
  description: string;
  image: File | null;
}

interface LocationFormProps {
  initialData?: Partial<LocationValues>;
  title: string;
}

// Схема валідації Yup
const LocationSchema = Yup.object().shape({
  name: Yup.string().required('Назва обов’язкова'),
  type: Yup.string().required('Оберіть тип місця'),
  region: Yup.string().required('Оберіть регіон'),
  description: Yup.string().min(10, 'Опис має бути не менше 10 символів').required('Додайте опис'),
  image: Yup.mixed().required('Додайте фото обкладинки'),
});

export const LocationForm = ({ initialData, title }: LocationFormProps) => {
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
    onSubmit: values => {
      // Створюємо FormData для відправки файлу на сервер
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('type', values.type);
      formData.append('region', values.region);
      formData.append('description', values.description);
      if (values.image) formData.append('image', values.image);

      console.log('Дані готові до відправки:', values);
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
      <h1 className={s.pageTitle}>{title}</h1>

      <form className={s.formCard} onSubmit={formik.handleSubmit}>
        {/* Секція Обкладинки */}
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
              <img
                src={URL.createObjectURL(formik.values.image)}
                alt="Preview"
                className={s.previewImage}
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

        {/* Текстові поля */}
        <div className={s.fieldsGroup}>
          <div className={s.labeledInput}>
            <label htmlFor="name" className={s.label}>
              Назва місця
            </label>
            <Input
              name="name"
              placeholder="Введіть назву місця"
              value={formik.values.name}
              onChange={formik.handleChange} // Formik автоматично дістає value
              onBlur={formik.handleBlur}
              error={formik.touched.name ? formik.errors.name : undefined}
            />
          </div>
          <div className={s.labeledInput}>
            <label htmlFor="type" className={s.label}>
              Тип місця
            </label>
            <Select
              placeholder="Оберіть тип місця"
              value={formik.values.type}
              options={[
                { value: 'nature', label: 'Природа' },
                { value: 'hotel', label: 'Готель' },
              ]}
              onChange={val => formik.setFieldValue('type', val)} // Для кастомного Select
              error={formik.touched.type ? formik.errors.type : undefined}
            />
          </div>
          <div className={s.labeledInput}>
            <label htmlFor="region" className={s.label}>
              Регіон
            </label>
            <Select
              placeholder="Оберіть регіон"
              value={formik.values.region}
              options={[
                { value: 'kyiv', label: 'Київська обл.' },
                { value: 'odesa', label: 'Одеська обл.' },
              ]}
              onChange={val => formik.setFieldValue('region', val)}
              error={formik.touched.region ? formik.errors.region : undefined}
            />
          </div>
          <div className={s.labeledInput}>
            <label htmlFor="description" className={s.label}>
              Детальний опис
            </label>
            <TextArea
              name="description"
              placeholder="Детальний опис локації"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description ? formik.errors.description : undefined}
            />
          </div>
        </div>

        {/* Кнопки дій */}
        <div className={s.formActions}>
          <Button
            variant="primary"
            type="submit"
            className={s.actionBtn}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Опублікувати
          </Button>
          <Button
            variant="secondary"
            type="button"
            className={s.actionBtn}
            onClick={() => formik.resetForm()}
          >
            Відмінити
          </Button>
        </div>
      </form>
    </div>
  );
};
