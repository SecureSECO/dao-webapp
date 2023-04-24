/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cn } from '@/src/lib/utils';
import { BaseHTMLAttributes } from 'react';

interface LegendProps extends BaseHTMLAttributes<HTMLLegendElement> {}

/**
 * The Legend component is a pre-styled legend element that mimicks the Label component.
 * @param props - Props for the legend component.
 * @returns A Label React element.
 */
const Legend = ({ className, children, ...props }: LegendProps) => {
  return (
    <legend
      {...props}
      className={cn(
        'font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-80',
        className
      )}
    >
      {children}
    </legend>
  );
};

export default Legend;
