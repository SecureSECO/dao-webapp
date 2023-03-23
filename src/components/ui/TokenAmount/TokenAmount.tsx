import { TransferType } from '@aragon/sdk-client';
import React from 'react';

/** */
type TokenAmountProps = {
  className?: string;
  amount?: BigInt | null;
  tokenDecimals?: number | null;
  symbol?: string | null;
  sign?: string;
  onError?: string;
  displayDecimals?: number;
};

export const bigIntToFloat = (
  value: BigInt | null,
  decimals: number | null,
  onError: string = '-'
): number => parseFloat(value && decimals ? `${value}E-${decimals}` : onError);

/**
 * @param className - ClassName to pass
 * @param amount - The amount of the given token, default value is 1
 * @param decimals - The amount of decimals the token uses to represent its value. Default is zero
 *                   Tokens are a BigInt, where decimals represents where the decimal symbol is placed
 * @param symbol - The symbol of the token, e.g. LINK, ETH, JSCL. Default is empty string.
 * @param sign - optional sign. Default value '' (empty string). Recommended values: '' (empty string), + (plus) or - (minus).
 * @param onError - Value to display if something went wrong. Default value '-'.
 * @param significanceDecimals - Amount of decimals to display. Default value 2. E.g. 1.23
 */
const TokenAmount = ({
  className = '',
  amount,
  tokenDecimals,
  symbol,
  sign = '',
  onError = '-',
  displayDecimals = 2,
}: TokenAmountProps) => {
  return (
    <span className={className}>
      {sign}
      {bigIntToFloat(amount ?? 1n, tokenDecimals ?? 0, onError).toFixed(
        displayDecimals
      )}
      &nbsp;
      {symbol ?? ''}
    </span>
  );
};

export const transfertypeToSign = (tt: TransferType) =>
  tt === TransferType.WITHDRAW ? '-' : '+';

export default TokenAmount;
