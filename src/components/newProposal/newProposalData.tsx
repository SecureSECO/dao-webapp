// STEP 1 DATA
export interface StepOneMetadata {
  title: string;
  summary: string;
  description: string;
  resources: Resource[];
  media: Media;
}

export interface Resource {
  name: string;
  url: string;
}

export interface Media {
  logo: string;
  header: string;
}

// STEP 3 DATA
export interface StepThreeData {
  actions: ActionFormData[];
}

export type Action = ActionWithdraw | ActionMintToken;

export const emptyActionWithdraw: ActionWithdraw = {
  amount: 0,
  name: 'withdraw_assets',
  to: '',
  tokenAddress: '',
  tokenBalance: 0,
  tokenDecimals: 0,
  tokenImgUrl: '',
  tokenName: '',
  tokenSymbol: '',
  isCustomToken: true,
};

export type ActionWithdraw = {
  amount: number;
  name: 'withdraw_assets';
  to: string;
  tokenAddress: string;
  tokenBalance: number;
  tokenDecimals: number;
  tokenImgUrl: string;
  tokenName: string;
  tokenSymbol: string;
  isCustomToken: boolean;
};

export const EmptyActionMintToken: ActionMintToken = {
  name: 'mint_tokens',
  inputs: {
    mintTokensToWallets: [{ address: '', amount: 0 }],
  },
  summary: {
    newTokens: 0,
    tokenSupply: 0,
    newHoldersCount: 0,
    daoTokenSymbol: '',
    daoTokenAddress: '',
  },
};

export type ActionMintToken = {
  name: 'mint_tokens';
  inputs: {
    mintTokensToWallets: {
      address: string;
      amount: string | number;
    }[];
  };
  summary: {
    newTokens: number;
    tokenSupply: number;
    newHoldersCount: number;
    daoTokenSymbol: string;
    daoTokenAddress: string;
    totalMembers?: number;
  };
};

export const emptyActionWithdrawFormData: ActionWithdrawFormData = {
  name: 'withdraw_assets',
  recipient: '',
  tokenAddress: '',
  amount: '',
};

export type ActionWithdrawFormData = {
  name: 'withdraw_assets';
  recipient: string;
  tokenAddress: string;
  amount: string;
};

export const emptyMintAddressAmount: MintAddressAmount = {
  address: '',
  amount: 0,
};

export type MintAddressAmount = {
  address: string;
  amount: number;
};

export const emptyActionMintTokenFormData: ActionMintTokenFormData = {
  name: 'mint_tokens',
  wallets: [emptyMintAddressAmount],
};

export type ActionMintTokenFormData = {
  name: 'mint_tokens';
  wallets: MintAddressAmount[];
};

export type ActionFormData = ActionWithdrawFormData | ActionMintTokenFormData;
