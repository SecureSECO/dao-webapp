import { ActionWithdraw } from '@/src/lib/Actions';
import { Controller } from 'react-hook-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/Dropdown';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

export const WithdrawAssetsAction = ({
  action,
  register,
  prefix,
  control,
}: {
  action: ActionWithdraw;
  register: any;
  prefix: string;
  control: any;
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="recipient">Recipient</Label>
      <Input {...register(`${prefix}.recipient`)} type="text" id="recipient" />
    </div>
    <div className="flex flex-col gap-2">
      <Label htmlFor="tokenType">Token</Label>
      <Controller
        control={control}
        name="tokenType"
        rules={{ required: true }}
        defaultValue=""
        render={({ field }) => (
          <DropdownMenu>
            <DropdownMenuTrigger>Select a token</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <span>Ja een of ander token</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label htmlFor="amount">Amount</Label>
      <Input {...register(`${prefix}.amount`)} type="text" id="amount" />
    </div>
  </div>
);

const TokenList = () => {

}