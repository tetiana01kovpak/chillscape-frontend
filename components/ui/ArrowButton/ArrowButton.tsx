import styles from './ArrowButton.module.css';
import { Icon } from '@/components/ui/Icon/Icon';

type ArrowButtonProps = {
  direction: 'prev' | 'next';
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
};

function ArrowButton({ direction, ariaLabel, onClick, disabled = false }: ArrowButtonProps) {
  const iconName = direction === 'prev' ? 'icon-arrow-back' : 'icon-arrow-forward';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={iconName} className={styles.icon} aria-hidden="true" />
    </button>
  );
}

export default ArrowButton;
