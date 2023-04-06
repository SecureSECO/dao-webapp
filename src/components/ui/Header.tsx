import { cn } from '@/src/lib/utils';
import React from 'react';

interface HeaderProps
  extends React.PropsWithChildren<
    Omit<React.HTMLAttributes<HTMLHeadingElement>, 'level'>
  > {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Header = ({ className, children, level = 1, ...props }: HeaderProps) => {
  const headerClasses = [
    'text-4xl font-bold leading-8',
    'text-2xl font-bold leading-6',
    'text-xl font-bold',
    'text-lg font-bold',
    'text-base font-bold',
    'text-sm font-bold',
  ];

  const headerTag = `h${level}`;

  // returns a header tag with the appropriate level (h1, h2, etc.), the appropriate class, the rest of the props and the children

  return React.createElement(
    headerTag,
    { className: cn(headerClasses[level - 1], className), ...props },
    children
  );
};

export default Header;
