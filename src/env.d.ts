/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PROJECT_ID: string;
  readonly VITE_IPFS_KEY: string;
  readonly VITE_DIAMOND_ADDRESS: string;
  readonly VITE_PREFERRED_NETWORK_ID: string;
  readonly VITE_VERIFICATION_API_URL: string;
  readonly VITE_SEARCHSECO_API_URL: string;
  readonly VITE_VERIFY_CONTRACT: `0x${string}`;
  readonly VITE_USE_GANACHE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
