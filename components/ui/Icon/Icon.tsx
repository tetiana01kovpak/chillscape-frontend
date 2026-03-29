import clsx from 'clsx';
import { SVGProps } from 'react';


interface IconProps extends SVGProps<SVGSVGElement> {
  name: string; // id иконки в спрайте, например 'bookmark'
  className?: string;
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  return (
    <svg 
      className={clsx('icon', className)} 
      aria-hidden="true"
      fill="currentColor" 
      {...props}
    >
      {/* Путь к спрайту + id иконки */}
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};