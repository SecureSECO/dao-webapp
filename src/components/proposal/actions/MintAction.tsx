import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import GeneralAction from '@/src/components/proposal/actions/GeneralAction';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { toAbbreviatedTokenAmount } from '@/src/components/ui/TokenAmount/TokenAmount';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';
import { HiCircleStack } from 'react-icons/hi2';

export type ProposalMintAction = IProposalAction & {
  params: {
    to: [
      {
        to: string;
        amount: bigint;
        tokenAddress: string;
      }
    ];
  };
};

const MintAction = ({ action }: { action: ProposalMintAction }) => {
  return (
    <GeneralAction icon={HiCircleStack} title="Mint tokens">
      <div className="space-y-2">
        <p>Mint tokens to a selection of wallets.</p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {action.params.to.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between gap-x-4 rounded-full border border-slate-200 px-3 py-1 text-right dark:border-slate-700"
            >
              <Address
                address={item.to}
                maxLength={AddressLength.Small}
                hasLink={true}
                showCopy={false}
                replaceYou={false}
              />
              <p className="text-gray-500 ">
                {toAbbreviatedTokenAmount(
                  item.amount,
                  CHAIN_METADATA.rep.nativeCurrency.decimals,
                  true
                )}{' '}
                REP
              </p>
            </div>
          ))}
        </div>
      </div>
    </GeneralAction>
  );
};

export default MintAction;
