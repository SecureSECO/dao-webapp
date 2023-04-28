import { NativeTokenData } from '@/src/lib/constants/chains';
import { Contract, providers, constants, BigNumber } from 'ethers';
import { erc20ABI } from 'wagmi';

export type TokenInfo = {
  decimals?: number;
  name?: string;
  symbol?: string;
  totalSupply?: BigNumber;
};

/**
 * Get the token info for a given token address
 * @param address Token contract address. Zero address is the native token.
 * @param provider Eth provider
 * @param nativeTokenData Information about the current native token
 * @returns Decimals, name, symbol and total supply of the token (where possible)
 */
export async function getTokenInfo(
  address: string,
  provider: providers.Provider,
  nativeTokenData: NativeTokenData | undefined
): Promise<TokenInfo> {
  if (isNativeToken(address)) return { ...nativeTokenData };

  const contract = new Contract(address, erc20ABI, provider);

  try {
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
    };
  } catch (error) {
    console.error('Error getting token info from contract');
  }

  return {};
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
