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
        <svg
          width="65%"
          height="65%"
          x="18.5%"
          y="18.5%"
          viewBox="0 0 301 363.752"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="svgGroup"
            strokeLinecap="round"
            fillRule="nonzero"
            fontSize="9pt"
            strokeWidth="2mm"
            fill="#ffffff"
          >
            <path
              d="M 130.75 363.752 L 0 363.752 L 0 332.252 L 40.75 325.252 L 40.75 38.502 L 0 31.502 L 0 0.002 L 162.25 0.002 A 221.779 221.779 0 0 1 191.416 1.814 Q 212.693 4.64 229.375 11.877 A 100.158 100.158 0 0 1 253.469 26.408 A 83.642 83.642 0 0 1 271 46.252 A 89.234 89.234 0 0 1 282.898 76.496 A 124.02 124.02 0 0 1 285.25 101.252 Q 285.25 132.584 271.948 154.089 A 77.466 77.466 0 0 1 271.375 155.002 A 85.016 85.016 0 0 1 236.679 185.697 A 104.259 104.259 0 0 1 232 187.877 A 134.795 134.795 0 0 1 203.177 196.591 Q 189.834 199.126 174.659 199.662 A 227.62 227.62 0 0 1 171.5 199.752 L 90 201.252 L 90 325.252 L 130.75 332.252 L 130.75 363.752 Z M 90 38.502 L 90 162.502 L 157.25 162.502 A 171.114 171.114 0 0 0 178.537 161.273 Q 201.165 158.426 214.37 148.983 A 46.787 46.787 0 0 0 217.25 146.752 A 50.791 50.791 0 0 0 234.168 118.248 A 78.697 78.697 0 0 0 236 100.752 A 74.01 74.01 0 0 0 233.495 80.971 A 54.129 54.129 0 0 0 218 55.252 A 55.072 55.072 0 0 0 198.885 43.95 Q 183.779 38.502 162.25 38.502 L 90 38.502 Z M 301 363.752 L 240.25 363.752 L 159.25 182.002 L 208.5 181.502 L 275.75 327.002 L 301 331.502 L 301 363.752 Z"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </g>
    </svg>
  );
};

export default Rep;
