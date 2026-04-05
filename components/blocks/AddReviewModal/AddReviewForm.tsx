'use client';

import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RatingStars from '@/components/ui/RatingStars/RatingStars';
import styles from './AddReviewModal.module.css';
import { Button } from '@/components/ui/Button/Button';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  locationId: string;
}

interface FormValues {
  rating: number;
  review: string;
}

const validationSchema = Yup.object({
  rating: Yup.number().min(1, 'Оберіть рейтинг').required('Оберіть рейтинг'),
  review: Yup.string().min(10, 'Мінімум 10 символів').required('Введіть відгук'),
});

export default function AddReviewForm({ onClose, locationId }: Props) {
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const payload = {
        place: locationId,
        rate: values.rating,
        description: values.review,
      };

      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        toast.error(data?.message || 'Щось пішло не так');
        return;
      }

      toast.success('Відгук відправлено на модерацію');
      onClose();
    } catch {
      toast.error('Помилка мережі, спробуйте пізніше');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{ rating: 0, review: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={styles.formGroup}>
          <div className={styles.textareaWrapper}>
            <TextArea
              name="review"
              label="Ваш відгук"
              placeholder="Напишіть ваш відгук..."
              value={values.review}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFieldValue('review', e.target.value)
              }
            />
            <ErrorMessage name="review" component="p" className={styles.errorMessage} />
          </div>

          <div className={styles.starWrapper}>
            <RatingStars
              rating={values.rating}
              readonly={false}
              onChange={rate => setFieldValue('rating', rate)}
            />
            <ErrorMessage name="rating" component="p" className={styles.errorMessage} />
          </div>

          <div className={styles.buttonsWrapper}>
            <Button type="button" onClick={onClose} variant="secondary">
              Відмінити
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Надсилаю...' : 'Надіслати'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
