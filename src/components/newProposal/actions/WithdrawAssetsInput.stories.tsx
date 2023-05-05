/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withReactHookForm } from '@/src/lib/decorators/reactHookFormDecorator';
import type { Meta, StoryObj } from '@storybook/react';

import { WithdrawAssetsInput } from './WithdrawAssetsInput';

const meta: Meta<typeof WithdrawAssetsInput> = {
  component: WithdrawAssetsInput,
};

export default meta;

type Story = StoryObj<typeof WithdrawAssetsInput>;

export const Primary: Story = {
  args: {
    register: (() => {}) as any,
    prefix: 'actions.1.',
    errors: {},
    onRemove: (() => {}) as any,
  },
  decorators: [withReactHookForm],
};
