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
  SEARCHSECO_API_URL: 'http://localhost:25566/api',
  DIAMOND_ADDRESS: '0xc57052Bb93BFF80b637A2f5c85Bac28bEa8C5A8d',
  PREFERRED_NETWORK_ID: 80001,
} as const;

export const DAO_METADATA = {
  name: 'SecureSECO DAO',
  description:
    'Distributed Autonomous Organization for the SecureSECO project.',
  links: [
    {
      name: 'SecureSECO Website',
      url: 'https://secureseco.org/',
    },
  ],
};
