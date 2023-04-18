import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import GeneralAction from '@/src/components/proposal/actions/GeneralAction';
import { HiQuestionMarkCircle } from 'react-icons/hi2';

/**
 * Default action component, for when it has not yet been supported specifically
 * @returns Accordion showing a general action with its params
 */
const DefaultAction = ({ action }: { action: IProposalAction }) => {
  return (
    <GeneralAction icon={HiQuestionMarkCircle} title="Unknown action">
      <p>This action is not supported in the web-app yet.</p>
    </GeneralAction>
  );
};

export default DefaultAction;
