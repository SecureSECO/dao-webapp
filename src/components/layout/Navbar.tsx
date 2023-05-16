/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import LogoFull from '@/src/components/LogoFull';
import ConnectButton from '@/src/components/layout/ConnectButton';
import ThemePicker from '@/src/components/layout/ThemePicker';
import { Button } from '@/src/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/Sheet';
import { cn } from '@/src/lib/utils';
import { createElement, useState } from 'react';
import { IconType } from 'react-icons';
import { FaDiscord } from 'react-icons/fa';
import { HiOutlineTerminal } from 'react-icons/hi';
import {
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiDocumentMagnifyingGlass,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineGlobeAlt,
  HiXMark,
} from 'react-icons/hi2';
import { NavLink, useLocation } from 'react-router-dom';

type NavItemPage = { label: string; url: string };
type NavItemPageWithIcon = NavItemPage & {
  icon: IconType;
  description?: string;
};
type NavItemCollection = {
  label: string;
  pages: NavItemPageWithIcon[];
  alternativeLinks?: NavItemPageWithIcon[];
};

type NavItem = NavItemPage | NavItemCollection;

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    url: '/',
  },
  {
    label: 'Governance',
    url: '/governance',
  },
  {
    label: 'Finance',
    url: '/finance',
  },
  {
    label: 'Verification',
    url: '/verification',
  },
  {
    label: 'SearchSECO',
    pages: [
      {
        label: 'Query',
        url: '/query',
        icon: HiOutlineDocumentMagnifyingGlass,
        description: 'Query the SearchSECO database using your $SECOINS',
      },
      {
        label: 'Mining',
        url: '/mining',
        icon: HiOutlineTerminal,
        description: 'Claim your mining rewards in $SECOINS or $SECOREP',
      },
    ],
    alternativeLinks: [
      { label: 'Website', url: '#', icon: HiOutlineGlobeAlt },
      { label: 'Discord', url: '#', icon: FaDiscord },
    ],
  },
  {
    label: 'Settings',
    url: '/settings',
  },
];

const Navitempage = ({
  item,
  className,
}: {
  item: NavItemPage;
  className?: string;
}) => {
  return (
    <NavLink
      key={item.label}
      to={item.url}
      className={({ isActive, isPending }) =>
        cn(
          'w-full select-none rounded-md px-4 py-2 text-lg font-semibold ring-ring ring-offset-2 ring-offset-background hover:bg-highlight/50 focus:outline-none focus:ring-2',
          isActive && 'bg-highlight text-primary shadow-md',
          isPending && '',
          className
        )
      }
    >
      {item.label}
    </NavLink>
  );
};

const Navitemcollection = ({
  item,
  className,
}: {
  item: NavItemCollection;
  className?: string;
}) => {
  const location = useLocation();
  console.log(location);
  const isActive = item.pages.some((x) => x.url === location.pathname);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full select-none items-center justify-center gap-x-1 rounded-md px-4 py-2 text-lg font-semibold leading-4 ring-ring ring-offset-2 ring-offset-background hover:cursor-pointer hover:bg-highlight/50 focus:outline-none focus:ring-2 data-[state=open]:bg-highlight/50',
          isActive && 'bg-highlight text-primary shadow-md ',
          className
        )}
      >
        {item.label}
        <HiChevronDown className="transi h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen max-w-xs origin-top flex-col divide-popover-foreground/10 rounded-3xl p-0 text-sm leading-5 shadow-lg">
        <DropdownMenuGroup>
          <DropdownContent item={item} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navitem = ({
  item,
  className,
}: {
  item: NavItem;
  className?: string;
}) => {
  if ((item as any).url)
    return <Navitempage item={item as NavItemPage} className={className} />;
  if ((item as any).pages)
    return (
      <Navitemcollection
        item={item as NavItemCollection}
        className={className}
      />
    );
  return <></>;
};

const Navbar = () => {
  return (
    <div className="mt-2 flex w-full flex-row-reverse items-center justify-between lg:mt-0 lg:flex-row">
      {/* Desktop logo */}
      <LogoFull className="hidden h-fit w-40 lg:block" />

      {/* Mobile nav */}
      <MobileNav />

      {/* Desktop nav */}
      <nav className="hidden px-4 py-6 lg:flex lg:flex-row lg:gap-x-2">
        {navItems.map((item) => (
          <Navitem key={item.label} item={item} />
        ))}
      </nav>

      {/* Wallet connection + dark mode toggler */}
      <div className="flex flex-row items-center gap-x-2">
        <ThemePicker />
        <ConnectButton />
      </div>
    </div>
  );
};

export const DropdownContent = ({ item }: { item: NavItemCollection }) => {
  return (
    <>
      <div className="p-2">
        {item.pages.map((page) => (
          <div
            key={page.label}
            className={cn(
              location.pathname == page.url
                ? 'text-primary dark:text-primary-highlight'
                : '',
              'group relative flex gap-x-6 rounded-lg p-4 transition-colors hover:bg-popover-foreground/5'
            )}
          >
            <div
              className={cn(
                location.pathname == page.url
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-popover-foreground/5 group-hover:bg-popover group-hover:text-primary',
                'mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg '
              )}
            >
              <page.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <NavLink to={page.url}>
                <span className=" font-semibold">{page.label}</span>
                <p className="opacity-80">{page.description}</p>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
      <div className="grid h-full w-full grid-cols-2 divide-x divide-popover-foreground/10 bg-popover-foreground/5">
        {item.alternativeLinks &&
          item.alternativeLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.url}
              className="flex items-center justify-center gap-x-2.5 p-3 font-semibold hover:bg-popover-foreground/20"
            >
              <item.icon
                className="h-5 w-5 flex-none opacity-80"
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          ))}
      </div>
    </>
  );
};

export default Navbar;

function MobileNav() {
  return (
    <nav className="relative lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div>
            <Button
              variant="outline"
              aria-label="Toggle site navigation"
              icon={HiBars3}
            />
            <span className="sr-only">Open</span>
          </div>
        </SheetTrigger>
        <SheetContent
          position="top"
          size="content"
          className="overflow-y-scroll"
        >
          {/* Mobile logo */}
          <div className="flex flex-col items-center space-y-4">
            <LogoFull className="h-fit w-32 xs:w-40" />
            {navItems.map((item) => (
              <Navitem item={item} className="text-center" />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Button variant="outline">Log in</Button>
            <Button>Download the app</Button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
