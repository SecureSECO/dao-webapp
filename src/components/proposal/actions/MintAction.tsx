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
import { Card } from '@/src/components/ui/Card';
import { toAbbreviatedTokenAmount } from '@/src/components/ui/TokenAmount';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';
import { AccordionItemProps } from '@radix-ui/react-accordion';
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

interface MintActionProps extends AccordionItemProps {
  action: ProposalMintAction;
}

/**
 * Shows the details of a mint action
 * @param props.action Action of type ProposalMintAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MintAction = ({ action, ...props }: MintActionProps) => {
  return (
    <ActionWrapper
      icon={HiCircleStack}
      title="Mint tokens"
      description="Mint tokens to a selection of wallets"
      {...props}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {action.params.to.map((item, index) => (
          <Card
            key={index}
            variant="outline"
            padding="sm"
            className="flex flex-row items-center justify-between text-right"
          >
            <Address
              address={item.to}
              maxLength={AddressLength.Small}
              hasLink={true}
              showCopy={false}
              replaceYou={false}
              jazziconSize="md"
            />
            <p className="text-popover-foreground/80">
              +{' '}
              {toAbbreviatedTokenAmount(
                item.amount,
                CHAIN_METADATA.rep.nativeCurrency.decimals,
                true
              )}{' '}
              REP
            </p>
          </Card>
        ))}
      </div>
    </ActionWrapper>
  );
};

export default MintAction;
