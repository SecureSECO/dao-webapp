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
      description: 'Minimum duration of a proposal in seconds.',
      type: 'Seconds',
    },
    MinParticipation: {
      description:
        'Minimum percentage of voting power supply needed for a quorum.',
      type: 'Percentage',
    },
    MinProposerVotingPower: {
      description: `Minimum ${TOKENS.rep.symbol} needed to create a proposal.`,
      type: 'SECOREP',
    },
    SupportThreshold: {
      description:
        'Percentage of yes/no votes that need to be yes for a proposal to pass',
      type: 'Percentage',
    },
    VotingMode: {
      description:
        '0: Single vote - vote once with all voting power, 1: Single partial vote - vote once with possibly a part of your voting power , 2: Multiple partial vote - vote multiple times with a part of your voting power',
    },
  },
  IBurnVotingProposalFacet: {
    ProposalCreationCost: {
      description: `How much ${TOKENS.rep.symbol} it costs to create a proposal. This ${TOKENS.rep.symbol} is burned`,
      type: 'SECOREP',
    },
  },
  IERC20TimeClaimableFacet: {
    ClaimPeriodInterval: {
      description:
        'Interval in seconds between increase in claim reward amount',
      type: 'Seconds',
    },
    ClaimPeriodMax: {
      description:
        'Amount of seconds after which claim reward will no longer increase',
      type: 'Seconds',
    },
  },
  ISearchSECOMonetizationFacet: {
    HashCost: {
      description: `${TOKENS.secoin.symbol} cost per hash retrieved`,
      type: 'SECOIN',
    },
  },
  ISearchSECORewardingFacet: {
    HashReward: {
      description: `${TOKENS.secoin.symbol} rewarded per hash mined`,
      type: 'SECOIN',
    },
    RewardingSigner: {
      description:
        'Address of the wallet that verifies if claimed hash rewards are actually claimable',
    },
  },
  IChangeableTokenContract: {
    TokenContractAddress: {
      description:
        'Address of the ERC20 contract of the monetary token of the DAO (SECOIN)',
    },
  },
};
