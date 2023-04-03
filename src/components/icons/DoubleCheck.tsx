import React from 'react';

const DoubleCheck = (props: React.BaseHTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 7 17l-5-5"></path>
      <path d="m22 10-7.5 7.5L13 16"></path>
    </svg>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   fill="none"
    //   viewBox="0 0 24 24"
    //   strokeWidth="1.5"
    //   stroke="currentColor"
    //   {...props}
    // >
    //   <path
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //     d="M4.5 12.75l6 6 9-13.5"
    //     transform="translate(1,3)"
    //   />
    //   <path
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //     d="M4.5 12.75l6 6 9-13.5"
    //     transform="translate(0.5,-3)"
    //   />
    // </svg>
  );
};

export default DoubleCheck;
