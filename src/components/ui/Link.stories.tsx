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
