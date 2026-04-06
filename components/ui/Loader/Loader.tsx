import { Icon } from '../Icon/Icon';
import s from './Loader.module.css';
import clsx from 'clsx';

interface LoaderProps {
  size?: number;
  className?: string;
  inline?: boolean;
  label?: string;
}

export const Loader = ({
  size = 32,
  className,
  inline = false,
  label = 'Завантаження',
}: LoaderProps) => {
  return (
    <div
      className={clsx(s.loader, inline ? s.inline : s.block, className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Icon name="icon-spinner" width={size} height={size} className={s.spinner} />
    </div>
  );
};
