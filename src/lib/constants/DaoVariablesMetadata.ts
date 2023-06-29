/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TOKENS } from '@/src/lib/constants/tokens';

export type InterfaceName = string;
export type VariableName = string;
export type DaoVariableMetadataType =
  | 'Percentage' // Percentage, where 1,000,000 corresponds to 100%
  | typeof TOKENS.rep.symbol
  | typeof TOKENS.secoin.symbol
  | 'Seconds';

export type VariableMetadata = {
  description: string;
  type?: DaoVariableMetadataType;
};

export type DaoVariablesMetadata = Record<
  InterfaceName,
  Record<VariableName, VariableMetadata>
>;

export type DaoVariablesTypeMetadataDescriptions = Record<
  DaoVariableMetadataType,
  string
>;
export const DAO_VARIABLES_TYPES_METADATA: DaoVariablesTypeMetadataDescriptions =
  {
    Percentage: '1,000,000 corresponds to 100%',
    SECOREP: `${TOKENS.rep.symbol} includes decimals, meaning 10^18 corresponds to 1.0 ${TOKENS.rep.symbol}`,
    SECOIN: `${TOKENS.secoin.symbol} includes decimals, meaning 10^18 corresponds to 1.0 ${TOKENS.secoin.symbol}`,
    Seconds: 'Seconds, decimals are not supported',
  };

export const DAO_VARIABLES_METADATA: DaoVariablesMetadata = {
  IVerificationFacet: {
    ReverifyThreshold: {
      description:
        'The amount of blocks after which a verification can be reverified.',
    },
    VerificationContractAddress: {
      description:
        'The address of the contract that handles the verification process.',
    },
    VerifyThreshold: {
      description:
        'The amount of days after which a verification has to reverify.',
    },
  },
  IPartialVotingProposalFacet: {
    MaxSingleWalletPower: {
      description:
        'Maximum ercentage of the total voting power supply that a single wallet may use to vote, in parts per million.',
      type: 'Percentage',
    },
    MinDuration: {
      description:
        'Minimum duration of the voting period of a proposal in seconds.',
      type: 'Seconds',
    },
    MinParticipation: {
      description:
        'Minimum percentage of the total voting power supply needed for a quorum (minimum participation), in parts per million.',
      type: 'Percentage',
    },
    MinProposerVotingPower: {
      description: `Minimum ${TOKENS.rep.symbol} (in wei) a wallet needs to own to gain the ability to create a proposal.`,
      type: TOKENS.rep.symbol,
    },
    SupportThreshold: {
      description:
        'Percentage of yes/no votes that need to be yes for a proposal to pass (abstain is solely to reach the quorum), in parts per million.',
      type: 'Percentage',
    },
    VotingMode: {
      description:
        '0: Single vote - vote once with all voting power, 1: Single partial vote - vote once with any part of your voting power , 2: Multiple partial vote - vote multiple times with a part of your voting power.',
    },
  },
  IBurnVotingProposalFacet: {
    ProposalCreationCost: {
      description: `Amount of ${TOKENS.rep.symbol} (in wei) it costs to create a proposal. This ${TOKENS.rep.symbol} is burned, never to see the light of day again.`,
      type: TOKENS.rep.symbol,
    },
  },
  IERC20TimeClaimableFacet: {
    ClaimPeriodInterval: {
      description: 'Interval in seconds between subsequent daily rewards.',
      type: 'Seconds',
    },
    ClaimPeriodMax: {
      description:
        'Time period in seconds after which claim reward will no longer increase. After this period, the claim reward will thus have reached the maximum claim reward.',
      type: 'Seconds',
    },
  },
  ISearchSECOMonetizationFacet: {
    HashCost: {
      description: `${TOKENS.secoin.symbol} cost (in wei) per hash retrieved to calculate query price.`,
      type: TOKENS.secoin.symbol,
    },
    QueryMiningRewardPoolRatio: {
      description:
        'Percentage of the query price that goes to the Mining Reward Pool, the rest goes to the general treasury, in parts per million.',
      type: 'Percentage',
    },
  },
  ISearchSECORewardingFacet: {
    HashRepReward: {
      description: `Amount of ${TOKENS.rep.symbol} (in wei) rewarded per hash mined.`,
      type: TOKENS.rep.symbol,
    },
    RewardingSigner: {
      description:
        'Address of the wallet that verifies if claimed hash rewards are actually claimable.',
    },
    HashDevaluationFactor: {
      description:
        'How many hashes need to be submitted to pay out the MiningRewardPoolPayoutRatio, so if the MiningRewardPoolPayoutRatio corresponds to 0.5, then 50% of the mining reward pool is paid out for HashDevaluationFactor amount of hashes. ',
    },
    MiningRewardPoolPayoutRatio: {
      description:
        'The percentage of the mining reward pool that is paid out when the HashDevaluationFactor is reached, in 18 decimals. So if the MiningRewardPoolPayoutRatio corresponds to 0.5, then 50% of the mining reward pool is paid out for HashDevaluationFactor amount of hashes.',
    },
  },
  IMonetaryTokenFacet: {
    TokenContractAddress: {
      description: `Address of the ERC20 contract of the monetary token of the DAO (${TOKENS.secoin.symbol}).`,
    },
  },
  IABCConfigureFacet: {
    FormulaABC: {
      description:
        'Address of the contract that defines the formula describing the Augmented Bonding Curve (ABC).',
    },
    FrictionABC: {
      description: `Percentage fee charged to holders when burning ${TOKENS.secoin.symbol} in exchange for collateral token, using the ABC (parts per million).`,
    },
    Hatcher: {
      description: `Address of the contract that receives initial contributions of the ICO period of the ABC. When enough funds are received within time limit, contributions will be disabled and market maker will activate to allow swapping of ${TOKENS.secoin.symbol}.`,
    },
    MarketMaker: {
      description:
        'Address of the contract that acts as the market maker for the ABC.',
    },
    ReserveRatioABC: {
      description:
        'The ratio for the reserve in the BancorBondingCurve used in the ABC MarketMaker.',
    },
    ThetaABC: {
      description: `What percentage of DAI is sent to the DAO when minting ${TOKENS.secoin.symbol}, in parts per million.`,
    },
  },
  IRewardMultiplierFacet: {
    InflationStartTimestamp: {
      description:
        'Timestamp at which the inflation starts, must be in the past.',
    },
    InflationBase: {
      description:
        'The base of the inflation amount, so the amount of inflation there is today is InflationBase^x + InflationInitialAmount, where x is the number of days since the InflationStartTimestamp.',
    },
    InflationInitialAmount: {
      description:
        'Gets added to the InflationBase^x + InflationInitialAmount, where x is the number of days since the InflationStartTimestamp.',
    },
  },
};
