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
    return (
    <div className={styles.filterPanel}>
    <div className={styles.header}>
        <h1 className={styles.title}>Усі місця відпочинку</h1>
    </div>

    <div className={styles.controls}>
        <div className={styles.searchWrapper}>
        <Input
            id="location-search"
            placeholder="Шукати за назвою..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
        />
        </div>
        <div className={styles.selectWrapper}>
        <Select
            options={regions}
            value={filters.region}
            onChange={(value) => onFiltersChange({ region: value })}
            placeholder="Регіон"
        />
        </div>

        <div className={styles.selectWrapper}>
        <Select
            options={types}
            value={filters.type}
            onChange={(value) => onFiltersChange({ type: value })}
            placeholder="Тип"
        />
    </div>
                
        <div className={styles.sortWrapper}>
        <Select
    options={sortOptions}
    value={filters.sort}
    onChange={(value) => onFiltersChange({ sort: value as Filters['sort'] })}
    placeholder="Сортування"
/>
</div>
</div>
</div>
);
}