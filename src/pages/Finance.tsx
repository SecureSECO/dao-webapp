/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReactNode, useState } from 'react';
import Loading from '@/src/components/icons/Loading';
import { Address } from '@/src/components/ui/Address';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { Skeleton } from '@/src/components/ui/Skeleton';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { DaoBalance, useDaoBalance } from '@/src/hooks/useDaoBalance';
import {
  DaoTransfer,
  TransferType,
  useDaoTransfers,
} from '@/src/hooks/useDaoTransfers';
import { ACTIONS } from '@/src/lib/constants/actions';
import { format } from 'date-fns';
import { constants } from 'ethers';
import {
  HiArrowSmallRight,
  HiArrowsRightLeft,
  HiCircleStack,
  HiInboxArrowDown,
} from 'react-icons/hi2';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/Accordion';
import CategoryList, { Category } from '../components/ui/CategoryList';
import Header from '../components/ui/Header';
import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import { usePoolBalance } from '../hooks/useFacetFetch';
import { TOKENS } from '../lib/constants/tokens';
import { filterNullOrUndefined } from '../lib/utils';

/**
 * Convert a TransferType to a sign (+ or -)
 * @param tt TransferType, as defined in @aragon/sdk-client
 * @returns Either '+' or '-'
 * @example
 * transfertypeToSign(TransferType.DEPOSIT) // '+'
 * transfertypeToSign(TransferType.WITHDRAW) // '-'
 */
export const transfertypeToSign = (tt: TransferType) =>
  tt === TransferType.WITHDRAW ? '-' : '+';

interface RichDaoBalance extends DaoBalance {
  content?: ReactNode;
}

type DaoTokenListProps = {
  loading: boolean;
  error: string | null;
  daoBalances: RichDaoBalance[] | null;
  limit: number;
};

const DaoTokensList = ({
  loading,
  error,
  daoBalances,
  limit = daoBalances?.length ?? 0,
}: DaoTokenListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  if (error) {
    console.error(error);
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        An error was encountered
      </p>
    );
  }
  if (daoBalances === null)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        Could not retrieve DAO balance
      </p>
    );
  if (daoBalances.length === 0)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        No tokens found
      </p>
    );

  const balances = daoBalances.slice(0, limit);

  const BalanceInfo = ({ balance }: { balance: RichDaoBalance }) => (
    <>
      <p className="font-bold capitalize text-left">
        {balance.token?.name ? balance.token.name : 'Unkown Token'}
      </p>
      <div className="flex flex-row items-center">
        <TokenAmount
          amount={balance.balance}
          tokenDecimals={balance.token?.decimals}
          symbol={balance.token?.symbol ?? undefined}
        />
        <span className="px-2">•</span>
        <span className="text-popover-foreground/80">
          <Address
            address={balance.token?.address ?? '-'}
            length="sm"
            hasLink
            replaceYou
          />
        </span>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {balances.map((balance: RichDaoBalance, i) =>
        balance.content !== undefined ? (
          <Accordion type="single" collapsible key={i}>
            <AccordionItem value={i.toString()}>
              <AccordionTrigger className="py-0">
                <BalanceInfo balance={balance} />
              </AccordionTrigger>
              <AccordionContent className="mt-2">
                {balance.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Card key={i} size="sm" variant="light">
            <BalanceInfo balance={balance} />
          </Card>
        )
      )}
    </div>
  );
};

type DaoTransfersListProps = {
  loading: boolean;
  error: string | null;
  daoTransfers: DaoTransfer[] | null;
  limit?: number;
};

export const DaoTransfersList = ({
  loading,
  error,
  daoTransfers,
}: DaoTransfersListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );

  if (error) {
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        An error was encountered
      </p>
    );
  }

  if (!daoTransfers || daoTransfers.length === 0)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        No transfers found
      </p>
    );

  return (
    <div className="space-y-4">
      {daoTransfers.map((transfer: DaoTransfer) => (
        <Card key={transfer.transferId} size="sm" variant="light">
          <div className="flex flex-row justify-between">
            <div className="text-left">
              <p className="font-bold lowercase first-letter:capitalize">
                {transfer.type}
              </p>
              {transfer.creationDate && (
                <p className="text-sm">{format(transfer.creationDate, 'Pp')}</p>
              )}
            </div>
            <div className="flex flex-col items-end text-right">
              {transfer.token ? (
                <TokenAmount
                  className="font-bold"
                  amount={transfer.amount}
                  tokenDecimals={transfer.token.decimals}
                  symbol={transfer.token.symbol ?? undefined}
                  sign={transfertypeToSign(transfer.type)}
                />
              ) : (
                <p className="font-bold">?</p>
              )}
              <div className="text-popover-foreground/80">
                <Address
                  address={daoTransferAddress(transfer)}
                  length="sm"
                  hasLink
                  showCopy
                  replaceYou
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const NewTransferDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button label="New transfer" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem className="p-0">
          <Link
            className="w-full justify-start px-2 py-1"
            variant="ghost"
            to="/finance/new-deposit"
            label="New deposit"
            icon={HiInboxArrowDown}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            className="w-full justify-start px-2 py-1"
            variant="ghost"
            to="/governance/new-proposal"
            label="New withdraw"
            icon={ACTIONS.withdraw_assets.icon}
          />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const daoTransferAddress = (transfer: DaoTransfer): string => {
  if (!transfer) return '-';
  if (transfer.type === TransferType.DEPOSIT) {
    return transfer.from;
  }
  if (transfer.type === TransferType.WITHDRAW) {
    return transfer.to ?? '-';
  }
  throw new Error('Unreachable exception');
};

const Finance = () => {
  const {
    daoBalances: daoBalancesRaw,
    loading: tokensLoading,
    error: tokensError,
  } = useDaoBalance();
  const [tokenLimit, setTokenLimit] = useState(5);

  const [transferLimit, setTransferLimit] = useState(5);
  const {
    daoTransfers,
    loading: transfersLoading,
    refetching: transfersRefetching,
    error: trasnfersError,
  } = useDaoTransfers({
    limit: transferLimit,
  });

  const { secoinAddress } = useDiamondSDKContext();

  const { data: secoinPools } = usePoolBalance();
  const daoBalances = enrichDaoBalances(daoBalancesRaw, {
    secoinPoolData: secoinPools,
    secoinAddress,
  });

  return (
    <div className="space-y-6">
      <HeaderCard title="Finance" aside={<NewTransferDropdown />} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MainCard
          header={
            <DefaultMainCardHeader
              value={daoBalances?.length ?? 0}
              label="tokens"
            />
          }
          loading={false}
          icon={HiCircleStack}
        >
          <div className="space-y-4">
            <DaoTokensList
              daoBalances={daoBalances}
              limit={tokenLimit}
              loading={tokensLoading}
              error={tokensError}
            />
            {daoBalances && tokenLimit < daoBalances.length && (
              <Button
                variant="outline"
                label="Show more tokens"
                icon={HiArrowSmallRight}
                onClick={() =>
                  setTokenLimit(tokenLimit + Math.min(tokenLimit, 25))
                }
              />
            )}
          </div>
        </MainCard>
        <MainCard header="Transfers" icon={HiArrowsRightLeft}>
          <div className="space-y-4">
            <DaoTransfersList
              daoTransfers={daoTransfers}
              limit={transferLimit}
              loading={transfersLoading}
              error={trasnfersError}
            />
            {((daoTransfers && transferLimit <= daoTransfers.length) ||
              transfersRefetching) && (
              <Button
                variant="outline"
                disabled={transfersRefetching}
                label="Show more transfers"
                icon={transfersRefetching ? Loading : HiArrowSmallRight}
                onClick={() =>
                  setTransferLimit(transferLimit + Math.min(transferLimit, 25))
                }
              />
            )}
          </div>
        </MainCard>
      </div>
    </div>
  );
};

type EnrichDaoBalancesProps = {
  secoinPoolData: ReturnType<typeof usePoolBalance>['data'];
  secoinAddress?: string;
};
const enrichDaoBalances = (
  daoBalancesRaw: DaoBalance[] | null,
  props: EnrichDaoBalancesProps
) => {
  //=================
  // Separate 'important' tokens from others
  //=================

  const isSecoin = (e: DaoBalance) =>
    e.token?.address.toLowerCase() === props.secoinAddress?.toLowerCase();
  const secoin = daoBalancesRaw?.find(isSecoin);

  const withoutImportant = daoBalancesRaw?.filter((e) => !isSecoin(e)) ?? [];

  //=================
  // Calculate helper values
  //=================
  const poolSum =
    props.secoinPoolData?.verificationRewardPool.add(
      props.secoinPoolData.miningRewardPool ?? constants.Zero
    ) ?? constants.Zero;

  //=================
  // Enrich SECOIN
  //=================
  const secoinPoolCategories: Category[] | null =
    secoin === undefined
      ? null
      : [
          {
            title: 'Pool distribution',
            items: [
              {
                label: 'General',
                value: (
                  <TokenAmount
                    amount={secoin.balance
                      ?.sub(
                        props.secoinPoolData?.miningRewardPool ?? constants.Zero
                      )
                      .sub(
                        props.secoinPoolData?.verificationRewardPool ??
                          constants.Zero
                      )}
                    tokenDecimals={TOKENS.secoin.decimals}
                    symbol={TOKENS.secoin.symbol}
                  />
                ),
              },
              {
                label: 'Mining reward',
                value: (
                  <TokenAmount
                    amount={props.secoinPoolData?.miningRewardPool}
                    tokenDecimals={TOKENS.secoin.decimals}
                    symbol={TOKENS.secoin.symbol}
                  />
                ),
              },
              {
                label: 'Verification reward',
                value: (
                  <TokenAmount
                    amount={props.secoinPoolData?.verificationRewardPool}
                    tokenDecimals={TOKENS.secoin.decimals}
                    symbol={TOKENS.secoin.symbol}
                  />
                ),
              },
            ],
          },
        ];
  // When there is more money in the pools than in the treasury, show a warning
  //   ? {
  //       title: 'Warning',
  //       items: [
  //         {
  //           label:
  //           value: <HiOutlineExclamationCircle className="w-5 h-5 stroke-red-500" />,
  //         },
  //         {
  //           label:
  //           value: <></>
  //         },
  //         {
  //           label:
  //           value: <></>
  //         },
  //       ],
  //     }
  //   : null,
  const SecoinOverdraftWarning = () => (
    <Card variant="warning" className="gap-y-1">
      <Header level={3}>General pool overdraft!</Header>
      <p>
        Therefore SECOIN has been lended from other pools. Please deposit more
        SECOIN into the general treasury to resolve the deficit.
      </p>
    </Card>
  );

  const secoinRich: RichDaoBalance | null = secoin
    ? {
        content:
          secoinPoolCategories !== null ? (
            <div className="flex flex-col gap-y-2">
              <CategoryList categories={secoinPoolCategories} />
              {secoin !== null && secoin?.balance?.lt(poolSum) && (
                <SecoinOverdraftWarning />
              )}
            </div>
          ) : undefined,
        ...secoin,
      }
    : null;

  const enriched = filterNullOrUndefined([secoinRich]);

  const daoBalances = enriched.concat(withoutImportant);

  return daoBalances;
};

export default Finance;
