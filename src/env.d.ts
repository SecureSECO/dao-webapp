/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PROJECT_ID: string;
  readonly VITE_IPFS_KEY: string;
  readonly VITE_USE_GANACHE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
