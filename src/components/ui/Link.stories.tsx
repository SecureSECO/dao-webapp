/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { Link } from './Link';

const meta: Meta<typeof Link> = {
  component: Link,
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Primary: Story = {
  render: () => (
    <MemoryRouter>
      <Link to="http://www.example.com" label="Go to some place" />
    </MemoryRouter>
  ),
};