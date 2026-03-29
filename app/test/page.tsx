'use client';
import { useState } from 'react';
import s from './page.module.css';

// Импорт твоих UI компонентов
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { Select } from '@/components/ui/Select/Select';
import { Icon } from '@/components/ui/Icon/Icon'; // Тот самый компонент для спрайта
import Link from 'next/link';


export default function TestPage() {
  const [selectVal, setSelectVal] = useState('');

  const options = [
    { value: 'item1', label: 'Item 1' },
    { value: 'item2', label: 'Item 2' },
    { value: 'item3', label: 'Item 3' },
  ];

  return (
    <div className={s.container}>
      <h1 className={s.title}>UI Elements</h1>

      <div className={s.uiGrid}>
        {/* Заголовки колонок */}
        <div />
        <h2 className={s.columnTitle}>Buttons</h2>
        <h2 className={s.columnTitle}>Links</h2>

        {/* --- NORMAL STATE --- */}
        <div className={s.stateRow}>
          <div className={s.stateLabel}>Normal</div>
          <div className={s.elementsGroup}>
            <Button variant="primary">Button</Button>
            <Button variant="secondary">Button</Button>
            <Button variant="primary">
              <Icon name="icon-bookmark" width={24} height={24} />
            </Button>
            <Button variant="secondary">
              <Icon name="icon-bookmark" width={24} height={24} />
            </Button>
          </div>
          <div className={s.elementsGroup}>
            <Link href="#" className='link'>
              <Icon name="icon-bookmark" width={24} height={24} />
            </Link>
            <Link href="#" className='link'>
              Link
            </Link>
            <Link href="#" className='link:disabled'>
             <Icon name="icon-bookmark" width={24} height={24} />
            </Link>
          </div>
        </div>

        {/* --- DISABLED STATE --- */}
        <div className={s.stateRow}>
          <div className={s.stateLabel}>Disabled</div>
          <div className={s.elementsGroup}>
            <Button variant="primary" disabled>
              Button
            </Button>
            <Button variant="secondary" disabled>
              Button
            </Button>
          </div>
          <div className={s.elementsGroup}>
            <span style={{ color: '#ccc' }}>
              Link <Icon name="bookmark" width={12} height={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Секция инпутов (ниже) */}
      <div className={s.uiGrid} style={{ marginTop: '40px', gridTemplateColumns: '1fr 1fr' }}>
        <section>
          <h2 className={s.columnTitle}>Inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input label="Text Input" placeholder="Placeholder" />
            <Input label="With Error" placeholder="Example text" error="Error text" />
          </div>
        </section>

        <section>
          <h2 className={s.columnTitle}>Select & TextArea</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Select label="Select" options={options} value={selectVal} onChange={setSelectVal} />
            <TextArea label="Text Area" placeholder="Type your message..." />
          </div>
        </section>
      </div>
    </div>
  );
}
