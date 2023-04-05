import { ActionWithdraw, ActionWithdrawFormData } from '@/src/lib/Actions';
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
import { AddressPattern } from '@/src/lib/Patterns';
import { anyNullOrUndefined } from '@/src/lib/utils';
import { FieldErrors } from 'react-hook-form';
import { StepThreeData } from '@/src/pages/NewProposal';
import { ErrorWrapper } from '../ui/ErrorWrapper';
import { MainCard } from '../ui/MainCard';

const Description = ({ text }: { text: string }) => (
  <p className="text-slate-500">{text}</p>
);

export const WithdrawAssetsAction = ({
  register,
  setValue,
  prefix,
  errors,
  onRemove,
}: {
  register: any;
  setValue: any;
  prefix: string;
  errors: FieldErrors<ActionWithdrawFormData> | undefined;
  onRemove: any;
}) => {
  const daoBalanceData = useDaoBalance({});

  const tokenAddressInputName = `${prefix}.TokenAddress`;

  const handleSetTokenAddress = (value: string) =>
    setValue(tokenAddressInputName, value);

  return (
    <MainCard
      className="flex flex-col gap-4"
      header="Withdraw Assets"
      icon={HiBanknotes}
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
        <Label className="text-lg" htmlFor="recipient">
          Recipient
        </Label>
        <Description text="The wallet that receives the tokens" />
        <ErrorWrapper name="Recipient" error={errors?.recipient ?? undefined}>
          <Input
            {...register(`${prefix}.recipient`)}
            type="text"
            id="recipient"
            defaultValue={''}
            error={errors?.recipient ?? undefined}
          />
        </ErrorWrapper>
      </div>
      <Label className="text-lg" htmlFor="tokenAddress">
        Token
      </Label>
      <Description text="Token to withdraw" />
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
            {...register(tokenAddressInputName)}
            className="basis-2/3"
            name="tokenAddress"
            defaultValue="Or enter a custom token address"
            // pattern={AddressPattern}
            error={errors?.tokenAddress ?? undefined}
          />
        </ErrorWrapper>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-lg" htmlFor="amount">
          Amount
        </Label>
        <Description text="Amount is calculated in number of tokens, not dollar value" />
        <ErrorWrapper name="Amount" error={errors?.amount ?? undefined}>
          <Input
            {...register(`${prefix}.amount`)}
            type="text"
            id="amount"
            defaultValue={''}
            error={errors?.amount ?? undefined}
          />
        </ErrorWrapper>
      </div>
    </MainCard>
  );
};

export const TokenSelectorDialogButtons = ({
  daoBalanceData,
  setTokenAddress,
}: {
  daoBalanceData: UseDaoBalanceData;
  setTokenAddress: any;
}): JSX.Element => {
  if (daoBalanceData.loading) return <Loader />;
  if (daoBalanceData.error) return <span> {daoBalanceData.error} </span>;

  return (
    <>
      {daoBalanceData.daoBalances.map((token, index) => {
        if (anyNullOrUndefined(token.name, token.symbol, token.address))
          return <></>;

        return (
          <DialogClose
            key={index}
            type="button"
            className="flex h-10 flex-col gap-2 bg-slate-100 py-2 px-4 text-slate-900 hover:bg-slate-200 focus:ring-primary-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/50 dark:focus:ring-primary-400"
            // icon={HiArrowRight}
            onClick={() => setTokenAddress(token.address!)}
          >
            {token.name!}
          </DialogClose>
        );
      })}
    </>
  );
};
