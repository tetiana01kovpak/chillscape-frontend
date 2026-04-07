import styles from './AdvantagesBlock.module.css';
import { Icon } from '@/components/ui/Icon/Icon';

const advantages = [
  {
    id: 1,
    icon: 'icon-select-check-box',
    title: 'Реальні відгуки',
    text: 'Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.',
  },
  {
    id: 2,
    icon: 'icon-filter-alt',
    title: 'Зручні фільтри',
    text: 'Шукайте за типом локації, регіоном, наявністю зручностей та іншими критеріями.',
  },
  {
    id: 3,
    icon: 'icon-communication',
    title: 'Спільнота мандрівників',
    text: 'Додавайте власні улюблені місця та діліться своїми неймовірними знахідками.',
  },
];

export const AdvantagesBlock = () => {
  return (
    <section className={styles.advantages}>
      <div className="container">
        <h2 className={styles.advntitle}>Ключові переваги</h2>

        <div className={styles.advngrid}>
          {advantages.map(item => (
            <div key={item.id} className={`${styles.advncard} ${styles[`div${item.id}`]}`}>
              <Icon name={item.icon} className={styles.advnicon} />

              <h3 className={styles.advncardTitle}>{item.title}</h3>

              <p className={styles.advntext}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
