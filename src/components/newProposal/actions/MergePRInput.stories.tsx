/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { MergePRInput } from './MergePRInput';
import { ProposalFormActions } from '../steps/Actions';
import { NewProposalFormProvider } from '@/src/pages/NewProposal';

const FormProviderDecoratorFactory = (data: ProposalFormActions): any => {
  // eslint-disable-next-line react/display-name
  return (Story: any) => (
    <NewProposalFormProvider step={3} dataStep3={data}>
      <Story />
    </NewProposalFormProvider>
  );
};

const meta: Meta<typeof MergePRInput> = {
  component: MergePRInput,
  tags: ['autodocs'],
  decorators: [FormProviderDecoratorFactory({ actions: [] })],
};

export default meta;
type Story = StoryObj<typeof MergePRInput>;

export const Primary: Story = {
  args: {
    register: (() => {}) as any,
    prefix: 'actions.1.',
    errors: {},
    onRemove() {},
  },
};
