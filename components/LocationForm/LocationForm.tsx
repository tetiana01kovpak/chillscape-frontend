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
import { Loader } from '@/components/ui/Loader/Loader';
import { saveLocation } from '@/lib/locationsApi';
import s from './LocationForm.module.css';
import Image from 'next/image';

// 1. Типізація значень форми (для ESLint та TS)
interface LocationValues {
  name: string;
  type: string;
  locationType: string;
  region: string;
  description: string;
  image: File | string | null;
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
  image: Yup.mixed().required('Додайте фото обкладинки'),
});
const PlaceholderImage = '/Placeholder-Image.png'; // Шлях до твоєї картинки-заповнювача
export const LocationForm = ({ initialData, title, id }: LocationFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const formik = useFormik<LocationValues>({
    initialValues: {
      name: initialData?.name || '',
      locationType: initialData?.locationType || '',
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
        formData.append('locationType', values.locationType);
        formData.append('type', values.locationType);
        formData.append('region', values.region);
        formData.append('description', values.description);

        // Додаємо файл, тільки якщо це новий об'єкт File
        if (values.image instanceof File) {
          formData.append('image', values.image);
        }

        if (id) {
          // РЕЖИМ РЕДАГУВАННЯ
          await saveLocation(formData, id); // ОБОВ'ЯЗКОВО викликаємо API
          toast.success('Локацію оновлено!');
          router.push(`/locations/${id}`);
          router.refresh();
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
      formik.setFieldValue('image', file);
    }
  };

  return (
    <div className={s.root}>
      {/* 3. Наш кастомний Loader поверх форми під час сабміту */}
      {formik.isSubmitting && (
        <div className={s.loaderOverlay}>
          <Loader
          size={200}
          className='s.Loader' />
        </div>
      )}

      <h1 className={s.pageTitle}>{title}</h1>

      <form className={s.formCard} onSubmit={formik.handleSubmit}>
        {/* Секція обкладинки */}
        <div className={s.uploadSection}>
          <label className={s.label}>
            {!formik.dirty ? 'Обкладинка' : 'Обкладинка статті'} {/* Динамічна назва секції */ }
          </label>
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
                src={
                  typeof formik.values.image === 'string'
                    ? formik.values.image // URL из базы
                    : URL.createObjectURL(formik.values.image) // Новый выбранный файл
                }
                alt="Preview"
                width={1091}
                height={726}
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
              <Image
                src={PlaceholderImage}
                alt="Placeholder"
                width={1091}
                height={726}
                className={s.placeholderImage}
              />
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
            placeholder="Введіть назву місця"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? formik.errors.name : undefined}
          />

          <Select
            label="Тип місця"
            value={formik.values.locationType}
            placeholder="Оберіть тип місця"
            options={[
              { value: 'nature', label: 'Природа' },
              { value: 'hotel', label: 'Готель' },
              { value: 'culture', label: 'Культура' },
              { value: 'entertainment', label: 'Розваги' },
              { value: 'other', label: 'Інше' },
            ]}
            onChange={val => formik.setFieldValue('locationType', val)}
            error={formik.touched.locationType ? formik.errors.locationType : undefined}
          />

          <Select
            label="Регіон"
            value={formik.values.region}
            placeholder="Оберіть регіон"
            options={[
              { value: 'kyiv', label: 'Київська обл.' },
              { value: 'odesa', label: 'Одеська обл.' },
              { value: 'lviv', label: 'Львівська обл.' },
              { value: 'kharkiv', label: 'Харківська обл.' },
              { value: 'other', label: 'Інший регіон' },
            ]}
            onChange={val => formik.setFieldValue('region', val)}
            error={formik.touched.region ? formik.errors.region : undefined}
          />

          <TextArea
            name="description"
            label="Детальний опис"
            placeholder="Детальний опис локації"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description ? formik.errors.description : undefined}
          />
        </div>

        {/* Кнопки */}
        <div className={s.formActions}>
          <Button
            variant="secondary"
            className={s.cancelBtn}
            type="button"
            onClick={() => formik.resetForm()}
            disabled={formik.isSubmitting}
          >
            {id ? 'Відмінити зміни' : 'Відмінити'}
          </Button>
          <Button
            variant="primary"
            className={s.submitBtn}
            type="submit"
            // Кнопка неактивна, якщо:
            // 1. Форма ще не була змінена (!formik.dirty) — це заблокує "Опублікувати" при старті
            // 2. АБО є помилки валідації (!formik.isValid)
            // 3. АБО йде процес відправки (formik.isSubmitting)
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >
            {!formik.dirty || !formik.isValid? 'Опублікувати' : id ? 'Зберегти зміни' : 'Зберегти'}
          </Button>
        </div>
      </form>
    </div>
  );
};
