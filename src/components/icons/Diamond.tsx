/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

/**
 * @returns Icon representing a check list
 */
const Diamond = (props: React.BaseHTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-gem"
      {...props}
    >
      <polygon points="6 3 18 3 22 9 12 22 2 9" />
      <path d="m12 22 4-13-3-6" />
      <path d="M12 22 8 9l3-6" />
      <path d="M2 9h20" />
    </svg>
  );
};

export default Diamond;
