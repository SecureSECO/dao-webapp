/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CONFIG } from '@/src/lib/constants/config';

// This file is mostly taken from the Aragon App source code

/* SUPPORTED NETWORK TYPES ================================================== */

export const SUPPORTED_CHAIN_ID = [1, 137, 80001] as const;
export type SupportedChainID = (typeof SUPPORTED_CHAIN_ID)[number];

export function isSupportedChainId(
  chainId: number
): chainId is SupportedChainID {
  return SUPPORTED_CHAIN_ID.some((id) => id === chainId);
}

const SUPPORTED_NETWORKS = ['polygon', 'mumbai'] as const;
export type SupportedNetworks =
  | (typeof SUPPORTED_NETWORKS)[number]
  | 'unsupported';

export function isSupportedNetwork(
  network: string
): network is SupportedNetworks {
  return SUPPORTED_NETWORKS.some((n) => n === network);
}

export function toSupportedNetwork(network: string): SupportedNetworks {
  return SUPPORTED_NETWORKS.some((n) => n === network)
    ? (network as SupportedNetworks)
    : 'unsupported';
}

/**
 * Get the network name with given chain id
 * @param chainId Chain id
 * @returns the name of the supported network or undefined if network is unsupported
 */
export function getSupportedNetworkByChainId(
  chainId: number
): SupportedNetworks | undefined {
  if (isSupportedChainId(chainId)) {
    return Object.entries(CHAIN_METADATA).find(
      (entry) => entry[1].id === chainId
    )?.[0] as SupportedNetworks;
  }
}

/**
 * Get the network chain data with given chain id
 * @param chainId Chain id
 * @returns {ChainData} The chain data of the supported network or undefined if network is unsupported
 */
export function getChainDataByChainId(chainId: number): ChainData | undefined {
  if (isSupportedChainId(chainId)) {
    return Object.entries(CHAIN_METADATA).find(
      (entry) => entry[1].id === chainId
    )?.[1] as ChainData;
  }
}

export type NetworkDomain = 'L1 Blockchain' | 'L2 Blockchain';

/* CHAIN DATA =============================================================== */

export type NativeTokenData = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ChainData = {
  id: SupportedChainID;
  name: string;
  domain: NetworkDomain;
  testnet: boolean;
  explorer: string;
  logo: string;
  rpc: string;
  nativeCurrency: NativeTokenData;
  etherscanApi: string;
};

export type ChainList = Record<SupportedNetworks, ChainData>;
export const CHAIN_METADATA: ChainList = {
  polygon: {
    id: 137,
    name: 'Polygon',
    domain: 'L2 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://polygonscan.com/',
    testnet: false,
    rpc: 'https://rpc.ankr.com/polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    etherscanApi: 'https://api.polygonscan.com/api',
  },
  mumbai: {
    id: 80001,
    name: 'Mumbai',
    domain: 'L2 Blockchain',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    explorer: 'https://mumbai.polygonscan.com/',
    testnet: true,
    rpc: 'https://rpc.ankr.com/polygon_mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    etherscanApi: 'https://api-testnet.polygonscan.com/api',
  },
  unsupported: {
    id: 1,
    name: 'Unsupported',
    domain: 'L1 Blockchain',
    logo: '',
    explorer: '',
    testnet: false,
    rpc: '',
    nativeCurrency: {
      name: '',
      symbol: '',
      decimals: 18,
    },
    etherscanApi: '',
  },
};

export const PREFERRED_NETWORK: SupportedNetworks =
  getSupportedNetworkByChainId(CONFIG.PREFERRED_NETWORK_ID) ?? 'unsupported';

export const PREFERRED_NETWORK_METADATA = CHAIN_METADATA[PREFERRED_NETWORK];
