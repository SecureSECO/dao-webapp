import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import LogoFull from '@/src/components/LogoFull';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HiBars3, HiXMark } from 'react-icons/hi2';

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

const Navbar = () => {
  return (
    <div className="flex w-full flex-row justify-between">
      {/* Desktop logo */}
      <LogoFull className="hidden h-40 w-40 sm:block" />

      {/* Mobile nav */}
      <nav className="sm:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="group hover:cursor-pointer">
            <HiBars3 className="h-10 w-10 group-data-[state=open]:hidden" />
            <HiXMark className="h-10 w-10 group-data-[state=closed]:hidden" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              {navItems.map((item) => (
                <DropdownMenu.Item>
                  <NavLink
                    key={item.label}
                    to={item.url}
                    className={({ isActive, isPending }) =>
                      cn('', isActive && '', isPending && '')
                    }
                  >
                    {item.label}
                  </NavLink>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </nav>

      {/* Mobile logo */}
      <LogoFull className="h-40 w-40 sm:hidden" />

      {/* Desktop nav */}
      <nav className="hidden gap-x-4 sm:flex sm:flex-row">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.url}
            className={({ isActive, isPending }) =>
              cn('', isActive && '', isPending && '')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Wallet connection */}
      <div></div>
    </div>
  );
};

export default Navbar;
