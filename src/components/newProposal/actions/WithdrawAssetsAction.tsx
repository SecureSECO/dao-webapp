import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { useDaoBalance } from '@/src/hooks/useDaoBalance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../../ui/Dialog';
import { HiBanknotes, HiXMark } from 'react-icons/hi2';
import { Button } from '../../ui/Button';
import { AddressPattern, NumberPattern } from '@/src/lib/Patterns';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { ActionWithdrawFormData, StepThreeData } from '../newProposalData';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { MainCard } from '../../ui/MainCard';
import { TokenSelectorDialogButtons } from './ui/TokenSelectorDialogButtons';
import { ActionFormError } from './ProposalActionList';

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
  errors: ActionFormError<ActionWithdrawFormData>;
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
