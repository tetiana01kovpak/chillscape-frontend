'use client'
import styles from './FilterPanel.module.css';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import type { SelectOption } from '@/lib/locations';

type Filters = {
    search: string;
    region: string;
    type: string;
}
type FilterPanelProps = {
    filters: Filters;
    regions: SelectOption[];
    types: SelectOption[];
    onFiltersChange: (next: Partial<Filters>) => void;
}


function FilterPanel({
    filters,
    regions,
    types,
    onFiltersChange,
}: FilterPanelProps) {
    return (
        <section className={styles.filterPanel}>
            <h1 className={styles.title}>Усі місця відпочинку</h1>
            <div className={styles.controls}>
                <Input
                    id="location-search"
                    placeholder="Шукати за назвою..."
                    value={filters.search}
                    onChange={(e) => onFiltersChange({ search: e.target.value })}
                />
                <div className={styles.selectWrapper}>
                    <Select
                        options={regions}
                        value={filters.region}
                        onChange={(value) => onFiltersChange({ region: value })}
                        placeholder="Оберіть регіон"
                    />
                </div>
                <div className={styles.selectWrapper}>
                    <Select
                        options={types}
                        value={filters.type}
                        onChange={(value) => onFiltersChange({ type: value })}
                        placeholder="Оберіть тип"
                    />
                </div>
            </div>
        </section>
    );
}

export default FilterPanel;