'use client';

import { useState } from 'react';

interface Props {
  value: number;
  size?: number;
  gap?: number;
  onChange?: (rate: number) => void;
}

export default function StarRating({ value, size = 24, gap = 2.88, onChange }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayed = hovered ?? value;

  return (
    <div style={{ display: 'inline-flex', gap }}>
      {[1, 2, 3, 4, 5].map(i => {
        const diff = displayed - (i - 1);
        const icon =
          diff >= 1 ? 'icon-star-filled' : diff >= 0.5 ? 'icon-star-half' : 'icon-star-rate';

        return (
          <svg
            key={i}
            width={size}
            height={size}
            onMouseEnter={() => onChange && setHovered(i)}
            onMouseLeave={() => onChange && setHovered(null)}
            onClick={() => onChange?.(i)}
            style={{ cursor: onChange ? 'pointer' : 'default' }}
          >
            <use href={`/icons.svg#${icon}`} />
          </svg>
        );
      })}
    </div>
  );
}
