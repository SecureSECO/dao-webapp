/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Address of the diamond to be used in production */
const PROD_DIAMOND_ADDRESS = '0x1eF2db73AfFdd73D4e219638b5ffB62a564f17ea';
/** Address of the diamond to be used in development (on Mumbai) */
const DEV_DIAMOND_ADDRESS = '0x1eF2db73AfFdd73D4e219638b5ffB62a564f17ea';

export const CONFIG = {
  VERIFICATION_API_URL:
    'https://securesecodao-api.herokuapp.com/verification_api',
  SEARCHSECO_API_URL: 'https://searchseco-api.herokuapp.com/api',
  PR_MERGER_API_URL: 'https://securesecodao-pr-merger.herokuapp.com',
  DIAMOND_ADDRESS: import.meta.env.DEV
    ? DEV_DIAMOND_ADDRESS
    : PROD_DIAMOND_ADDRESS,
  PREFERRED_NETWORK_ID: import.meta.env.DEV ? 80001 : 80001,
} as const;

export const DAO_METADATA = {
  name: 'SecureSECO DAO',
  description:
    'Decentralized Autonomous Organization for the SecureSECO project.',
  links: {
    discord: {
      label: 'Discord Server',
      url: 'https://discord.gg/2naUnwE9Y2',
    },
    website: {
      label: 'SecureSECO Website',
      url: 'https://secureseco.org/',
    },
    docs: {
      label: 'User Documentation',
      url: 'https://docs.secureseco.org/',
    },
  },
} as const;
