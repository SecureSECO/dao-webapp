/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';

import { Button } from './Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

export type PaginationControlsProps = {
  getPageSize: () => number;
  setPageSize: (size: number) => void;
  getPageIndex: () => number;
  setPageIndex: (index: number) => void;
  getPageCount: () => number | undefined | null;

  //Array of page sizes users can select
  selectablePageSizes?: number[];
  //The initial/default page size, will be set using setPageSize
  defaultPageSize?: number;
  //Additional check for deciding if it is possible to go to the previous page
  getCanPreviousPage?: () => boolean;
  //Additional check for deciding if it is possible to go to the next page
  getCanNextPage?: () => boolean;
  //Override function for going to the previous page
  goPreviousPage?: () => void;
  //Override function for going to the next page
  goNextPage?: () => void;
};

export const PaginationControls = ({
  getPageSize,
  setPageSize,
  getPageIndex,
  setPageIndex,
  getPageCount,
  getCanPreviousPage,
  getCanNextPage,
  goPreviousPage,
  goNextPage,
  defaultPageSize,
  selectablePageSizes: selectablePageSizes = [10, 25, 50, 100],
}: PaginationControlsProps) => {
  useEffect(() => {
    if (defaultPageSize) {
      setPageSize(defaultPageSize);
    }
  }, []);

  const canNextPage =
    (getPageCount() ? getPageIndex() < getPageCount()! - 1 : true) &&
    (getCanNextPage ? getCanNextPage() : true);
  const canPreviousPage =
    getPageIndex() > 0 && (getCanPreviousPage ? getCanPreviousPage() : true);

  const previousPage = () =>
    goPreviousPage ? goPreviousPage() : setPageIndex(getPageIndex() - 1);
  const nextPage = () =>
    goNextPage ? goNextPage() : setPageIndex(getPageIndex() + 1);

  return (
    <div className="flex flex-row items-center justify-end sm:justify-between px-2 w-full">
      <div className="hidden items-center space-x-2 sm:flex">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${getPageSize()}`}
          onValueChange={(value) => {
            setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={getPageSize()} />
          </SelectTrigger>
          <SelectContent side="top">
            {selectablePageSizes.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="items-center justify-center text-sm font-medium flex">
          {`Page ${getPageIndex() + 1}`}
          {getPageCount() && ` of ${getPageCount()}`}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden xs:flex"
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <HiChevronDoubleLeft className="h-4 w-4 shrink-0" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <HiChevronLeft className="h-4 w-4 shrink-0" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <HiChevronRight className="h-4 w-4 shrink-0" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden xs:flex"
            onClick={() => setPageIndex(getPageCount()! - 1)}
            disabled={!canNextPage || !getPageCount()}
          >
            <span className="sr-only">Go to last page</span>
            <HiChevronDoubleRight className="h-4 w-4 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
};
