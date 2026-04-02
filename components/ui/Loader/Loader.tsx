import { Icon } from '../Icon/Icon';
import s from './Loader.module.css';
import clsx from 'clsx';

interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader = ({ size = 24, className }: LoaderProps) => {
  return (
    <div className={clsx(s.loader, className)}>
      <Icon name="icon-spinner" width={size} height={size} className={s.spinner} />
    </div>
  );
};
