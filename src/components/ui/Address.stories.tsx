/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Address, AddressLength } from './Address';
import { addWagmiClientDecorator } from '@/src/lib/decorators/addWagmiClientDecorator';

const meta: Meta<typeof Address> = {
  component: Address,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Address>;

const exampleAddress = '0x2B868C8ed12EAD37ef76457e7B6443192e231442';

export const Medium: Story = {
  args: {
    address: exampleAddress,
    maxLength: AddressLength.Medium,
    hasLink: true,
    showCopy: true,
  },
  decorators: [addWagmiClientDecorator],
};

export const Small: Story = {
  args: {
    ...Medium.args,
    maxLength: AddressLength.Small,
  },
  decorators: [addWagmiClientDecorator],
};

export const Large: Story = {
  args: {
    ...Medium.args,
    maxLength: AddressLength.Large,
  },
  decorators: [addWagmiClientDecorator],
};

export const Full: Story = {
  args: {
    ...Medium.args,
    maxLength: AddressLength.Full,
  },
  decorators: [addWagmiClientDecorator],
};

export const NoLink: Story = {
  args: {
    ...Medium.args,
    hasLink: false,
  },
  decorators: [addWagmiClientDecorator],
};

export const NoCopy: Story = {
  args: {
    ...Medium.args,
    showCopy: false,
  },
  decorators: [addWagmiClientDecorator],
};

export const NoLinkNoCopy: Story = {
  args: {
    ...Medium.args,
    showCopy: false,
    hasLink: false,
  },
  decorators: [addWagmiClientDecorator],
};