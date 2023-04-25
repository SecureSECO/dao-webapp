/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { HiQuestionMarkCircle } from 'react-icons/hi2';

interface DefaultActionProps extends AccordionItemProps {
  action: IProposalAction;
}

/**
 * Default action component, for when it has not yet been supported specifically
 * @returns Accordion showing a general action with its params
 */
const DefaultAction = ({ action, ...props }: DefaultActionProps) => {
  return (
    <ActionWrapper
      icon={HiQuestionMarkCircle}
      title="Unknown action"
      description="This action is not supported in the web-app yet"
      {...props}
    />
  );
};

export default DefaultAction;
