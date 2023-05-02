/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withReactHookForm } from '@/src/lib/decorators/reactHookFormDecorator';
import type { Meta, StoryObj } from '@storybook/react';

import { MintTokensInput } from './MintTokensInput';

const meta: Meta<typeof MintTokensInput> = {
  component: MintTokensInput,
};

export default meta;
type Story = StoryObj<typeof MintTokensInput>;

export const Primary: Story = {
  args: {
    register: (() => {}) as any,
    prefix: 'actions.0',
    errors: undefined,
    onRemove: (() => {}) as any,
    getValues: (() => {}) as any,
  },
  parameters: {
    defaultValues: {
      actions: [
        {
          name: 'mint_tokens',
          wallets: [
            { address: '0x123456789012345678901234567890', amount: 321 },
          ],
        },
      ],
    },
  },
  decorators: [withReactHookForm],
};
