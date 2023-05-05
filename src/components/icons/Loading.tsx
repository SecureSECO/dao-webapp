/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cn } from '@/src/lib/utils';
import React from 'react';

const Loading = ({
  className,
  ...props
}: React.BaseHTMLAttributes<SVGElement>) => {
  // SVG is contained in a wrapper here to add some padding to size the actual svg down slightly
  // This slight resizing is necessary to make it match all other icon sizes
  return (
    <div className={cn(className, 'p-0.5')}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill="currentColor"
          className="origin-center animate-spin"
          d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
        />
      </svg>
    </div>
  );
};

export default Loading;
