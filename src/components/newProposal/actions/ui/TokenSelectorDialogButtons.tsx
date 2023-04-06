import { DialogClose } from '@/src/components/ui/Dialog';
import Loader from '@/src/components/ui/Loader';
import TokenAmount from '@/src/components/ui/TokenAmount/TokenAmount';
import { UseDaoBalanceData } from '@/src/hooks/useDaoBalance';
import { anyNullOrUndefined } from '@/src/lib/utils';

/**
 * DialogClose buttons showing all token types currently in the DAO treasury.
 * This component should only be used within Dialogs
 */
export const TokenSelectorDialogButtons = ({
  daoBalanceData,
  setTokenAddress,
}: {
  daoBalanceData: UseDaoBalanceData;
  // eslint-disable-next-line no-unused-vars
  setTokenAddress: (fn: string) => void;
}): JSX.Element => {
  if (daoBalanceData.loading) return <Loader />;
  if (daoBalanceData.error) return <span> {daoBalanceData.error} </span>;

  return (
    <>
      {daoBalanceData.daoBalances.map((token, index) => {
        if (
          anyNullOrUndefined(
            token.name,
            token.symbol,
            token.address,
            token.balance
          )
        )
          return <></>;

        return (
          <div className="flex flex-row">
            <DialogClose
              key={index}
              type="button"
              className="h-10 rounded bg-slate-100 py-2 px-4 text-slate-900 hover:bg-slate-200 focus:ring-primary-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/50 dark:focus:ring-primary-400"
              onClick={() => setTokenAddress(token.address!)}
            >
              <span> {token.name!} </span>
              <span> - </span>
              <TokenAmount
                amount={token.balance}
                tokenDecimals={token.decimals}
                symbol={token.symbol}
              />
            </DialogClose>
          </div>
        );
      })}
    </>
  );
};
