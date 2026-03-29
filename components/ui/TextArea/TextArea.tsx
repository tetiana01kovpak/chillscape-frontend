import clsx from 'clsx';
import { TextareaHTMLAttributes, forwardRef } from 'react';
import s from '../Input/Input.module.css'; // Переиспользуем общие стили инпутов

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || (label ? `area-${label}` : 'area');

    return (
      <div className={clsx(s.inputWrapper, className)}>
        {label && <label htmlFor={inputId} className={s.label}>{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(s.input, s.textarea, { [s.error]: error })}
          rows={5}
          {...props}
        />
        {error && <span className={s.errorMessage}>{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';