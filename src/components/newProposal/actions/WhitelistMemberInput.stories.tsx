/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withProposalAction } from '@/src/lib/decorators/proposalActionDecorator';
import type { Meta, StoryObj } from '@storybook/react';

import { WhitelistMemberInput } from './WhitelistMemberInput';

const meta: Meta<typeof WhitelistMemberInput> = {
  component: WhitelistMemberInput,
};

export default meta;
type Story = StoryObj<typeof WhitelistMemberInput>;

export const Primary: Story = {
  parameters: {
    defaultValues: {
      actions: [
        {
          name: 'whitelist_member',
          address: '0x123456789012345678901234567890',
        },
      ],
    },
  },
  decorators: [withProposalAction],
};
