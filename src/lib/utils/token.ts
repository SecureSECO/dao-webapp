/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { erc20ABI } from '@/src/lib/constants/erc20ABI';
import { TokenType } from '@/src/lib/constants/tokens';
import { anyNullOrUndefined, isNullOrUndefined } from '@/src/lib/utils';
import { BigNumber, Contract, constants, providers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';

export type TokenInfo = {
  decimals?: number;
  name?: string;
  symbol?: string;
  address: string;
  totalSupply?: BigNumber;
};

/**
 * Get the token info for a given token address
 * @param address Token contract address. Zero address is the native token.
 * @param provider Provider to use for fetching token info.
 * @param nativeTokenData Data for the native token of the chain.
 * @param tokenType Type of token to get info for. Defaults to 'erc20'.
 * @returns Decimals, name, symbol and total supply of the token (where possible)
 */
export async function fetchTokenInfo(
  address: string | undefined,
  provider: providers.Provider,
  nativeTokenData: TokenInfo,
  tokenType: TokenType = TokenType.ERC20
): Promise<TokenInfo | null> {
  if (!address) return null;
  if (isNativeToken(address) || tokenType === TokenType.NATIVE)
    return nativeTokenData;

  const contract = new Contract(address, erc20ABI, provider);

  try {
    if (tokenType === TokenType.ERC20) {
      const values = await Promise.all([
        contract.decimals(),
        contract.name(),
        contract.symbol(),
        contract.totalSupply(),
      ]);

      return {
        decimals: values[0],
        name: values[1],
        symbol: values[2],
        totalSupply: values[3],
        address,
      };
    } else if (tokenType === TokenType.ERC721) {
      // erc721 can be used for both ERC721 and ERC1155 tokens, since we're only trying to get the name here

      // Note that we use the ERC20 ABI here as well, since it contains the name() function
      // May fail if the contract does not have the name() function (does not support ERC721Metadata interface in the case of ERC721)
      // In that case, we return undefined for the name
      const name: string | undefined = await contract
        .name()
        .catch(() => undefined);

      return {
        name,
        decimals: 0, // ERC721 tokens do not have decimals
        address,
      };
    }
  } catch (error) {
    console.error('Error getting token info from contract: ', error);
  }

  return null;
}

/**
 * Check if token is the chain native token; the distinction is made
 * especially in terms of whether the contract address
 * is that of an ERC20 token
 * @param tokenAddress address of token contract
 * @returns whether token is Ether
 */
export const isNativeToken = (tokenAddress: string) => {
  return tokenAddress === constants.AddressZero;
};

export const bigIntToFloat = (
  value: BigInt | BigNumber,
  decimals: number
): number => parseFloat(`${value}E-${decimals}`);

/**
 * Helper-method formats a string of token amount.
 *
 * Source: adapted from Aragon App. https://github.com/aragon/app/blob/e90f27667f567bb7d6c62ee5cc258d08171a57bf/packages/web-app/src/utils/tokens.ts#L207
 *
 * The method expects the string representation of an integer or decimal number.
 * The string must contain only digits, except for the decimal dot and an option
 * token symbol separated from the number by a whitespace. E.g.
 *
 * - '111' ok
 * - '111.1' ok
 * - '111.1 SYM' ok
 * - '1'111'111.1 SYM' not ok.
 *
 * The output, in general, is engineering notation (scientific notation wher the
 * exponent is divisible by 3 and the coefficient is between in [1,999]). For
 * numbers up to a trillon, the power is replaced by the letters k (10^3), M
 * (10^6) and G (10^9).
 *
 * Decimals are ignored for any number >= 10 k. Below that, rounding to 2
 * decimals is applied if necessary.
 *
 * @param amount [string] token amount. May include token symbol.
 * @param displayDecimals [number] number of decimals to display.
 * @param showSmallAmounts [boolean] whether to show all decimals, else it gets rounded to <0.01 if it is below that.
 * @returns [string] abbreviated token amount. Any decimal digits get discarded. For
 * thousands, millions and billions letters are used. E.g. 10'123'456.78 SYM becomes 10M.
 * Everything greater gets expressed as power of tens.
 */
export function abbreviateTokenAmount(
  amount: string,
  displayDecimals: number,
  showSmallAmounts: boolean = false
): string {
  if (!amount) return 'N/A';

  // Make sure displayDecimals is in the range required by toFixed()
  if (displayDecimals > 20) displayDecimals = 20;
  else if (displayDecimals < 0) displayDecimals = 0;

  if (amount.includes('e+')) {
    return ' > 1 exa ';
  }

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

    if (!showSmallAmounts && totalNumber < 0.01 && totalNumber > 0) {
      return ` < 0.01${symbol && ' ' + symbol}`;
    }

    return `${removeTrailingZeros(
      totalNumber.toFixed(displayDecimals).toString()
    )}${symbol && ' ' + symbol}`;
  }

  return `${Number.parseInt(integers)}${symbol && ' ' + symbol}`;
}

function removeTrailingZeros(value: string): string {
  return value.replace(/\.0+$/, '').replace(/(\.\d+?)0+$/, '$1');
}

type AbbreviatedTokenAmountProps = {
  value?: BigInt | BigNumber | null;
  tokenDecimals?: number | null;
  displayDecimals?: number;
  valueAsFloat?: number;
  showSmallAmounts?: boolean;
};

/**
 * Formats a given token amount (BigInt or BigNumber) to a string representation, correctly rounded
 * @param value Token amount as BigInt or BigNumber
 * @param tokenDecimals Number of decimals of the token
 * @param displayDecimals Number of decimals to display. Must be in the range 0-20 (inclusive). Defaults to 2.
 * @param valueAsFloat Optional. If the value is already a float, it can be passed here to avoid conversion
 * @returns String representation of the token amount
 */
export const toAbbreviatedTokenAmount = ({
  value,
  tokenDecimals,
  displayDecimals = 2,
  showSmallAmounts,
  valueAsFloat = undefined,
}: AbbreviatedTokenAmountProps): string => {
  // NOTE: Float values are used as this is also used by abbreviateTokenAmount.
  if (anyNullOrUndefined(value, tokenDecimals)) {
    if (isNullOrUndefined(valueAsFloat)) {
      return 'N/A';
    }
  } else {
    valueAsFloat = bigIntToFloat(value!, tokenDecimals!);
  }

  // Theoretically 'bigIntToFloat' never returns NaN, guaranteed by its type's preconditions. In practice, this might still happen.
  if (isNaN(valueAsFloat!)) return 'N/A';
  if (!Number.isFinite(valueAsFloat!)) return '&infin;';
  return abbreviateTokenAmount(
    valueAsFloat!.toFixed(20),
    displayDecimals,
    showSmallAmounts
  );
};

/**
 * Parses a given token amount (string or number) to a BigNumer token amount, correctly handling decimal places.
 * Prefered over ethers.utils.parseUnits because this return null on errors (instead of an exception).
 * Furthermore it cuts off inputs with too many numbers after the decimal point (instead of throwing an exception).
 * Note: If any input is null or undefined it can not parse the value thus null will be returned.
 * @param value Token amount as string or number (e.g. "123.456")
 * @param tokenDecimals Number of decimals of the token
 */
export const parseTokenAmount = (
  value: string | number | null | undefined,
  tokenDecimals: number | null | undefined
): BigNumber | null => {
  if (
    value === null ||
    value === undefined ||
    tokenDecimals === null ||
    tokenDecimals === undefined
  ) {
    return null;
  }

  let num;
  try {
    // Check if num is a string
    if (typeof value === 'string') {
      // If the amount of decimals in the value is larger than decimals, it is cut off.
      if (value.includes('.')) {
        const values = value.split('.');
        if (values[1].length > tokenDecimals) {
          value = `${values[0]}.${values[1].slice(0, tokenDecimals)}`;
        }
      }
    } else if (typeof value === 'number') {
      value = value.toFixed(tokenDecimals);
    }

    num = parseUnits(value, tokenDecimals);
  } catch {
    num = null;
  }
  return num;
};
