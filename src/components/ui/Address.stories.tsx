import type { Meta, StoryObj } from '@storybook/react';

import { Address } from './Address';

const meta: Meta<typeof Address> = {
  component: Address,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Address>;

const exampleAddress = '0x2B868C8ed12EAD37ef76457e7B6443192e231442';

export const Primary: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={20}
      hasLink={true}
      showCopy={true}
    />
  ),
};

export const MaxLengthVeryShort: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={2}
      hasLink={true}
      showCopy={true}
    />
  ),
};

export const NoLink: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={20}
      hasLink={false}
      showCopy={true}
    />
  ),
};

export const NoCopy: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={20}
      hasLink={true}
      showCopy={false}
    />
  ),
};

export const NoLinkNoCopy: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={20}
      hasLink={false}
      showCopy={false}
    />
  ),
};

export const HighMaxLength: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={2000}
      hasLink={true}
      showCopy={true}
    />
  ),
};
