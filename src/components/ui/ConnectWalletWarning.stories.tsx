/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ConnectWalletWarning from '@/src/components/ui/ConnectWalletWarning';

const meta = {
  component: ConnectWalletWarning,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ConnectWalletWarning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    action: 'to vote',
  },
};
