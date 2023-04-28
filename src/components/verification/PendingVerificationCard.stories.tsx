/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PendingVerification } from '@/src/pages/Verification';
import PendingVerificationCard from './PendingVerificationCard';

const meta = {
  component: PendingVerificationCard,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof PendingVerificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const pendingVerifications: PendingVerification[] = [
  {
    addressToVerify: '0x2f8Ac045D67209DcC0D7E44bf1ca8bAa4F69E211',
    hash: '090d4910f4b4038000f6ea86644d55cb5261a1dc1f006d928dcc049b157daff8',
    timestamp: Math.floor(Date.now() / 1000).toString(),
    providerId: 'github',
    sig: '0x828d3d376f176352d17758a5d7249b3cc508411a60783c99d25f29ac8c0c673812d193e4a685aaefae746589d030745e535309139f699e6b13a165b257d53edf1b',
  },
  {
    addressToVerify: '0x2f8Ac045D67209DcC0D7E44bf1ca8bAa4F69E211',
    hash: '090d4910f4b4038000f6ea86644d55cb5261a1dc1f006d928dcc049b157daff8',
    timestamp: '0',
    providerId: 'github',
    sig: '0x828d3d376f176352d17758a5d7249b3cc508411a60783c99d25f29ac8c0c673812d193e4a685aaefae746589d030745e535309139f699e6b13a165b257d53edf1b',
  },
];

export const Default: Story = {
  args: {
    pendingVerifications,
    verification: pendingVerifications[0],
    refetch: () => {},
    setPendingVerifications: () => {},
  },
};

// Note: expired verifications are not even shown in the list (after refresh)
export const Expired: Story = {
  args: {
    pendingVerifications,
    verification: pendingVerifications[1],
    refetch: () => {},
    setPendingVerifications: () => {},
  },
};
