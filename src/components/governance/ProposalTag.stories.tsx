/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ProposalTag from '@/src/components/governance/ProposalTag';
import { ACTIONS } from '@/src/lib/constants/actions';
import { countdownText } from '@/src/lib/utils/date';
import type { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';

const meta = {
  component: ProposalTag,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ProposalTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Countdown: Story = {
  args: {
    variant: 'countdown',
    children: 'Ends in ' + countdownText(addDays(new Date(), 2)),
  },
};

export const YesVotes: Story = {
  args: {
    variant: 'yes',
    children: '16.66%',
  },
};

export const NoVotes: Story = {
  args: {
    variant: 'no',
    children: '0%',
  },
};

export const MintActionTag: Story = {
  args: {
    variant: 'action',
    children: ACTIONS.mint_tokens.label,
    icon: ACTIONS.mint_tokens.icon,
  },
};

export const WithdrawActionTag: Story = {
  args: {
    variant: 'action',
    children: ACTIONS.withdraw_assets.label,
    icon: ACTIONS.withdraw_assets.icon,
  },
};

export const MergeActionTag: Story = {
  args: {
    variant: 'action',
    children: ACTIONS.merge_pr.label,
    icon: ACTIONS.merge_pr.icon,
  },
};

export const ChangeParamsActionTag: Story = {
  args: {
    variant: 'action',
    children: ACTIONS.change_param.label,
    icon: ACTIONS.change_param.icon,
  },
};
