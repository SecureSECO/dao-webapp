/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Address of the diamond to be used in production */
const PROD_DIAMOND_ADDRESS = '0x8AAbEaD849825eeefB2D67c529Bee1b4Cd656D7c';
/** Address of the diamond to be used in development (on Mumbai) */
const DEV_DIAMOND_ADDRESS = '0xfc0f2AAbd1Ff6dCcCC749bDcD28AfbC5e72AE2dA';

export const CONFIG = {
  VERIFICATION_API_URL:
    'https://securesecodao-api.herokuapp.com/verification_api',
  SEARCHSECO_API_URL: 'https://searchseco-api.herokuapp.com/api',
  PR_MERGER_API_URL: 'https://securesecodao-pr-merger.herokuapp.com',
  DIAMOND_ADDRESS: import.meta.env.DEV
    ? DEV_DIAMOND_ADDRESS
    : PROD_DIAMOND_ADDRESS,
  // Mumbai in development, Polygon Mainnet in production
  PREFERRED_NETWORK_ID: import.meta.env.DEV ? 80001 : 137,
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
