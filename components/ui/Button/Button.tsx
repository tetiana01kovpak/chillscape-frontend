import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import s from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Сделали необязательным, если кнопка — только иконка
  variant?: 'primary' | 'secondary' | 'icon'; 
  icon?: ReactNode; // Пропс для иконки (например, из библиотеки или SVG)
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  icon,
  className, 
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={clsx(s.btn, s[variant], className)} 
      {...props}
    >
      {icon && <span className={s.iconWrapper}>{icon}</span>}
      {children}
    </button>
  );
};