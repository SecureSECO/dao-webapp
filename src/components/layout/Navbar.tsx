import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import LogoFull from '@/src/components/LogoFull';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import ThemePicker from '@/src/components/layout/ThemePicker';
import ConnectButton from '@/src/components/layout/ConnectButton';
import { Button } from '@/src/components/ui/Button';

type NavItem = {
  label: string;
  url: string;
};

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
    label: 'Community',
    url: '/community',
  },
  {
    label: 'Settings',
    url: '/settings',
  },
];

const Navitem = ({ item }: { item: NavItem }) => {
  return (
    <NavLink
      key={item.label}
      to={item.url}
      className={({ isActive, isPending }) =>
        cn(
          'rounded-md py-2 px-4 text-lg font-semibold dark:text-slate-400',
          isActive &&
            'bg-white text-primary shadow-md dark:bg-slate-800 dark:text-primary-500',
          isPending && ''
        )
      }
    >
      {item.label}
    </NavLink>
  );
};

const Navbar = () => {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      {/* Desktop logo */}
      <LogoFull className="hidden h-fit w-40 lg:block" />

      {/* Mobile nav */}
      <nav className="relative lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="subtle" className="group">
              <HiBars3 className="h-8 w-8 group-data-[state=open]:hidden" />
              <HiXMark className="h-8 w-8 group-data-[state=closed]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -left-8 origin-top">
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
      <LogoFull className="h-fit w-40 lg:hidden" />

      {/* Desktop nav */}
      <nav className="hidden px-4 py-6 lg:flex lg:flex-row">
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
