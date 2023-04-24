/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { anyNullOrUndefined } from '@/src/lib/utils';
import { TransferType } from '@aragon/sdk-client';
import React from 'react';

interface TokenAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount?: BigInt | null;
  tokenDecimals?: number | null;
  symbol?: string | null;
  sign?: string;
  displayDecimals?: number;
}

export const bigIntToFloat = (value: BigInt, decimals: number): number =>
  parseFloat(`${value}E-${decimals}`);

// Taken from Aragon App
export function abbreviateTokenAmount(amount: string): string {
  if (!amount) return 'N/A';

  const TOKEN_AMOUNT_REGEX =
    /(?<integers>[\d*]*)[.]*(?<decimals>[\d]*)\s*(?<symbol>[A-Za-z]*)/;
  const regexp_res = amount.match(TOKEN_AMOUNT_REGEX);

  // discard failed matches
  if (regexp_res?.length !== 4 || regexp_res[0].length !== amount.length)
    return 'N/A';

  // retrieve capturing groups
  const integers = regexp_res[1];
  const decimals = regexp_res[2];
  const symbol = regexp_res[3];

  if (integers?.length > 4) {
    const integerNumber = Number.parseInt(integers);
    const magnitude = Math.floor((integers.length - 1) / 3);
    const lead = Math.floor(integerNumber / Math.pow(10, magnitude * 3));
    const magnitude_letter = ['k', 'M', 'G'];

    return `${lead}${
      magnitude < 4
        ? magnitude_letter[magnitude - 1]
        : '*10^' + Math.floor(magnitude) * 3
    }${symbol && ' ' + symbol}`;
  }

  if (decimals) {
    const fraction = '0.' + decimals;
    const fractionNumber = Number.parseFloat(fraction);
    const intNumber = Number.parseInt(integers);
    const totalNumber = intNumber + fractionNumber;

    if (totalNumber < 0.01) {
      return ` < 0.01${symbol && ' ' + symbol}`;
    }

    return `${totalNumber.toFixed(2)}${symbol && ' ' + symbol}`;
  }

  return `${Number.parseInt(integers)}${symbol && ' ' + symbol}`;
}

export function toAbbreviatedTokenAmount(
  value: BigInt | null | undefined,
  decimals: number | null | undefined,
  round = false
): string {
  if (anyNullOrUndefined(value, decimals)) return 'N/A';
  let asFloat = bigIntToFloat(value!, decimals!);
  // Theoretically 'bigIntToFloat' never returns NaN, guaranteed by its type's preconditions. In practice, this might still happen.
  if (isNaN(asFloat)) return 'N/A';
  return abbreviateTokenAmount(asFloat.toFixed(round ? 0 : 2));
}

/**
 * @param className - ClassName to pass
 * @param amount - The amount of the given token, default value is 1
 * @param decimals - The amount of decimals the token uses to represent its value. Default is zero
 *                   Tokens are a BigInt, where decimals represents where the decimal symbol is placed
 * @param symbol - The symbol of the token, e.g. LINK, ETH, JSCL. Default is empty string.
 * @param sign - optional sign. Default value '' (empty string). Recommended values: '' (empty string), + (plus) or - (minus).
 * @param onError - Value to display if something went wrong. Default value '-'.
 */
const TokenAmount = ({
  className = '',
  amount,
  tokenDecimals,
  symbol,
  sign = '',
  ...props
}: TokenAmountProps) => {
  return (
    <span className={className} {...props}>
      {sign}
      {toAbbreviatedTokenAmount(amount, tokenDecimals)}
      &nbsp;
      {symbol ?? ''}
    </span>
  );
};

export const transfertypeToSign = (tt: TransferType) =>
  tt === TransferType.WITHDRAW ? '-' : '+';

export default TokenAmount;