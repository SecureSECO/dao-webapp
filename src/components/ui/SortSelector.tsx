import React, { useEffect, useState } from 'react';
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import {
  HiBarsArrowDown,
  HiCalendar,
  HiChartBar,
  HiChevronDown,
  HiIdentification,
} from 'react-icons/hi2';
import { HiThumbUp } from 'react-icons/hi';
import { cn } from '@/src/lib/utils';
import { ProposalSortBy, SortDirection } from '@aragon/sdk-client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';

type ProposalSortByString = 'CREATED_AT' | 'NAME' | 'POPULARITY' | 'VOTES';
const sortProps = [
  {
    value: 'CREATED_AT',
    icon: HiCalendar,
    label: 'Creation date',
  },
  {
    value: 'NAME',
    icon: HiIdentification,
    label: 'Name',
  },
  {
    value: 'POPULARITY',
    icon: HiChartBar,
    label: 'Popularity',
  },
  {
    value: 'VOTES',
    icon: HiThumbUp,
    label: 'Votes',
  },
];

const SortSelector = ({
  setSortBy,
  setDirection,
}: {
  setSortBy: (sortBy: ProposalSortBy) => void;
  setDirection: (direction: SortDirection) => void;
}) => {
  const [sortBySelected, setSortBySelected] =
    useState<ProposalSortByString>('CREATED_AT');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    setSortBy(ProposalSortBy[sortBySelected]);
  }, [sortBySelected]);

  return (
    <div className="flex flex-row items-center gap-x-2 rounded-md bg-slate-50 p-1 dark:bg-slate-700/50">
      <Dropdown>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle" size="sm" icon={HiBarsArrowDown} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuRadioGroup
            value={sortBySelected}
            onValueChange={(v) => setSortBySelected(v as ProposalSortByString)}
          >
            {sortProps.map((prop) => (
              <DropdownMenuRadioItem
                value={prop.value}
                className={cn(
                  'flex flex-row justify-start gap-x-2 hover:cursor-pointer',
                  sortBySelected == prop.value &&
                    'text-primary-500 dark:text-primary-400'
                )}
              >
                <prop.icon className="h-5 w-5" />
                {prop.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </Dropdown>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="subtle"
              size="sm"
              icon={HiChevronDown}
              iconRotation={sortAsc ? 0 : 180}
              onClick={() => {
                setSortAsc(!sortAsc);
                setDirection(sortAsc ? SortDirection.ASC : SortDirection.DESC);
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Sort {sortAsc ? 'ascending' : 'descending'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SortSelector;
