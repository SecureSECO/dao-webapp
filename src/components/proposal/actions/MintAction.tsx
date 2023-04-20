/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { toAbbreviatedTokenAmount } from '@/src/components/ui/TokenAmount/TokenAmount';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';
import { HiCircleStack } from 'react-icons/hi2';

export type ProposalMintAction = IProposalAction & {
  params: {
    to: {
      to: string;
      amount: bigint;
      tokenAddress: string;
    }[];
  };
};

/**
 * Shows the details of a mint action
 * @param props.action Action of type ProposalMintAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MintAction = ({ action }: { action: ProposalMintAction }) => {
  return (
    <ActionWrapper icon={HiCircleStack} title="Mint tokens">
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
              <p className="text-slate-500 ">
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
    </ActionWrapper>
  );
};

export default MintAction;
