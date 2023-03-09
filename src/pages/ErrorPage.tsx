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
