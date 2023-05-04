/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Button } from '@/src/components/ui/Button';
import type { Meta, StoryObj } from '@storybook/react';

import { MainCard } from '@/src/components/ui/MainCard';
import { HiInbox } from 'react-icons/hi2';

const meta: Meta<typeof MainCard> = {
  component: MainCard,
  argTypes: {
    aside: {
      table: {
        disable: true,
      },
    },
    header: {
      table: {
        disable: true,
      },
    },
    icon: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainCard>;

export const Default: Story = {
  args: {
    icon: HiInbox,
    header: <p className="text-xl">Example title</p>,
    aside: (
      <Button
        label="Click me!"
        onClick={() => console.log('I have been clicked!')}
      />
    ),
  },
};

export const Light: Story = {
  args: {
    icon: HiInbox,
    header: <p className="text-xl">Example title</p>,
    variant: 'light',
    aside: (
      <Button
        label="Click me!"
        onClick={() => console.log('I have been clicked!')}
      />
    ),
  },
};

export const Outline: Story = {
  args: {
    icon: HiInbox,
    header: <p className="text-xl">Example title</p>,
    variant: 'outline',
    aside: (
      <Button
        label="Click me!"
        onClick={() => console.log('I have been clicked!')}
      />
    ),
  },
};

export const Warning: Story = {
  args: {
    icon: HiInbox,
    header: <p className="text-xl">Example title</p>,
    variant: 'warning',
    aside: (
      <Button
        label="Click me!"
        onClick={() => console.log('I have been clicked!')}
      />
    ),
  },
};
