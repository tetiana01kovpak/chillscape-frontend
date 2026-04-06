'use client';

import { useState, useRef, useEffect, useId } from 'react';
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
  showPlaceholderForEmptyValue?: boolean;
  className?: string;
  controlClassName?: string;
  menuClassName?: string;
  valueClassName?: string;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select one...',
  error,
  showPlaceholderForEmptyValue = false,
  className,
  controlClassName,
  menuClassName,
  valueClassName,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasEmptySelection = showPlaceholderForEmptyValue && !value;
  const selectedOption = hasEmptySelection ? undefined : options.find((opt) => opt.value === value);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={clsx(s.container, className)} ref={containerRef}>
      {label && <label className={s.label}>{label}</label>}

      <div className={s.selectBlock}>
        <div
          className={clsx(s.control, controlClassName, { [s.isOpen]: isOpen })}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
        >
          <span className={clsx(s.value, valueClassName, !selectedOption && s.placeholder)}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <Icon
            name="icon-keyboard-arrow-down"
            className={clsx(s.arrow, { [s.arrowUp]: isOpen })}
          />
        </div>

        {isOpen && (
          <ul
            id={listboxId}
            className={clsx(s.menu, 'customScrollbar', menuClassName)}
            role="listbox"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={clsx(s.option, { [s.isSelected]: opt.value === value })}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <span className={s.errorMessage}>{error}</span>}
    </div>
  );
};
