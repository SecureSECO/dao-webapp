/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
