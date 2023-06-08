/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { PaginationControls } from './PaginationControls';

const meta: Meta<typeof PaginationControls> = {
  component: PaginationControls,
};

export default meta;
type Story = StoryObj<typeof PaginationControls>;

export const Primary: Story = {
  args: {
    getPageSize: () => 10,
    setPageSize: (n) => console.log(n),
    getPageIndex: () => 2,
    setPageIndex: (n) => console.log(n),
    getPageCount: () => 5,
    //Optionals:
    //Array of page sizes users can select
    selectablePageSizes: [10, 100],
    //The initial/default page size, will be set using setPageSize
    defaultPageSize: 12345,
    //Additional check for deciding if it is possible to go to the previous page
    getCanPreviousPage: () => true,
    //Additional check for deciding if it is possible to go to the next page
    getCanNextPage: () => true,
    //Override function for going to the previous page
    goPreviousPage: () => undefined,
    //Override function for going to the next page
    goNextPage: () => undefined,
  },
};
