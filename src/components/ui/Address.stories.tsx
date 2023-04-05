import type { Meta, StoryObj } from '@storybook/react';

import { Address, AddressLength } from './Address';

const meta: Meta<typeof Address> = {
  component: Address,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Address>;

const exampleAddress = '0x2B868C8ed12EAD37ef76457e7B6443192e231442';

export const Medium: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.medium}
      hasLink={true}
      showCopy={true}
    />
  ),
};

export const Small: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.small}
      hasLink={true}
      showCopy={true}
    />
  ),
};

export const Large: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.large}
      hasLink={true}
      showCopy={true}
    />
  ),
};

export const Full: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.full}
      hasLink={true}
      showCopy={true}
    />
  ),
};

export const NoLink: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.medium}
      hasLink={false}
      showCopy={true}
    />
  ),
};

export const NoCopy: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.medium}
      hasLink={true}
      showCopy={false}
    />
  ),
};

export const NoLinkNoCopy: Story = {
  render: () => (
    <Address
      address={exampleAddress}
      maxLength={AddressLength.medium}
      hasLink={false}
      showCopy={false}
    />
  ),
};
