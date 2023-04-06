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
