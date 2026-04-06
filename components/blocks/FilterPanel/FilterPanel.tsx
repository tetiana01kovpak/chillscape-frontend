'use client';

import styles from './FilterPanel.module.css';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { sortOptions, type Filters, type SelectOption } from '@/lib/locations';

type FilterPanelProps = {
  filters: Filters;
  regions: SelectOption[];
  types: SelectOption[];
  onFiltersChange: (next: Partial<Filters>) => void;
};

export default function FilterPanel({
  filters,
  regions,
  types,
  onFiltersChange,
}: FilterPanelProps) {
  const regionOptions: SelectOption[] = [{ value: '', label: 'Усі регіони' }, ...regions];
  const typeOptions: SelectOption[] = [{ value: '', label: 'Усі типи' }, ...types];

  return (
    <div className={styles.filterPanel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Усі місця відпочинку</h1>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Input
            id="location-search"
            placeholder="Пошук"
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className={styles.searchField}
            inputClassName={styles.inputElement}
          />
        </div>

        <div className={styles.regionWrapper}>
          <Select
            options={regionOptions}
            value={filters.region}
            onChange={(value) => onFiltersChange({ region: value as string })}
            placeholder="Регіон"
            showPlaceholderForEmptyValue
            className={styles.selectField}
            controlClassName={styles.selectControl}
            menuClassName={styles.selectMenu}
            valueClassName={styles.selectValue}
          />
        </div>

        <div className={styles.typeWrapper}>
          <Select
            options={typeOptions}
            value={filters.type}
            onChange={(value) => onFiltersChange({ type: value as string })}
            placeholder="Тип локації"
            showPlaceholderForEmptyValue
            className={styles.selectField}
            controlClassName={styles.selectControl}
            menuClassName={styles.selectMenu}
            valueClassName={styles.selectValue}
          />
        </div>

        <div className={styles.sortWrapper}>
          <Select
            options={sortOptions}
            value={filters.sort}
            onChange={(value) => onFiltersChange({ sort: value as Filters['sort'] })}
            placeholder="Сортування"
            className={styles.selectField}
            controlClassName={styles.selectControl}
            menuClassName={styles.selectMenu}
            valueClassName={styles.selectValue}
          />
        </div>
      </div>
    </div>
  );
}
