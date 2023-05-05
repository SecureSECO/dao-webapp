/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import MembersList from '@/src/components/dashboard/MembersList';

const meta = {
  component: MembersList,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof MembersList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    members: [
      {
        address: '0xD6E6C74C6054AD232C7A9833E89714EA39734A0F',
        bal: 2,
      },
      {
        address: '0xD42B4BA7E532E3947FB1829C22EAA7DE754D79A8',
        bal: 1,
      },
    ],
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    members: [
      {
        address: '0xD6E6C74C6054AD232C7A9833E89714EA39734A0F',
        bal: 2,
      },
      {
        address: '0xD42B4BA7E532E3947FB1829C22EAA7DE754D79A8',
        bal: 1,
      },
    ],
    loading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    members: [
      {
        address: '0xD6E6C74C6054AD232C7A9833E89714EA39734A0F',
        bal: 2,
      },
      {
        address: '0xD42B4BA7E532E3947FB1829C22EAA7DE754D79A8',
        bal: 1,
      },
    ],
    loading: true,
    error: 'Error loading members',
  },
};
