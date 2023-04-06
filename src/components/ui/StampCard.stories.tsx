import type { Meta, StoryObj } from '@storybook/react';
import StampCard from './StampCard';
import { AiFillGithub } from 'react-icons/ai';
import { BigNumber } from 'ethers';

const meta = {
  component: StampCard,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof StampCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Verified: Story = {
  args: {
    stampInfo: {
      displayName: 'GitHub',
      icon: <AiFillGithub />,
      id: 'github',
      url: 'https://github.com',
    },
    stamp: ['github', '0x0', [BigNumber.from(Math.floor(Date.now() / 1000))]],
    thresholdHistory: [[BigNumber.from(0), BigNumber.from(60)]],
    verify: () => {},
  },
};

export const Expired: Story = {
  args: {
    stampInfo: {
      displayName: 'GitHub',
      icon: <AiFillGithub />,
      id: 'github',
      url: 'https://github.com',
    },
    stamp: ['github', '0x0', [BigNumber.from(Math.floor(Date.now() / 1000))]],
    thresholdHistory: [[BigNumber.from(0), BigNumber.from(0)]],
    verify: () => {},
  },
};

export const Unverified: Story = {
  args: {
    stampInfo: {
      displayName: 'GitHub',
      icon: <AiFillGithub />,
      id: 'github',
      url: 'https://github.com',
    },
    stamp: ['github', '0x0', []],
    thresholdHistory: [[BigNumber.from(0), BigNumber.from(60)]],
    verify: () => {},
  },
};
