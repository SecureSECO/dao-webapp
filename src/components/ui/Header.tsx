import { cn } from '@/src/lib/utils';
import React from 'react';

export interface HeaderProps
  extends React.BaseHTMLAttributes<HTMLHeadingElement> {}

const Header = ({ className, children, ...props }: HeaderProps) => {
  return (
    <h1 className={cn(className, 'text-4xl font-bold')} {...props}>
      {children}
    </h1>
  );
};

export default Header;
