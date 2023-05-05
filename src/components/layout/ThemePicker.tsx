/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import { useEffect, useState } from 'react';
import { HiComputerDesktop, HiMoon, HiSun } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import { cn } from '@/src/lib/utils';

type Theme = 'dark' | 'light' | 'system';
type ThemeOption = {
  value: Theme;
  label: string;
  icon: IconType;
};
const themes: ThemeOption[] = [
  {
    value: 'dark',
    label: 'Dark',
    icon: HiMoon,
  },
  {
    value: 'light',
    label: 'Light',
    icon: HiSun,
  },
  {
    value: 'system',
    label: 'System',
    icon: HiComputerDesktop,
  },
];

const ThemePicker = () => {
  const [currentTheme, setCurrentTheme] = useState('system');

  // If theme is set in localStorage, use that
  useEffect(() => {
    if ('theme' in localStorage) setCurrentTheme(localStorage.theme);
  }, []);

  useEffect(() => {
    switch (currentTheme) {
      case 'dark':
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        break;
      case 'light':
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        break;
      case 'system':
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
          document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');
        break;
    }
  }, [currentTheme]);

  return (
    <Dropdown>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <HiMoon className="hidden h-5 w-5 dark:block" />
          <HiSun className="h-5 w-5 dark:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -right-5 origin-top">
        <DropdownMenuRadioGroup
          value={currentTheme}
          onValueChange={setCurrentTheme}
        >
          {themes.map((theme) => (
            <DropdownMenuRadioItem
              key={theme.value}
              value={theme.value}
              className={cn(
                'flex flex-row justify-start gap-x-2 hover:cursor-pointer',
                theme.value == currentTheme && 'text-primary'
              )}
            >
              <theme.icon className="h-5 w-5" />
              {theme.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </Dropdown>
  );
};

export default ThemePicker;
