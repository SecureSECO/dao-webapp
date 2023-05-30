import { cn } from '@/src/lib/utils';
import React from 'react';

const Rep = ({ className, ...props }: React.BaseHTMLAttributes<SVGElement>) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" fill="currentColor" fillRule="nonzero" r="16" />
        <text x="8.5" y="26" className="fill-white text-2xl">
          R
        </text>
      </g>
    </svg>
  );
};

export default Rep;
