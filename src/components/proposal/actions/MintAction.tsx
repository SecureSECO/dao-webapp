/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper, {
  ActionContentSeparator,
} from '@/src/components/proposal/actions/ActionWrapper';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import CategoryList from '@/src/components/ui/CategoryList';
import { Category } from '@/src/components/ui/CategoryList';
import { toAbbreviatedTokenAmount } from '@/src/components/ui/TokenAmount';
import { useMembers } from '@/src/hooks/useMembers';
import {
  CHAIN_METADATA,
  PREFERRED_NETWORK_METADATA,
} from '@/src/lib/constants/chains';
import { getTokenInfo } from '@/src/lib/token-utils';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { useEffect, useState } from 'react';
import { HiCircleStack } from 'react-icons/hi2';
import { useProvider } from 'wagmi';

/**
 * Interface for a mint action
 * @note The tokenId is only used if governance is done through NFT's, which is not currently the case
 * @note By default, it is assumed that this action will mint the reputation (governance) token
 */
export type ProposalMintAction = IProposalAction & {
  params: {
    to: {
      to: string;
      amount: bigint;
      tokenId: bigint;
    }[];
  };
};

interface MintActionProps extends AccordionItemProps {
  action: ProposalMintAction;
}

type MintActionSummary = {
  newTokens: bigint;
  newHolders: number;
  totalTokens: bigint;
  totalHolders: number;
};

/**
 * Returns the summary data of a mint action in a singleton array of categories.
 * @param summary Summary data of a mint action
 * @returns A singleton array of a category summarizing the mint action
 */
const getCategory = (summary: MintActionSummary): Category[] => [
  {
    title: 'Summary',
    items: [
      {
        label: 'New tokens',
        value: `+ ${toAbbreviatedTokenAmount(
          summary.newTokens,
          CHAIN_METADATA.rep.nativeCurrency.decimals,
          true
        )} ${CHAIN_METADATA.rep.nativeCurrency.symbol}`,
      },
      {
        label: 'New holders',
        value: `+ ${summary.newHolders}`,
      },
      {
        label: 'Total tokens',
        value: `${toAbbreviatedTokenAmount(
          summary.totalTokens,
          CHAIN_METADATA.rep.nativeCurrency.decimals,
          true
        )} ${CHAIN_METADATA.rep.nativeCurrency.symbol}`,
      },
      {
        label: 'Total holders',
        value: summary.totalHolders.toString(),
      },
    ],
  },
];

/**
 * Shows the details of a mint action
 * @param props.action Action of type ProposalMintAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MintAction = ({ action, ...props }: MintActionProps) => {
  const [summary, setSummary] = useState<MintActionSummary | null>(null);
  const { memberCount, isMember } = useMembers({ includeBalances: false });

  const provider = useProvider({
    chainId: +import.meta.env.VITE_PREFERRED_NETWORK_ID,
  });

  useEffect(() => {
    async function fetchSummary() {
      const tokenInfo = await getTokenInfo(
        import.meta.env.VITE_REP_CONTRACT,
        provider,
        PREFERRED_NETWORK_METADATA.nativeCurrency
      );
      const newTokens = action.params.to.reduce(
        (acc, curr) => acc + curr.amount,
        0n
      );
      const newHolders = action.params.to.filter((item) =>
        isMember(item.to)
      ).length;

      setSummary({
        newTokens,
        newHolders,
        totalTokens: (tokenInfo.totalSupply?.toBigInt() ?? 0n) + newTokens,
        totalHolders: memberCount + newHolders,
      });
    }

    if (provider) {
      fetchSummary();
    }
  }, [action, memberCount]);

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
            size="sm"
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
              {CHAIN_METADATA.rep.nativeCurrency.symbol}
            </p>
          </Card>
        ))}
      </div>
      <ActionContentSeparator />
      {summary && (
        <CategoryList
          categories={getCategory(summary)}
          showDivider={false}
          titleSize="lg"
        />
      )}
    </ActionWrapper>
  );
};

export default MintAction;
