/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/src/components/ui/Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="default" duration={Infinity}>
        <div>
          <ToastTitle>Toast title</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="default" duration={Infinity}>
        <div>
          <ToastTitle>Toast title</ToastTitle>
          <ToastDescription>Toast description</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Error: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="error" duration={Infinity}>
        <div>
          <ToastTitle>Toast title</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="success" duration={Infinity}>
        <div>
          <ToastTitle>Toast title</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Loading: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="loading" duration={Infinity}>
        <div>
          <ToastTitle>Toast title</ToastTitle>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};