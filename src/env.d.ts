/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PROJECT_ID: string;
  readonly VITE_IPFS_KEY: string;
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_DEV_ALCHEMY_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
