/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BigNumber } from 'ethers';

import { MaxButton } from './MaxButton';

const meta: Meta<typeof MaxButton> = {
  component: MaxButton,
};

export default meta;
type Story = StoryObj<typeof MaxButton>;

export const Primary: Story = {
  args: {
    decimals: 4,
    max: BigNumber.from(1234567),
    setMaxValue: () => {},
  },
};
