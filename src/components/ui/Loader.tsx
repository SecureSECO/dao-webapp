/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The Loader module provides a simple loading component that centers the text "Loading..." on the screen.
 */

import React from 'react';

/**
 * The Loader component is a simple loading indicator displaying the text "Loading..." centered on the screen.
 * @returns A Loader React element.
 */
const Loader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      Loading...
    </div>
  );
};

export default Loader;
