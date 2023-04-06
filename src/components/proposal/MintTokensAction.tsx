import {
  Action,
  ActionMintToken,
  EmptyActionMintToken,
} from '@/src/lib/Actions';
import { AddressPattern, NumberPattern } from '@/src/lib/Patterns';
import { Input } from '../ui/Input';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { Card } from '../ui/Card';

export const MintTokensAction = ({
  action,
  register,
  prefix,
}: {
  action: ActionMintToken;
  register: any;
  prefix: string;
}) => {
  const [_action, setAction] = useState<ActionMintToken>(action);
  const handleAddMintTokensAction = () => {
    setAction({
      ..._action,
      inputs: {
        mintTokensToWallets: [
          ..._action.inputs.mintTokensToWallets,
          { address: '', amount: '' },
        ],
      },
    });
  };

  const handleRemove = (index: number) => {
    const newMintTokens = _action.inputs.mintTokensToWallets.slice(0);
    newMintTokens.splice(index, 1);
    setAction({ ..._action, inputs: { mintTokensToWallets: newMintTokens } });
  };

  return (
    <Card className="grid grid-cols-3 gap-4">
      <span className="col-span-1 pl-2">Address</span>
      <span className="col-span-1 pl-2">Tokens</span>
      <span className="col-span-1" />
      {_action.inputs.mintTokensToWallets.map((atm, index) => (
        <AddressTokensMint
          addressToken={atm}
          register={register}
          prefix={`${prefix}.${index}`}
          onRemove={() => handleRemove(index)}
        />
      ))}
      <Button
        variant="subtle"
        type="button"
        label="Add wallet"
        icon={HiPlus}
        onClick={handleAddMintTokensAction}
      />
    </Card>
  );
};

type AddressToken = {
  address: string;
  amount: string | number;
};

const AddressTokensMint = ({
  addressToken,
  register,
  onRemove,
  prefix,
}: {
  addressToken: AddressToken;
  register: any;
  onRemove: () => void;
  prefix: string;
}) => (
  <div className="col-span-3 grid grid-cols-3 gap-4">
    <div className="flex flex-col gap-2">
      {/* <Label htmlFor="address">Address</Label> */}
      {/* TODO Add pattern for validation */}
      <Input
        {...register(`${prefix}.address`)}
        type="text"
        id="address"
        defaultValue={addressToken.address}
        pattern={AddressPattern}
      />
    </div>
    <div className="flex flex-col gap-2">
      {/* <Label htmlFor="tokens">Tokens</Label> */}
      <Input
        {...register(`${prefix}.tokens`)}
        type="number"
        id="tokens"
        defaultValue={addressToken.amount}
        pattern={NumberPattern}
      />
    </div>
    <HiXMark
      className="h-5 w-5 cursor-pointer self-center"
      onClick={onRemove}
    />
  </div>
);
