/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Import necessary components
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/Popover';
import type { Meta, StoryObj } from '@storybook/react';
import { HiCog6Tooth } from 'react-icons/hi2';

// Meta data for the story
const meta: Meta<typeof Popover> = {
  title: 'UI/Popover', // Where it will be located in the storybook hierarchy
  component: Popover,
};

export default meta;

type PopoverStory = StoryObj<typeof Popover>;

// The contents of the popover, separated out for clarity
const PopoverContents = () => (
  <div className="grid gap-4">
    <div className="space-y-2">
      <h4 className="font-medium leading-none">Dimensions</h4>
      <p className="text-sm text-muted-foreground">
        Set the dimensions for the layer.
      </p>
    </div>
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Dimensions</h4>
        <p className="text-sm text-muted-foreground">
          Set the dimensions for the layer.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="maxWidth">Max. width</Label>
          <Input
            id="maxWidth"
            defaultValue="300px"
            className="col-span-2 h-8"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="height">Height</Label>
          <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="maxHeight">Max. height</Label>
          <Input
            id="maxHeight"
            defaultValue="none"
            className="col-span-2 h-8"
          />
        </div>
      </div>
    </div>
  </div>
);

// The story definition
export const PopoverExample: PopoverStory = {
  args: {
    children: (
      <>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-10 rounded-full p-0"
            type="button"
          >
            <span className="sr-only">Swap settings</span>
            <HiCog6Tooth className="h-5 w-5 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverContents />
        </PopoverContent>
      </>
    ),
  },
};
