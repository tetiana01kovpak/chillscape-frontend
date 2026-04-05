'use client';

import { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RatingStars from '@/components/ui/RatingStars/RatingStars';
import styles from './AddReviewModal.module.css';
import { Button } from '@/components/ui/Button/Button';
import { TextArea } from '@/components/ui/TextArea/TextArea';

interface Props {
  onClose: () => void;
  locationId: string;
}

interface FormValues {
  rating: number;
  review: string;
  locationId: string;
}

const validationSchema = Yup.object({
  rating: Yup.number()
    .min(1, 'Оберіть рейтинг')
    .required('Оберіть рейтинг'),
  review: Yup.string()
    .min(10, 'Мінімум 10 символів')
    .required('Введіть відгук'),
});

export default function AddReviewForm({ onClose, locationId }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Помилка: ${error.message}`);
        return;
      }

      setMessage('Відгук відправлено на модерацію');
      onClose();
    } catch (err) {
      setMessage('Помилка мережі, спробуйте пізніше');
      console.error('Network error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{ rating: 0, review: '', locationId }}
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
            <ErrorMessage
              name="review"
              component="p"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.starWrapper}>
            <RatingStars
              rating={values.rating}
              readonly={false}
              onChange={(rate) => setFieldValue('rating', rate)}
            />
            <ErrorMessage
              name="rating"
              component="p"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.buttonsWrapper}>
            <Button type="button" onClick={onClose} variant="secondary">
              Відмінити
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Надсилаю...' : 'Надіслати'}
            </Button>
          </div>

          {message && <p className={styles.submitMessage}>{message}</p>}
        </Form>
      )}
    </Formik>
  );
}
