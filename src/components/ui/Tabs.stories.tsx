/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

export const Primary: Story = {
  args: {
    defaultValue: 'account',
    className: 'w-[400px]',
    children: (
      <>
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
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // For documentation on queries on the canvas, see: https://testing-library.com/docs/queries/byplaceholdertext
    const name = canvas.getByText('Name').nextSibling as Element;
    const username = canvas.getByText('Username').nextSibling as Element;
    const d = 10;

    userEvent.clear(name);
    userEvent.type(name, 'Firstname2, Lastname2', { delay: d });
    userEvent.clear(username);
    userEvent.type(username, 'username', { delay: d });
    userEvent.click(canvas.getByText('Save changes'));

    // move to next tab
    userEvent.click(canvas.getByText('Password'));
    const curPass = canvas.getByText('Current password').nextSibling as Element;
    const newPass = canvas.getByText('New password').nextSibling as Element;
    userEvent.clear(curPass);
    userEvent.type(curPass, 'Old Password', { delay: d });
    userEvent.clear(newPass);
    userEvent.type(newPass, 'New Password that is a lot longer', {
      delay: d,
    });
  },
};
