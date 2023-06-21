/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @see https://docs.alchemy.com/reference/alchemy-sdk-quickstart - Alchemy SDK Quickstart
 */

import { createContext, useContext } from 'react';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { Alchemy, Network } from 'alchemy-sdk';

const AlchemySDKContext = createContext<Alchemy>(
  new Alchemy({
    apiKey: import.meta.env.VITE_ALCHEMY_KEY,
    network: PREFERRED_NETWORK_METADATA.alchemyName as Network,
  })
);

export function useAlchemySDKContext(): Alchemy {
  return useContext(AlchemySDKContext);
}
