/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withProposalAction } from '@/src/lib/decorators/proposalActionDecorator';
import type { Meta, StoryObj } from '@storybook/react';

import { ChangeParamInput } from './ChangeParametersInput';

const meta: Meta<typeof ChangeParamInput> = {
  component: ChangeParamInput,
};

export default meta;
type Story = StoryObj<typeof ChangeParamInput>;

export const Primary: Story = {
  decorators: [withProposalAction],
};
