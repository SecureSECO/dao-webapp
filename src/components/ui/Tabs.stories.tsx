import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

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
        Make changes to your account here. Click save when you&apos;re done.
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
        <Button id="saveChanges">Save changes</Button>
      </div>
    </TabsContent>
    <TabsContent value="password">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Change your password here. After saving, you&apos;ll be logged out.
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
        <Button id="savePassword">Save password</Button>
      </div>
    </TabsContent>
  </Tabs>
);

export const Primary: Story = {
  render: tabsDemo,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // For documentation on queries on the canvas, see: https://testing-library.com/docs/queries/byplaceholdertext
    const name = canvas.getByText('Name').nextSibling as Element;
    const username = canvas.getByText('Username').nextSibling as Element;
    const d = 10;

    await userEvent.clear(name);
    await userEvent.type(name, 'Firstname2, Lastname2', { delay: d });
    await userEvent.clear(username);
    await userEvent.type(username, 'username', { delay: d });
    await userEvent.click(canvas.getByText('Save changes'));

    // move to next tab
    await userEvent.click(canvas.getByText('Password'));
    const curPass = canvas.getByText('Current password').nextSibling as Element;
    const newPass = canvas.getByText('New password').nextSibling as Element;
    await userEvent.clear(curPass);
    await userEvent.type(curPass, 'Old Password', { delay: d });
    await userEvent.clear(newPass);
    await userEvent.type(newPass, 'New Password that is a lot longer', {
      delay: d,
    });
  },
};
