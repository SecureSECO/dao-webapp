/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import WithdrawAction from '@/src/components/proposal/actions/WithdrawAction';
import { Accordion } from '@/src/components/ui/Accordion';
import { dummyWithdrawActions } from '@/src/hooks/useProposal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: WithdrawAction,
  argTypes: {
    action: {
      table: {
        disable: true,
      },
    },
    asChild: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof WithdrawAction>;

export default meta;
type Story = StoryObj<typeof meta>;

const decorators = [
  (Story: any) => (
    <Accordion type="single" collapsible>
      <Story />
    </Accordion>
  ),
];

export const NativeToken: Story = {
  args: {
    value: 'first', // value is only for the accordion, unimportant
    action: dummyWithdrawActions[0],
  },
  decorators,
};

export const ERC20Token: Story = {
  args: {
    value: 'first', // value is only for the accordion, unimportant
    action: dummyWithdrawActions[1],
  },
  decorators,
};

export const ERC721Token: Story = {
  args: {
    value: 'first', // value is only for the accordion, unimportant
    action: dummyWithdrawActions[2],
  },
  decorators,
};

export const ERC1155Token: Story = {
  args: {
    value: 'first', // value is only for the accordion, unimportant
    action: dummyWithdrawActions[3],
  },
  decorators,
};

export const UnknownToken: Story = {
  args: {
    value: 'first',
    action: {
      ...dummyWithdrawActions[1],
      params: {
        ...dummyWithdrawActions[1].params,
        _contractAddress: '0x2222222222222222222222222222222222222222',
      },
    },
  },
  decorators,
};
