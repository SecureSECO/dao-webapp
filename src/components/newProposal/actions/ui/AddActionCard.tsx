/**
 * Components that are used to add new actions to the 3th step of the new proposal form.
 */
import { Card } from '@/src/components/ui/Card';
import { HiOutlineBolt } from 'react-icons/hi2';
import { ActionFormData } from '../../newProposalData';
import { AddActionButton } from './AddActionButton';

/**
 * @param append function that is called with ActionFormData to be appended to some parent-like component.
 * @returns A card component to add proposal-actions.
 */
export const AddActionCard = ({
  append,
}: {
  // eslint-disable-next-line no-unused-vars
  append: (fn: ActionFormData) => void;
}) => (
  <Card
    variant="light"
    className="flex max-w-4xl flex-col items-center gap-4 self-center"
  >
    <HiOutlineBolt className="h-20 w-16" />
    <h2 className="text-4xl">Add action</h2>
    <p className="max-w-xl text-center text-lg leading-6">
      This action will execute if the vote passes. A common automatic action is
      transferring funds to a guild or person if their proposal passes a vote.
    </p>
    <AddActionButton append={append} />
  </Card>
);
