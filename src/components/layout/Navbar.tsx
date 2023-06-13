/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import LogoFull from '@/src/components/LogoFull';
import ConnectButton from '@/src/components/layout/ConnectButton';
import ThemePicker from '@/src/components/layout/ThemePicker';
import UserBalances from '@/src/components/layout/UserBalances';
import { Button } from '@/src/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import Header from '@/src/components/ui/Header';
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/Sheet';
import { DAO_METADATA } from '@/src/lib/constants/config';
import { TOKENS } from '@/src/lib/constants/tokens';
import { cn } from '@/src/lib/utils';
import { IconType } from 'react-icons';
import { FaDiscord } from 'react-icons/fa';
import { HiOutlineTerminal } from 'react-icons/hi';
import {
  HiArrowsRightLeft,
  HiBars3,
  HiChevronDown,
  HiOutlineBookOpen,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';

type NavItemPageData = { label: string; url: string };
type NavItemPageWithIcon = NavItemPageData & {
  icon: IconType;
  description?: string;
};

type NavItemCollectionCategory = {
  label: string;
  pages: NavItemPageWithIcon[];
};

type NavItemCollectionData = {
  label: string;
  // Categories are named groups of pages
  categories: NavItemCollectionCategory[];
  // Pages are rendered above the categories, without a collective label
  pages: NavItemPageWithIcon[];
  externalLinks?: NavItemPageWithIcon[];
};

type NavItemData = NavItemPageData | NavItemCollectionData;

const navItems: NavItemData[] = [
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
    label: 'Settings',
    url: '/settings',
  },
  {
    label: 'SecureSECO',
    pages: [
      {
        label: 'Docs',
        url: 'https://docs.secureseco.org/',
        icon: HiOutlineBookOpen,
        description: `Read the user documentation`,
      },
      {
        label: 'Swap',
        url: '/swap',
        icon: HiArrowsRightLeft,
        description: `Swap SECOIN tokens for DAI`,
      },
    ],
    categories: [
      {
        label: 'SearchSECO',
        pages: [
          {
            label: 'Query',
            url: '/query',
            icon: HiOutlineDocumentMagnifyingGlass,
            description: `Query the SearchSECO database using your ${TOKENS.secoin.symbol}`,
          },
          {
            label: 'Mining',
            url: '/mining',
            icon: HiOutlineTerminal,
            description: `Claim rewards for running SearchSECO miners`,
          },
        ],
      },
    ],
    externalLinks: [
      {
        label: 'Website',
        url: 'https://secureseco.org/',
        icon: HiOutlineGlobeAlt,
      },
      { label: 'Discord', url: DAO_METADATA.discord, icon: FaDiscord },
    ],
  },
];

interface NavItemPageProps extends Omit<NavLinkProps, 'to'> {
  item: NavItemPageData;
}

/**
 * Nav item as a link to a single page
 */
const NavItemPage = ({ item, className, ...props }: NavItemPageProps) => {
  return (
    <NavLink
      {...props}
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

interface NavItemCollectionProps extends Omit<NavLinkProps, 'to'> {
  item: NavItemCollectionData;
}

/**
 * Nav item as a dropdown menu with links to (possibly) multiple pages
 * The item may also contain alternative links (e.g. to external websites)
 */
const NavItemCollection = ({
  item,
  className,
  ...props
}: NavItemCollectionProps) => {
  const location = useLocation();
  const isActive = item.categories.some((c) =>
    c.pages.some((x) => x.url === location.pathname)
  );
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
      <DropdownMenuContent className="w-screen max-w-xs origin-top rounded-3xl overflow-hidden text-sm leading-5 shadow-lg">
        <DropdownMenuGroup>
          <NavItemCollectionContent item={item} {...props} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface NavItemProps extends Omit<NavLinkProps, 'to'> {
  item: NavItemData;
}

/**
 * Nav item as either a link to a single page or a dropdown menu with links to (possibly) multiple pages
 */
const NavItem = ({ item, className, ...props }: NavItemProps) => {
  if ((item as any).url)
    return (
      <NavItemPage
        item={item as NavItemPageData}
        {...props}
        className={className}
      />
    );
  if ((item as any).categories)
    return (
      <>
        <NavItemCollection
          {...props}
          item={item as NavItemCollectionData}
          className={cn(className, 'hidden lg:flex')}
        />
        <div className="w-full rounded-3xl overflow-hidden border border-border text-sm leading-5 shadow-lg md:col-span-2 lg:hidden">
          <NavItemCollectionContent
            {...props}
            title={item.label}
            item={item as NavItemCollectionData}
          />
        </div>
      </>
    );
  return <></>;
};

const Navbar = () => {
  return (
    <div className="mt-2 flex w-full items-center justify-between lg:mt-0">
      <NavLink
        to="/"
        className="rounded-md ring-ring ring-offset-2 ring-offset-background focus:outline-none focus:ring-2"
      >
        <LogoFull className="h-fit w-32 lg:w-40" />
      </NavLink>

      {/* Mobile nav */}
      <MobileNav />

      {/* Desktop nav */}
      <nav className="hidden px-4 py-6 lg:flex lg:flex-row lg:gap-x-2">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>

      {/* Wallet connection + dark mode toggler */}
      <div className="hidden items-center gap-x-2 lg:flex">
        <ThemePicker />

        <UserBalances />

        <ConnectButton />
      </div>
    </div>
  );
};

interface NavItemCollectionContentProps extends Omit<NavLinkProps, 'to'> {
  item: NavItemCollectionData;
  title?: string;
}

export const NavItemCollectionContent = ({
  title,
  item,
  className,
  ...props
}: NavItemCollectionContentProps) => {
  return (
    <div className={cn('w-full divide-popover-foreground/10', className)}>
      {title && (
        <Header level={2} className="px-6 pt-4">
          {title}
        </Header>
      )}
      <div className="px-3 py-2 space-y-1">
        {item.pages.map((page) => (
          <NavItemCollectionPage key={page.label} page={page} {...props} />
        ))}
        {item.categories.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center gap-x-2 px-2 justify-between">
              <div className="bg-popover-foreground/60 h-[0.1rem] grow" />
              <p className="w-fit text-base font-medium">{cat.label}</p>
              <div className="bg-popover-foreground/60 h-[0.1rem] grow" />
            </div>
            {cat.pages.map((page) => (
              <NavItemCollectionPage key={page.label} page={page} {...props} />
            ))}
          </div>
        ))}
      </div>
      <div className="grid h-full w-full grid-cols-2 divide-x divide-popover-foreground/10 bg-popover-foreground/5">
        {item.externalLinks &&
          item.externalLinks.map((item) => (
            // Note: use a instead? (for external links)
            <NavLink
              key={item.label}
              to={item.url}
              className="flex items-center justify-center gap-x-2.5 p-3 font-semibold hover:bg-popover-foreground/20 ring-ring rounded-md focus:outline-none focus:ring-2"
            >
              <item.icon
                className="h-5 w-5 flex-none opacity-80"
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          ))}
      </div>
    </div>
  );
};

interface NavItemCollectionPageProps extends Omit<NavLinkProps, 'to'> {
  page: NavItemPageWithIcon;
}

const NavItemCollectionPage = ({
  page,
  className,
  ...props
}: NavItemCollectionPageProps) => {
  return (
    <NavLink
      {...props}
      to={page.url}
      key={page.label}
      className={cn(
        className,
        'ring-ring ring-offset-2 ring-offset-popover focus:outline-none focus:ring-2 rounded-md transition-colors duration-200',
        location.pathname == page.url
          ? 'text-primary dark:text-primary-highlight'
          : '',
        'group relative flex gap-x-6 rounded-lg px-4 py-2 transition-colors hover:bg-popover-foreground/5'
      )}
    >
      <div
        className={cn(
          location.pathname == page.url
            ? 'bg-primary text-primary-foreground'
            : 'bg-popover-foreground/5 group-hover:bg-popover group-hover:text-primary',
          'flex h-11 w-11 flex-none items-center justify-center rounded-lg transition-colors duration-200'
        )}
      >
        <page.icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className=" font-semibold">{page.label}</span>
        <p className="opacity-80 leading-5">{page.description}</p>
      </div>
    </NavLink>
  );
};

export default Navbar;

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center gap-x-2 lg:hidden">
      <ThemePicker />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
          className="flex justify-center overflow-y-scroll"
        >
          <div className="mt-10 flex max-w-md flex-col items-center space-y-4 sm:mt-0">
            <div className="flex w-full items-center justify-between">
              <LogoFull className="h-fit w-32 xs:w-40" />
              <div className="flex items-center gap-x-2">
                <UserBalances />
                <ConnectButton buttonClassName={''} />
              </div>
            </div>

            <div className="grid w-full grid-cols-1 place-items-center gap-4 pb-6 md:grid-cols-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  className="text-center"
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
