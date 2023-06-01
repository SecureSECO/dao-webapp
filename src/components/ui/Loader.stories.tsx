/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Loader from '@/src/components/ui/Loader';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Loader> = {
  component: Loader,
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Primary: Story = {
  args: {},
};
