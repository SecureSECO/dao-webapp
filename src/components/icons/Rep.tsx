/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { cn } from '@/src/lib/utils';

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
