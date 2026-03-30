'use client'; // Обязательно для интерактивности
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import s from './Select.module.css';
import { Icon } from '../Icon/Icon';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  
}

export const Select = ({ label, options, value, onChange, placeholder = 'Select one...', error }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне селекта
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={s.container} ref={containerRef}>
      {label && <label className={s.label}>{label}</label>}
      {error && <span className={s.errorMessage}>{error}</span>}
      <div 
        className={clsx(s.control, { [s.isOpen]: isOpen })} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={clsx(s.value, !selectedOption && s.placeholder)}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon name="icon-keyboard-arrow-down" className={clsx(s.arrow, { [s.arrowUp]: isOpen })} />
      </div>

      {isOpen && (
        <ul className={s.menu}>
          {options.map((opt) => (
            <li 
              key={opt.value} 
              className={clsx(s.option, { [s.isSelected]: opt.value === value })}
              onClick={() => {
                onChange?.(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};