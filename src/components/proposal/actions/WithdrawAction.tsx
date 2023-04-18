import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import GeneralAction from '@/src/components/proposal/actions/GeneralAction';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { HiBanknotes } from 'react-icons/hi2';

export type ProposalWithdrawAction = IProposalAction & {
  params: {
    amount: bigint;
    tokenAddress: string;
    to: string;
  };
};

const WithdrawAction = ({ action }: { action: ProposalWithdrawAction }) => {
  return (
    <GeneralAction icon={HiBanknotes} title="Mint tokens">
      <div className="space-y-2">
        <p>Withdraw assets from the DAO treasury.</p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          To{' '}
          <Address
            address={action.params.to}
            maxLength={AddressLength.Small}
            hasLink={false}
            showCopy={false}
          />
        </div>
      </div>
    </GeneralAction>
  );
};

export default WithdrawAction;
