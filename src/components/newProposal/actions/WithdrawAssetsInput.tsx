/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext, useState } from 'react';
import {
  ActionFormContext,
  ActionFormError,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import { Button } from '@/src/components/ui/Button';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useDaoBalance } from '@/src/hooks/useDaoBalance';
import { ProposalFormAction } from '@/src/lib/constants/actions';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import {
  AddressPattern,
  IntegerPattern,
  NumberPattern,
} from '@/src/lib/constants/patterns';
import { anyNullOrUndefined, assertUnreachable, cn } from '@/src/lib/utils';
import { getTokenInfo } from '@/src/lib/utils/token';
import { TokenType } from '@aragon/sdk-client';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { HiBanknotes, HiXMark } from 'react-icons/hi2';
import { useProvider } from 'wagmi';

export interface ProposalFormWithdrawData extends ProposalFormAction {
  recipient: string;
  tokenAddress: string | 'custom';
  tokenAddressCustom?: string;
  tokenID?: string;
  tokenDecimals: string;
  amount: string | number;
  daoAddress: string | undefined;
  tokenType: TokenType;
}

export const emptyWithdrawData: ProposalFormWithdrawData = {
  name: 'withdraw_assets',
  recipient: '',
  tokenAddress: '',
  tokenDecimals: '18',
  amount: 0,
  daoAddress: '',
  tokenType: TokenType.NATIVE,
};

type TokenTypeInfo = {
  type: TokenType;
  displayName: string;
};
const tokenTypesInfo: TokenTypeInfo[] = [
  {
    type: TokenType.NATIVE,
    displayName: `Native token: ${PREFERRED_NETWORK_METADATA.nativeCurrency.name}`,
  },
  {
    type: TokenType.ERC20,
    displayName: 'ERC20: Most monetary tokens',
  },
  {
    type: TokenType.ERC721,
    displayName: 'ERC721: NFTs',
  },
];

/**
 * @returns Component to be used within a form to describe the action of withdrawing assets.
 */
export const WithdrawAssetsInput = () => {
  const {
    register,
    formState: { errors: formErrors },
    control,
    setValue,
    getValues,
  } = useFormContext<ProposalFormActions>();

  const provider = useProvider();

  const { prefix, index, onRemove } = useContext(ActionFormContext);

  const errors: ActionFormError<ProposalFormWithdrawData> = formErrors.actions
    ? formErrors.actions[index]
    : undefined;

  const { daoBalances, error, loading } = useDaoBalance();
  const filteredDaoBalances =
    error || loading || !daoBalances
      ? []
      : daoBalances.filter(
          (token) =>
            !anyNullOrUndefined(
              token.name,
              token.symbol,
              token.address,
              token.balance
            )
        );

  //Shadow register for daoAddress.
  const { daoAddress } = useDiamondSDKContext();
  register(`${prefix}.daoAddress`);
  setValue(`${prefix}.daoAddress`, daoAddress);

  const address = useWatch({ control, name: `${prefix}.tokenAddress` });
  const tokenType = useWatch({ control, name: `${prefix}.tokenType` });

  const [isManualDecimalEntry, setIsManualDecimalEntry] =
    useState<boolean>(false);
  const decimalsLoadingText = 'Loading...';
  const getERC20Decimals = async () => {
    setIsManualDecimalEntry(false);
    setValue(`${prefix}.tokenDecimals`, decimalsLoadingText);

    const tokenInfo = await getTokenInfo(
      getValues(`${prefix}.tokenAddressCustom`),
      provider,
      PREFERRED_NETWORK_METADATA.nativeCurrency
    );
    if (tokenInfo?.decimals) {
      setValue(`${prefix}.tokenDecimals`, tokenInfo.decimals.toString());
    } else {
      setIsManualDecimalEntry(true);
      setValue(`${prefix}.tokenDecimals`, 'Please enter decimals');
    }
  };

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
      <div className="flex flex-col gap-y-1">
        <Label
          htmlFor="recipient"
          tooltip="Address of the wallet to receive the assets"
        >
          Recipient
        </Label>
        <ErrorWrapper name="Recipient" error={errors?.recipient}>
          <Input
            {...register(`${prefix}.recipient`, {
              required: true,
              pattern: {
                value: AddressPattern,
                message:
                  'Please enter an address starting with 0x, followed by 40 address characters',
              },
            })}
            type="text"
            id="recipient"
            error={errors?.recipient}
            placeholder="0x..."
          />
        </ErrorWrapper>
        {address === 'custom' &&
          'Please note that if the requisted assets are not present in the treasury at the time of withdrawal, this action will fail.'}
      </div>
      <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1 ">
          <Label tooltip="Token to withdraw" htmlFor="tokenAddress">
            Token
          </Label>
          <Controller
            control={control}
            name={`${prefix}.tokenAddress`}
            render={({ field: { onChange, name, value } }) => (
              <Select
                onValueChange={(v) => {
                  console.log(v);
                  onChange(v);
                  let token = undefined;
                  if (v && v !== 'custom') {
                    token = filteredDaoBalances.find((x) => x.address === v);
                    if (token) {
                      console.log(token);
                      setValue(`${prefix}.tokenType`, token.type);
                    }
                  }

                  // Set the token decimals
                  switch (tokenType) {
                    case TokenType.ERC721:
                      setIsManualDecimalEntry(false);
                      setValue(`${prefix}.tokenDecimals`, '1');
                      break;
                    case TokenType.NATIVE:
                      setIsManualDecimalEntry(false);
                      setValue(
                        `${prefix}.tokenDecimals`,
                        PREFERRED_NETWORK_METADATA.nativeCurrency.decimals.toString()
                      );
                      break;
                    case TokenType.ERC20:
                      if (token?.decimals) {
                        setIsManualDecimalEntry(false);
                        setValue(
                          `${prefix}.tokenDecimals`,
                          token.decimals.toString()
                        );
                      } else {
                        getERC20Decimals();
                      }
                      break;
                    default:
                      assertUnreachable(tokenType);
                  }
                }}
                defaultValue={value}
                name={name}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>DAO treasury</SelectLabel>
                    {filteredDaoBalances.map((token, i) => (
                      <SelectItem key={i} value={token.address ?? ''}>
                        <div className="flex flex-row items-center gap-x-1">
                          <p>
                            {!token.name || token.name === ''
                              ? 'Unknown'
                              : token.name}{' '}
                            -{' '}
                          </p>
                          <TokenAmount
                            amount={token.balance}
                            tokenDecimals={token.decimals}
                            symbol={token.symbol ?? undefined}
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Custom</SelectLabel>
                    <SelectItem key={-1} value={'custom'}>
                      Custom Token Address
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <ErrorWrapper
            className={cn(address === 'custom' || 'hidden')}
            name="tokenAddressCustom"
            error={errors?.tokenAddressCustom}
          >
            <Label
              tooltip="The contract address of the token"
              htmlFor="tokenAddressCustom"
            >
              Token address
            </Label>
            <Input
              error={errors?.tokenAddressCustom}
              placeholder="0x..."
              {...register(`${prefix}.tokenAddressCustom`, {
                validate: (v) => {
                  if (address == 'custom') {
                    const valid =
                      v === undefined ? false : AddressPattern.test(v);
                    return (
                      valid ||
                      'Please enter an address starting with 0x, followed by 40 address characters'
                    );
                  }
                },
                onChange: () => getERC20Decimals(),
              })}
            />
          </ErrorWrapper>
          <ErrorWrapper
            //Only show when custom NFT tokens are shown
            className={cn(tokenType === TokenType.ERC721 || 'hidden')}
            name="tokenID"
            error={errors?.tokenID}
          >
            <Label
              tooltip="The token ID of the NFT (ERC721/ERC1155)"
              htmlFor="tokenID"
            >
              Token ID
            </Label>
            <Input
              error={errors?.tokenID}
              placeholder="123..."
              {...register(`${prefix}.tokenID`, {
                validate: (v) => {
                  if (tokenType === TokenType.ERC721) {
                    const empty = v === '' || v === undefined || v === null;
                    const valid = !empty && IntegerPattern.test(v);

                    return (
                      valid ||
                      'Please enter a valid token ID, i.e. a number like 123'
                    );
                  }
                  // Not NFT token, thus valid
                  return true;
                },
              })}
            />
          </ErrorWrapper>
          <ErrorWrapper
            //Only show when decimals is Unknown
            className={cn(
              (address === 'custom' && tokenType === TokenType.ERC20) ||
                'hidden'
            )}
            name="tokenID"
            error={errors?.tokenDecimals}
          >
            <Label
              tooltip="The amount of decimals the token has. Automatically retrieved if applicable."
              htmlFor="tokenDecimals"
            >
              Token decimals
            </Label>
            <Input
              error={errors?.tokenID}
              placeholder={decimalsLoadingText}
              disabled={!isManualDecimalEntry}
              {...register(`${prefix}.tokenDecimals`, {
                validate: (x) => {
                  if (x === null || x === undefined || x === '') {
                    return 'Please enter decimals';
                  }
                  if (x === decimalsLoadingText) {
                    return 'Please wait for the decimals to be loaded';
                  }
                  const valid = IntegerPattern.test(x);
                  return valid || 'Please enter decimals';
                },
              })}
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Amount of tokens to withdraw" htmlFor="amount">
            Amount
          </Label>
          <ErrorWrapper name="Amount" error={errors?.amount}>
            <Input
              {...register(`${prefix}.amount`, {
                required: true,
                pattern: {
                  value: NumberPattern,
                  message: 'Please enter a number, e.g. 3.141',
                },
              })}
              type="string"
              id="amount"
              placeholder="0"
              disabled={tokenType === TokenType.ERC721}
              min="0"
              error={errors?.amount}
            />
          </ErrorWrapper>
          <ErrorWrapper
            className={cn(address === 'custom' || 'hidden')}
            name="tokenType"
            error={errors?.tokenType}
          >
            <Label
              tooltip="The contract address type of the token"
              htmlFor="tokenType"
            >
              Token type
            </Label>
            <Controller
              control={control}
              name={`${prefix}.tokenType`}
              render={({ field: { onChange, name, value } }) => (
                <Select
                  onValueChange={(v) => {
                    onChange(v);
                    if (v === TokenType.ERC721) {
                      setValue(`${prefix}.amount`, '1');
                    }
                  }}
                  defaultValue={value}
                  name={name}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Token type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tokenTypesInfo.map((token, i) => (
                        <SelectItem key={i} value={token.type}>
                          {token.displayName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </ErrorWrapper>
        </div>
      </div>
    </MainCard>
  );
};
