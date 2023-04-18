import {
  AccordionContent,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { ReactNode, createElement } from 'react';
import { IconType } from 'react-icons';

const GeneralAction = ({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: IconType;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => {
  const iconNode = createElement(icon, {
    className: 'h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400',
  });

  return (
    <>
      <AccordionTrigger className="flex flex-row items-center gap-x-2">
        {iconNode}
        <div>
          <p className="text-lg">{title}</p>
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent asChild>{children}</AccordionContent>
    </>
  );
};

export default GeneralAction;
