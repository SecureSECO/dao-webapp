/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import {
  ConditionalButton,
  ConnectWalletWarning,
  InsufficientRepWarning,
} from './ConditionalButton';

const meta: Meta<typeof ConditionalButton> = {
  component: ConditionalButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConditionalButton>;

export const Primary: Story = {
  args: {
    label: 'Perform action',
    conditions: [],
  },
};

export const ConnectWalletWarningStory: Story = {
  args: {
    label: 'Perform action',
    conditions: [
      { enabled: true, content: <ConnectWalletWarning action="to vote" /> },
    ],
  },
};

export const InsufficientRepWarningStory: Story = {
  args: {
    label: 'Perform action',
    conditions: [
      { enabled: true, content: <InsufficientRepWarning action="to vote" /> },
    ],
  },
};
