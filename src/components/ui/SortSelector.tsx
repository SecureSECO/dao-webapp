/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The SortSelector module provides a customizable, interactive component to
 * control the sort order and direction of a list of items.
 * It is built with the Dropdown, Button, and Tooltip components.
 */

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

type ProposalSortByString = 'CREATED_AT'; // | 'NAME' | 'POPULARITY' | 'VOTES';
const sortProps = [
  {
    value: 'CREATED_AT',
    icon: HiCalendar,
    label: 'Creation date',
  },
  // {
  //   value: 'NAME',
  //   icon: HiIdentification,
  //   label: 'Name',
  // },
  // {
  //   value: 'POPULARITY',
  //   icon: HiChartBar,
  //   label: 'Popularity',
  // },
  // {
  //   value: 'VOTES',
  //   icon: HiThumbUp,
  //   label: 'Votes',
  // },
];

// eslint vies the below as unused, but they are used in the JSX
// eslint-disable-next-line no-unused-vars
enum DirectionState {
  // eslint-disable-next-line no-unused-vars
  NONE,
  // eslint-disable-next-line no-unused-vars
  ASC,
  // eslint-disable-next-line no-unused-vars
  DESC,
}

/**
 * Increment the direction state to obtain the next direction in the cycle of the DirectionState enum  (NONE -> ASC -> DESC -> NONE)
 * @see DirectionState for the enum of directions this will cycle through
 * @param state The direction to increment
 * @returns The next direction in the cycle
 */
const incrementDirectionState = (state: DirectionState) => {
  // Increment to get the next direction inside of the  enum
  return (state + 1) % 3;
};

/**
 * The SortSelector component is used to set the sort order and direction of a list of proposals.
 * It includes a dropdown menu to choose the sorting method and a button to toggle the sort direction.
 * @param {Object} props - The properties for the SortSelector component.
 * @param {(sortBy: ProposalSortBy) => void} props.setSortBy - Callback to set the sort order.
 * @param {(direction: SortDirection | undefined) => void} props.setDirection - Callback to set the sort direction.
 * @returns A SortSelector React element.
 */
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

  // This code is used to set the direction of the table
  // It is used to set the direction state based on the direction selected
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
  }, [directionSelected]);

  return (
    <>
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
                  sortBySelected == prop.value && 'text-primary-highlight'
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
              iconNode={
                <div className="relative flex h-4 w-4 flex-col items-center justify-center">
                  <HiChevronUp
                    className={cn(
                      'h-3 w-3 shrink-0 transition-all duration-200',
                      directionSelected === DirectionState.ASC && 'scale-150',
                      directionSelected === DirectionState.DESC &&
                        'rotate-180 scale-150',
                      directionSelected === DirectionState.NONE && '-mb-0.5'
                    )}
                  />
                  <HiChevronDown
                    className={cn(
                      'h-3 w-3 shrink-0 transition-all duration-200',
                      (directionSelected === DirectionState.DESC ||
                        directionSelected === DirectionState.ASC) &&
                        'hidden rotate-180 scale-150',
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
    </>
  );
};

export default SortSelector;
