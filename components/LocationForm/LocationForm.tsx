'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Loader } from '@/components/ui/Loader/Loader';
import { saveLocation } from '@/lib/locationsApi';
import {
  fetchLocationTypes,
  fetchRegions,
  type SelectOption,
} from '@/lib/locations';
import s from './LocationForm.module.css';

interface LocationValues {
  name: string;
  locationType: string;
  region: string;
  description: string;
  image: File | string | null;
}

interface LocationFormProps {
  initialData?: Partial<LocationValues> & { id?: string };
  id?: string;
  title: string;
}

const LocationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Введіть назву місця'),
  locationType: Yup.string().required('Оберіть тип місця'),
  region: Yup.string().required('Оберіть регіон'),
  description: Yup.string()
    .trim()
    .required('Додайте опис')
    .min(20, 'Опис має бути не менше 20 символів')
    .max(6000, 'Опис не може перевищувати 6000 символів'),
  image: Yup.mixed().required('Додайте фото локації'),
});

const PLACEHOLDER_IMAGE = '/images/placeholder.png';

const getSubmitErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseMessage =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : typeof error.response?.data?.error === 'string'
          ? error.response.data.error
          : null;

    if (responseMessage) {
      return responseMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Помилка при збереженні';
};

export const LocationForm = ({ initialData, title, id }: LocationFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([]);
  const [locationTypeOptions, setLocationTypeOptions] = useState<SelectOption[]>([]);
  const resettableRegionOptions: SelectOption[] = [{ value: '', label: 'Усі регіони' }, ...regionOptions];
  const resettableLocationTypeOptions: SelectOption[] = [
    { value: '', label: 'Усі типи місць' },
    ...locationTypeOptions,
  ];

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [regions, locationTypes] = await Promise.all([
          fetchRegions(),
          fetchLocationTypes(),
        ]);

        setRegionOptions(regions);
        setLocationTypeOptions(locationTypes);
      } catch (error) {
        console.error('Помилка при завантаженні опцій форми локації:', error);
      }
    };

    loadOptions();
  }, []);

  const formik = useFormik<LocationValues>({
    initialValues: {
      name: initialData?.name || '',
      locationType: initialData?.locationType || '',
      region: initialData?.region || '',
      description: initialData?.description || '',
      image: initialData?.image || null,
    },
    validationSchema: LocationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name.trim());
        formData.append('type', values.locationType);
        formData.append('locationType', values.locationType);
        formData.append('region', values.region);
        formData.append('description', values.description.trim());

        if (values.image instanceof File) {
          formData.append('images', values.image);
        } else if (!id && typeof values.image === 'string' && values.image.trim()) {
          formData.append('images', values.image.trim());
        }

        if (id) {
          await saveLocation(formData, id);
          toast.success('Локацію оновлено!');
          router.push(`/locations/${id}`);
          router.refresh();
        } else {
          const response = await saveLocation(formData);
          toast.success('Локацію створено!');

          const newId = response?._id || response?.data?._id || response?.data?.id;

          if (newId) {
            router.push(`/locations/${newId}`);
            router.refresh();
          } else {
            router.push('/locations');
          }
        }
      } catch (error) {
        toast.error(getSubmitErrorMessage(error));
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const showFieldError = (fieldName: keyof typeof formik.errors) =>
    Boolean(formik.touched[fieldName] || formik.submitCount > 0);

  const nameError = showFieldError('name') ? formik.errors.name : undefined;
  const locationTypeError = showFieldError('locationType') ? formik.errors.locationType : undefined;
  const regionError = showFieldError('region') ? formik.errors.region : undefined;
  const descriptionError = showFieldError('description') ? formik.errors.description : undefined;
  const imageError = showFieldError('image') ? formik.errors.image : undefined;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    formik.setFieldTouched('image', true, false);

    if (file) {
      formik.setFieldValue('image', file, true);
    }
  };

  const submitLabel = id ? 'Зберегти зміни' : 'Опублікувати';

  return (
    <div className={s.root}>
      {formik.isSubmitting && (
        <div className={s.loaderOverlay}>
          <Loader size={56} />
        </div>
      )}

      <h1 className={s.pageTitle}>{title}</h1>

      <form className={s.formCard} onSubmit={formik.handleSubmit}>
        <div className={s.uploadSection}>
          <label className={s.label}>
            {!formik.dirty ? 'Обкладинка' : 'Обкладинка статті'}
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
                    ? formik.values.image
                    : URL.createObjectURL(formik.values.image)
                }
                alt="Preview"
                width={1091}
                height={726}
                className={s.previewImage}
                unoptimized
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.startsWith('blob:')) {
                    URL.revokeObjectURL(target.src);
                  }
                }}
              />
            ) : (
              <Image
                src={PLACEHOLDER_IMAGE}
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
          {imageError && <span className={s.errorText}>{imageError as string}</span>}
        </div>

        <div className={s.fieldsGroup}>
          <Input
            name="name"
            label="Назва місця"
            placeholder="Введіть назву місця"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={nameError}
          />

          <Select
            label="Тип місця"
            value={formik.values.locationType}
            placeholder="Оберіть тип місця"
            options={resettableLocationTypeOptions}
            showPlaceholderForEmptyValue
            onChange={(value) => {
              formik.setFieldTouched('locationType', true, false);
              formik.setFieldValue('locationType', value, true);
            }}
            error={locationTypeError}
          />

          <Select
            label="Регіон"
            value={formik.values.region}
            placeholder="Оберіть регіон"
            options={resettableRegionOptions}
            showPlaceholderForEmptyValue
            onChange={(value) => {
              formik.setFieldTouched('region', true, false);
              formik.setFieldValue('region', value, true);
            }}
            error={regionError}
          />

          <TextArea
            name="description"
            label="Детальний опис"
            placeholder="Детальний опис локації"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={descriptionError}
          />
        </div>

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

          <button
            className={`${s.submitBtn} ${s.primarySubmitBtn}`}
            type="submit"
            disabled={formik.isSubmitting ? true : false}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
