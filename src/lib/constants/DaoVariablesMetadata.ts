/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TOKENS } from './tokens';

export type InterfaceName = string;
export type VariableName = string;
export type DaoVariableMetadataType =
  | 'Percentage' // Percentage, where 1,000,000 corresponds to 100%
  | `SECOREP`
  | 'SECOIN'
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
    SECOREP: 'SECOREP includes decimals, thus 10^18 corresponds to 1.0 SECOREP',
    SECOIN: 'SECOIN includes decimals, thus 10^18 corresponds to 1.0 SECOREP',
    Seconds: 'Seconds, decimals are not supported',
  };

export const DAO_VARIABLES_METADATA: DaoVariablesMetadata = {
  IPartialVotingProposalFacet: {
    MaxSingleWalletPower: {
      description:
        'Percentage of voting power supply that a single wallet may use to vote.',
      type: 'Percentage',
    },
    MinDuration: {
      description:
        'Minimum duration of the voting period of a proposal in seconds.',
      type: 'Seconds',
    },
    MinParticipation: {
      description:
        'Minimum percentage of voting power supply needed for a quorum (minimum participation).',
      type: 'Percentage',
    },
    MinProposerVotingPower: {
      description: `Minimum ${TOKENS.rep.symbol} a wallet needs to won to be able to create a proposal.`,
      type: 'SECOREP',
    },
    SupportThreshold: {
      description:
        'Percentage of yes/no votes that need to be yes for a proposal to pass (abstain is solely to reach the quorum).',
      type: 'Percentage',
    },
    VotingMode: {
      description:
        '0: Single vote - vote once with all voting power, 1: Single partial vote - vote once with any part of your voting power , 2: Multiple partial vote - vote multiple times with a part of your voting power.',
    },
  },
  IBurnVotingProposalFacet: {
    ProposalCreationCost: {
      description: `How much ${TOKENS.rep.symbol} it costs to create a proposal. This ${TOKENS.rep.symbol} is burned, never to see the light of day again.`,
      type: 'SECOREP',
    },
  },
  IERC20TimeClaimableFacet: {
    ClaimPeriodInterval: {
      description: 'Interval in seconds between subsequent daily rewards.',
      type: 'Seconds',
    },
    ClaimPeriodMax: {
      description:
        'Time period in seconds after which claim reward will no longer increase.',
      type: 'Seconds',
    },
  },
  ISearchSECOMonetizationFacet: {
    HashCost: {
      description: `${TOKENS.secoin.symbol} cost per hash retrieved.`,
      type: 'SECOIN',
    },
  },
  ISearchSECORewardingFacet: {
    HashReward: {
      description: `${TOKENS.secoin.symbol} rewarded per hash mined.`,
      type: 'SECOIN',
    },
    RewardingSigner: {
      description:
        'Address of the wallet that verifies if claimed hash rewards are actually claimable.',
    },
    HashDevaluationFactor: {
      description:
        'How many hashes need to be submitted to pay out the MiningRewardPoolPayoutRatio',
    },
    MiningRewardPoolPayoutRatio: {
      description:
        'The percentage of the mining reward pool that is paid out when the HashDevaluationFactor is reached.',
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
      description:
        'Fee charged to holders when burning SECOIN in exchange for collateral token, using the ABC.',
    },
    Hatcher: {
      description:
        'Address of the contract that receives initial contributions. When enough funds are received within time limit, contributions will be disabled and market maker will activate to allow swapping of SECION.',
    },
    MarketMaker: {
      description:
        'Address of the contract that acts as the market maker for the ABC.',
    },
    ReserveRatioABC: {
      description: 'The ratio for the reserve in the BancorBondingCurve.',
    },
    ThetaABC: {
      description:
        'What percentage of DAI is sent to the DAO when minting SECOIN.',
    },
  },
};
