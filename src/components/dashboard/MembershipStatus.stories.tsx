/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';

import { MembershipStatusView } from './MembershipStatus';

const meta: Meta<typeof MembershipStatusView> = {
  component: MembershipStatusView,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MembershipStatusView>;

export const NotConnected: Story = {
  args: { isConnected: false, verification: null },
};

export const IncorrectNetworkCanNotSwitch: Story = {
  args: { isConnected: true, chainId: 0.01 },
};

export const IncorrectNetworkCanSwitch: Story = {
  args: {
    isConnected: true,
    chainId: 0.01,
    switchNetwork: undefined,
  },
};

export const NotMember: Story = {
  args: { isConnected: true, verification: null },
};

export const AlmostExpired: Story = {
  args: {
    isConnected: true,
    verification: [{ expiration: addDays(new Date(), -10) }],
  },
};

export const Expired: Story = {
  args: {
    isConnected: true,
    verification: [{ expiration: addDays(new Date(), 10) }],
  },
};

export const AllOk: Story = {
  args: {
    isConnected: true,
    verification: [{ expiration: addDays(new Date(), -100) }],
  },
  decorators: [
    (Story) => (
      <div>
        This is just an empty element, nothing should be visible below this.
        <Story />
      </div>
    ),
  ],
};
