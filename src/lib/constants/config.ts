/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Address of the diamond to be used in production */
const PROD_DIAMOND_ADDRESS = '0xA51994FA9cE33EC75FdAB6Be3B53fB63A157cB80';
/** Address of the diamond to be used in development (on Mumbai) */
const DEV_DIAMOND_ADDRESS = '0xA51994FA9cE33EC75FdAB6Be3B53fB63A157cB80';

export const CONFIG = {
  VERIFICATION_API_URL:
    'https://securesecodao-api.herokuapp.com/verification_api',
  SEARCHSECO_API_URL: 'https://searchseco-api.herokuapp.com/api',
  PR_MERGER_API_URL: 'https://securesecodao-pr-merger.herokuapp.com',
  DIAMOND_ADDRESS: import.meta.env.DEV
    ? DEV_DIAMOND_ADDRESS
    : PROD_DIAMOND_ADDRESS,
  PREFERRED_NETWORK_ID: import.meta.env.DEV
    ? 80001
    : // Change to polygon (137) when ready for production
      80001,
} as const;

export const DAO_METADATA = {
  name: 'SecureSECO DAO',
  description:
    'Distributed Autonomous Organization for the SecureSECO project.',
  discord: 'https://discord.gg/2naUnwE9Y2',
  links: [
    {
      name: 'Discord Server',
      url: 'https://discord.gg/2naUnwE9Y2',
    },
    {
      name: 'User Documentation',
      url: 'https://docs.secureseco.org/',
    },
    {
      name: 'SecureSECO Website',
      url: 'https://secureseco.org/',
    },
  ],
} as const;
