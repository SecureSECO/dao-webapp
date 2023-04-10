/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';

const meta = {
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Primary: Story = {
  args: {
    type: 'single',
    collapsible: true,
    className: 'space-y-2',
    children: (
      <>
        <AccordionItem value="0">
          <AccordionTrigger>
            <p>Example title</p>
          </AccordionTrigger>
          <AccordionContent>
            <p>Example content</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="1">
          <AccordionTrigger>
            <p>Example title 2</p>
          </AccordionTrigger>
          <AccordionContent>
            <p>Example content</p>
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
};