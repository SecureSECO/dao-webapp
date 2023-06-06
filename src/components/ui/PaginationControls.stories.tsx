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
    setPageSize: (_) => undefined,
    getPageIndex: () => 2,
    setPageIndex: (_) => undefined,
    getPageCount: () => 5,
  },
};
