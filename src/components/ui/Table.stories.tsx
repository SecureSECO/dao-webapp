/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Table } from '@/src/components/ui/Table';
import { dummyQueryResult } from '@/src/hooks/useSearchSECO';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Table,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: [
      { header: 'Hash', accessor: 'method_hash' },
      { header: 'File Name', accessor: 'file' },
      {
        header: 'Function Name',
        accessor: 'method_name',
      },
      { header: 'Line Number', accessor: 'lineNumber' },
    ],
    data: dummyQueryResult.methodData,
  },
};

export const TooMuchData: Story = {
  args: {
    columns: [
      { header: 'Hash', accessor: 'method_hash' },
      { header: 'File Name', accessor: 'file' },
      {
        header: 'Function Name',
        accessor: 'method_name',
      },
      { header: 'Line Number', accessor: 'lineNumber' },
    ],
    rowLimit: 10,
    data: [
      ...dummyQueryResult.methodData,
      ...dummyQueryResult.methodData,
      ...dummyQueryResult.methodData,
    ],
  },
};
