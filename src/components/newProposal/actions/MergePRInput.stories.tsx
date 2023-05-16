/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withProposalAction } from '@/src/lib/decorators/proposalActionDecorator';
import type { Meta, StoryObj } from '@storybook/react';

import { MergePRInput } from './MergePRInput';

const meta: Meta<typeof MergePRInput> = {
  component: MergePRInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MergePRInput>;

export const Primary: Story = {
  parameters: {
    defaultValues: {
      actions: [
        {
          name: 'merge_pr',
          inputs: {
            url: 'https://github.com/pull/1',
          },
        },
      ],
    },
  },
  decorators: [withProposalAction],
};
