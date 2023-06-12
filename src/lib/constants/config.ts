/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const CONFIG = {
  VERIFICATION_API_URL:
    'https://securesecodao-api.herokuapp.com/verification_api',
  SEARCHSECO_API_URL: 'https://searchseco-api.herokuapp.com/api',
  PR_MERGER_API_URL: 'https://securesecodao-pr-merger.herokuapp.com',
  DIAMOND_ADDRESS: '0xa8326b1c6b2595e51e59Ea98A3995866D7b3E299',
  PREFERRED_NETWORK_ID: 80001,
} as const;

export const DAO_METADATA = {
  name: 'SecureSECO DAO',
  description:
    'Distributed Autonomous Organization for the SecureSECO project.',
  links: [
    {
      name: 'Discord Server',
      url: 'https://discord.gg/',
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
};
