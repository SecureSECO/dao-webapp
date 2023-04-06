import { ActionWithdrawFormData } from '@/src/lib/Actions';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { UseDaoBalanceData, useDaoBalance } from '@/src/hooks/useDaoBalance';
import Loader from '../ui/Loader';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/Dialog';
import { HiBanknotes, HiXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { AddressPattern, NumberPattern } from '@/src/lib/Patterns';
import { anyNullOrUndefined } from '@/src/lib/utils';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { StepThreeData } from '@/src/pages/NewProposal';
import { ErrorWrapper } from '../ui/ErrorWrapper';
import { MainCard } from '../ui/MainCard';
import TokenAmount from '../ui/TokenAmount/TokenAmount';

const Description = ({ text }: { text: string }) => (
  <p className="text-slate-500">{text}</p>
);

/**
 * @returns Component to be used within a form to describe the action of withdrawing assets.
 */
export const WithdrawAssetsAction = ({
  register,
  setValue,
  prefix,
  errors,
  onRemove,
}: {
  register: UseFormRegister<StepThreeData>;
  setValue: UseFormSetValue<StepThreeData>;
  prefix: `actions.${number}`;
  errors: FieldErrors<ActionWithdrawFormData> | undefined;
  onRemove: any;
}) => {
  const daoBalanceData = useDaoBalance({});

  const handleSetTokenAddress = (value: string) =>
    setValue(`${prefix}.tokenAddress`, value);

  return (
    <MainCard
      className="flex flex-col gap-4"
      header="Withdraw Assets"
      icon={HiBanknotes}
      variant="light"
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      <Description text="Withdraw assets from the DAO treasury" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <Label className="text-lg" htmlFor="recipient">
            Recipient
          </Label>
          <Description text="The wallet that receives the tokens" />
        </div>
        <ErrorWrapper name="Recipient" error={errors?.recipient ?? undefined}>
          <Input
            {...register(`${prefix}.recipient`, { required: true })}
            type="text"
            id="recipient"
            pattern={AddressPattern}
            title="An address starting with 0x, followed by 40 address characters"
            error={errors?.recipient ?? undefined}
          />
        </ErrorWrapper>
      </div>
      <div className="flex flex-col">
        <Label className="text-lg" htmlFor="tokenAddress">
          Token
        </Label>
        <Description text="Token to withdraw" />
      </div>
      <div className="flex w-full gap-2">
        <div className="basis-1/3">
          <Dialog>
            <DialogTrigger className="h-full w-full rounded-md border-2 border-solid">
              Select token
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Select token to withdraw</DialogHeader>
              <TokenSelectorDialogButtons
                daoBalanceData={daoBalanceData}
                setTokenAddress={handleSetTokenAddress}
              />
            </DialogContent>
          </Dialog>
        </div>
        <ErrorWrapper name="Token" error={errors?.tokenAddress ?? undefined}>
          <Input
            {...register(`${prefix}.tokenAddress`, { required: true })}
            className="basis-2/3"
            name="tokenAddress"
            pattern={AddressPattern}
            title="An address starting with 0x, followed by 40 address characters"
            error={errors?.tokenAddress ?? undefined}
          />
        </ErrorWrapper>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <Label className="text-lg" htmlFor="amount">
            Amount
          </Label>
          <Description text="Amount is calculated in number of tokens, not dollar value" />
        </div>
        <ErrorWrapper name="Amount" error={errors?.amount ?? undefined}>
          <Input
            {...(register(`${prefix}.amount`), { required: true })}
            type="text"
            id="amount"
            title="A number using a '.' as decimal place, e.g. '3.141'"
            pattern={NumberPattern}
            error={errors?.amount ?? undefined}
          />
        </ErrorWrapper>
      </div>
    </MainCard>
  );
};

/**
 * DialogClose buttons showing all token types currently in the DAO treasury.
 * This component should only be used within Dialogs
 */
const TokenSelectorDialogButtons = ({
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
