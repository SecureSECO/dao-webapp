import { ActionMintToken } from '@/src/lib/Actions';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

export const MintTokensAction = ({
  action,
  register,
  prefix,
}: {
  action: ActionMintToken;
  register: any;
  prefix: string;
}) => {
  return <div className="flex flex-col gap-4"></div>;
};

const AdressTokensMint = ({ onChange, onRemove, register, prefix }: any) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="address">Address</Label>
      <Input {...register(`${prefix}.address`)} type="text" id="address" />
    </div>
    <div className="flex flex-col gap-2">
      <Label htmlFor="tokens">Token Amount</Label>
      <Input {...register(`${prefix}.tokens`)} type="number" id="tokens" />
    </div>
  </div>
);
