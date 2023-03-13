import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import LogoFull from '@/src/components/LogoFull';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import ThemePicker from '@/src/components/ThemePicker';
import ConnectButton from '@/src/components/ConnectButton';

type NavItem = {
  label: string;
  url: string;
};

const navItems: NavItem[] = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Governance',
    url: '/governance',
  },
];

const Navitem = ({ item }: { item: NavItem }) => {
  return (
    <NavLink
      key={item.label}
      to={item.url}
      className={({ isActive, isPending }) =>
        cn(
          'py-1 px-4 text-lg font-semibold text-slate-500',
          isActive && 'rounded-md bg-slate-100 text-blue-500',
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
    <div className="flex w-full flex-row items-center justify-between px-4">
      {/* Desktop logo */}
      <LogoFull className="hidden h-fit w-40 sm:block" />

      {/* Mobile nav */}
      <nav className="sm:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group hover:cursor-pointer">
            <HiBars3 className="h-10 w-10 group-data-[state=open]:hidden" />
            <HiXMark className="h-10 w-10 group-data-[state=closed]:hidden" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal className="absolute left-0 top-0">
            <DropdownMenu.Content sideOffset={4}>
              {navItems.map((item) => (
                <DropdownMenu.Item
                  key={item.label}
                  className="hover:cursor-pointer"
                >
                  <Navitem item={item} />
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </nav>

      {/* Mobile logo */}
      <LogoFull className="h-fit w-52 sm:hidden" />

      {/* Desktop nav */}
      <nav className="hidden sm:flex sm:flex-row">
        {navItems.map((item) => (
          <Navitem key={item.label} item={item} />
        ))}
      </nav>

      {/* Wallet connection + dark mode toggler */}
      <div className="flex flex-row gap-x-2">
        <ThemePicker />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
