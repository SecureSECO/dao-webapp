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
import { cn } from '@/src/lib/utils';
import { HiBars3, HiChevronDown, HiXMark } from 'react-icons/hi2';
import { NavLink, useLocation } from 'react-router-dom';

type NavItemPage = { label: string; url: string };
type NavItemCollection = { label: string; pages: NavItemPage[] };
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
      { label: 'Query', url: '/query' },
      { label: 'Mining', url: '/mining' },
    ],
  },
  {
    label: 'Settings',
    url: '/settings',
  },
];

const Navitempage = ({ item }: { item: NavItemPage }) => {
  return (
    <NavLink
      key={item.label}
      to={item.url}
      className={({ isActive, isPending }) =>
        cn(
          'w-full rounded-md px-4 py-2 text-lg font-semibold ring-ring ring-offset-2 ring-offset-background focus:outline-none focus:ring-2',
          isActive && 'active bg-highlight text-primary shadow-md',
          isPending && ''
        )
      }
    >
      {item.label}
    </NavLink>
  );
};

const Navitemcollection = ({ item }: { item: NavItemCollection }) => {
  const location = useLocation();
  console.log(location);
  const isActive = item.pages.some((x) => x.url === location.pathname);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full flex-row items-center gap-x-1 rounded-md px-4 py-2 text-lg font-semibold leading-4 ring-ring ring-offset-2 ring-offset-background hover:cursor-pointer focus:outline-none focus:ring-2',
          isActive && 'active bg-highlight text-primary shadow-md'
        )}
      >
        {item.label}
        <HiChevronDown className="mt-1 h-5 w-5 group-data-[state=open]:hidden" />
        <HiXMark className="mt-1 h-5 w-5 group-data-[state=closed]:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -left-6 origin-top">
        <DropdownMenuGroup>
          {item.pages.map((page) => (
            <DropdownMenuItem key={page.label} className="hover:cursor-pointer">
              <Navitem item={page} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navitem = ({ item }: { item: NavItem }) => {
  if ((item as any).url) return <Navitempage item={item as NavItemPage} />;
  if ((item as any).pages)
    return <Navitemcollection item={item as NavItemCollection} />;
  return <></>;
};

const Navbar = () => {
  return (
    <div className="mt-2 flex w-full flex-row items-center justify-between lg:mt-0">
      {/* Desktop logo */}
      <LogoFull className="hidden h-fit w-40 lg:block" />

      {/* Mobile nav */}
      <nav className="relative lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="group" size="sm">
              <HiBars3 className="h-6 w-6 group-data-[state=open]:hidden" />
              <HiXMark className="h-6 w-6 group-data-[state=closed]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -left-6 origin-top">
            <DropdownMenuGroup>
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  className="hover:cursor-pointer"
                >
                  <Navitem item={item} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Mobile logo */}
      <LogoFull className="h-fit w-32 xs:w-40 lg:hidden" />

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

export default Navbar;
