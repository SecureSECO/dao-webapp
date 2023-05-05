/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { HiPlus } from 'react-icons/hi2';

import { Button } from '@/src/components/ui/Button';

const meta = {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    label: 'Button',
    disabled: false,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    label: 'Button',
    disabled: false,
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    label: 'Button',
    disabled: false,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Button',
    disabled: false,
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    label: 'Button',
    disabled: false,
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'default',
    label: 'Button',
    disabled: false,
    icon: HiPlus,
  },
};

export const Clicked: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.hover(canvas.getByRole('button'));
    userEvent.click(canvas.getByRole('button'));
  },
};
