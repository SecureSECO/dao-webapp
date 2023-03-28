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
  HiChevronUp,
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

// eslint-disable-next-line no-unused-vars
enum DirectionState {
  // eslint-disable-next-line no-unused-vars
  NONE,
  // eslint-disable-next-line no-unused-vars
  ASC,
  // eslint-disable-next-line no-unused-vars
  DESC,
}

const incrementDirectionState = (state: DirectionState) => {
  return (state + 1) % 3;
};

const SortSelector = ({
  setSortBy,
  setDirection,
}: {
  // eslint-disable-next-line no-unused-vars
  setSortBy: (sortBy: ProposalSortBy) => void;
  // eslint-disable-next-line no-unused-vars
  setDirection: (direction: SortDirection | undefined) => void;
}) => {
  const [sortBySelected, setSortBySelected] =
    useState<ProposalSortByString>('CREATED_AT');
  const [directionSelected, setDirectionSelected] = useState<DirectionState>(
    DirectionState.NONE
  );

  useEffect(() => {
    setSortBy(ProposalSortBy[sortBySelected]);
  }, [sortBySelected]);

  useEffect(() => {
    switch (directionSelected) {
      case DirectionState.NONE:
        setDirection(undefined);
        break;
      case DirectionState.ASC:
        setDirection(SortDirection.ASC);
        break;
      case DirectionState.DESC:
        setDirection(SortDirection.DESC);
        break;
    }
    console.log('Direction: ', DirectionState[directionSelected]);
  }, [directionSelected]);

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
                key={prop.value}
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
          <TooltipTrigger asChild>
            <Button
              variant="subtle"
              size="sm"
              className="w-8"
              iconNode={
                <div className="relative flex flex-col items-center justify-center">
                  <HiChevronUp
                    className={cn(
                      'h-3 w-3 transition-all duration-200',
                      directionSelected === DirectionState.ASC && 'scale-150',
                      directionSelected === DirectionState.DESC &&
                        'rotate-180 scale-150',
                      directionSelected === DirectionState.NONE && '-mb-0.5'
                    )}
                  />
                  <HiChevronDown
                    className={cn(
                      'h-3 w-3 transition-all duration-200',
                      (directionSelected === DirectionState.DESC ||
                        directionSelected === DirectionState.ASC) &&
                        'hidden rotate-180',
                      directionSelected === DirectionState.NONE && '-mt-0.5'
                    )}
                  />
                </div>
              }
              onClick={() => {
                setDirectionSelected(
                  incrementDirectionState(directionSelected)
                );
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Sort{' '}
              {directionSelected === DirectionState.ASC
                ? 'ascending'
                : 'descending'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SortSelector;
