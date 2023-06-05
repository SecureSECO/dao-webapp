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

import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { cn } from '@/src/lib/utils';
import {
  ProposalSorting,
  SortingOrder,
} from '@plopmenz/diamond-governance-sdk';
import { HiThumbUp } from 'react-icons/hi';
import {
  HiBarsArrowDown,
  HiCalendar,
  HiChevronDown,
  HiChevronUp,
  HiIdentification,
} from 'react-icons/hi2';

type ProposalSortingString = 'Creation' | 'Title' | 'TotalVotes';
const sortProps = [
  {
    value: 'Creation',
    icon: HiCalendar,
    label: 'Creation date',
  },
  {
    value: 'Title',
    icon: HiIdentification,
    label: 'Title',
  },
  {
    value: 'TotalVotes',
    icon: HiThumbUp,
    label: 'Votes',
  },
];

// eslint vies the below as unused, but they are used in the JSX
// eslint-disable-next-line no-unused-vars
enum SortOrderState {
  // eslint-disable-next-line no-unused-vars
  None,
  // eslint-disable-next-line no-unused-vars
  Asc,
  // eslint-disable-next-line no-unused-vars
  Desc,
}

/**
 * Increment the direction state to obtain the next direction in the cycle of the DirectionState enum  (None -> Asc -> Desc -> None)
 * @see SortOrderState for the enum of directions this will cycle through
 * @param state The direction to increment
 * @returns The next direction in the cycle
 */
const incrementSortOrder = (state: SortOrderState) => {
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
  setSorting,
  setOrder,
}: {
  // eslint-disable-next-line no-unused-vars
  setSorting: (sorting: ProposalSorting) => void;
  // eslint-disable-next-line no-unused-vars
  setOrder: (order: SortingOrder | undefined) => void;
}) => {
  const [sortingSelected, setSortingSelected] =
    useState<ProposalSortingString>('Creation');
  const [orderSelected, setOrderSelected] = useState<SortOrderState>(
    SortOrderState.None
  );

  useEffect(() => {
    setSorting(ProposalSorting[sortingSelected]);
  }, [sortingSelected]);

  // This code is used to set the sorting order for the call to GetProposals
  useEffect(() => {
    switch (orderSelected) {
      case SortOrderState.None:
        setOrder(undefined);
        break;
      case SortOrderState.Asc:
        setOrder(SortingOrder.Asc);
        break;
      case SortOrderState.Desc:
        setOrder(SortingOrder.Desc);
        break;
    }
  }, [orderSelected]);

  return (
    <>
      <Dropdown>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle" size="sm" icon={HiBarsArrowDown} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuRadioGroup
            value={sortingSelected}
            onValueChange={(v) =>
              setSortingSelected(v as ProposalSortingString)
            }
          >
            {sortProps.map((prop) => (
              <DropdownMenuRadioItem
                key={prop.value}
                value={prop.value}
                className={cn(
                  'flex flex-row justify-start gap-x-2 hover:cursor-pointer',
                  sortingSelected == prop.value && 'text-primary-highlight'
                )}
              >
                <prop.icon className="h-5 w-5" />
                {prop.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </Dropdown>

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
                    orderSelected === SortOrderState.Asc && 'scale-150',
                    orderSelected === SortOrderState.Desc &&
                      'rotate-180 scale-150',
                    orderSelected === SortOrderState.None && '-mb-0.5'
                  )}
                />
                <HiChevronDown
                  className={cn(
                    'h-3 w-3 shrink-0 transition-all duration-200',
                    (orderSelected === SortOrderState.Desc ||
                      orderSelected === SortOrderState.Asc) &&
                      'hidden rotate-180 scale-150',
                    orderSelected === SortOrderState.None && '-mt-0.5'
                  )}
                />
              </div>
            }
            onClick={() => {
              setOrderSelected(incrementSortOrder(orderSelected));
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Sort{' '}
            {orderSelected === SortOrderState.Asc ? 'ascending' : 'descending'}
          </p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default SortSelector;
