import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';
import { Input } from './Input';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabsDemo = () => (
  <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Make changes to your account here. Click save when you're done.
      </p>
      <div className="grid gap-2 py-4">
        <div className="space-y-1">
          <span>Name</span>
          <Input id="name" defaultValue="Firstname Lastname" />
        </div>
        <div className="space-y-1">
          <span>Username</span>
          <Input id="username" defaultValue="Example123" />
        </div>
      </div>
      <div className="flex">
        <Button>Save changes</Button>
      </div>
    </TabsContent>
    <TabsContent value="password">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Change your password here. After saving, you'll be logged out.
      </p>
      <div className="grid gap-2 py-4">
        <div className="space-y-1">
          <span>Current password</span>
          <Input id="current" type="password" />
        </div>
        <div className="space-y-1">
          <span>New password</span>
          <Input id="new" type="password" />
        </div>
      </div>
      <div className="flex">
        <Button>Save password</Button>
      </div>
    </TabsContent>
  </Tabs>
);

export const Primary: Story = {
  render: tabsDemo,
};
