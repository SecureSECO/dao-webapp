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
