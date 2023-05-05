/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@/src/components/ui/Input';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';

const meta: Meta<typeof Input> = {
  tags: ['autodocs'],
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  args: {
    placeholder: 'Placeholder text',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <ErrorWrapper name={'textarea'} error={undefined}>
          <Story />
        </ErrorWrapper>
      </div>
    ),
  ],
};

export const Error: Story = {
  args: {
    placeholder: 'Placeholder text',
    error: {
      type: 'required',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <ErrorWrapper
          name={'textarea'}
          error={{
            type: 'required',
          }}
        >
          <Story />
        </ErrorWrapper>
      </div>
    ),
  ],
};
