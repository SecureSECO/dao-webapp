import type { Meta, StoryObj } from '@storybook/react';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from './Tooltip';
import { Button } from './Button';

const meta: Meta<typeof Tooltip> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="default">Hover over me!</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is an example tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
