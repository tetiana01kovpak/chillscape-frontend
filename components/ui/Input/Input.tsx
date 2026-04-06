import clsx from 'clsx';
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import s from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  icon?: ReactNode;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, inputClassName, id, type = 'text', ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toString()}` : 'input');

    return (
      <div className={clsx(s.inputWrapper, className)}>
        {label && <label htmlFor={inputId} className={s.label}>{label}</label>}

        <div className={s.fieldGroup}>
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clsx(s.input, inputClassName, { [s.error]: error })}
            {...props}
          />
          {icon && <span className={s.iconWrapper}>{icon}</span>}
        </div>

        {error && <span className={s.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
