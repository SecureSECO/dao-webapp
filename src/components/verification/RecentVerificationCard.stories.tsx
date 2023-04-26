/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BigNumber } from 'ethers';
import RecentVerificationCard from '@/src/components/verification/RecentVerificationCard';
import { VerificationHistory } from '@/src/pages/Verification';

const meta = {
  component: RecentVerificationCard,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof RecentVerificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const history: VerificationHistory = {
  id: '0x0',
  timestamp: 1682537423,
  isExpired: false,
  stamp: ['github', '0x0', [BigNumber.from(Math.floor(Date.now() / 1000))]],
};

export const Default: Story = {
  args: {
    history,
  },
};
