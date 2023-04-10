/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
      <h1 className="text-xl">An unexpected error has occurred</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;