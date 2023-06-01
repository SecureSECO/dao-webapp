/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { ProposalChangeParamAction } from '@/src/components/proposal/actions/ChangeParamAction';
import { ProposalMergeAction } from '@/src/components/proposal/actions/MergeAction';
import { ProposalMintAction } from '@/src/components/proposal/actions/MintAction';
import { ProposalWithdrawAction } from '@/src/components/proposal/actions/WithdrawAction';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useVotingPower } from '@/src/hooks/useVotingPower';
import { ACTIONS, getIdentifier } from '@/src/lib/constants/actions';
import {
  AddressVotes,
  DiamondGovernanceClient,
  IPartialVotingFacet,
  IPartialVotingProposalFacet,
  InterfaceVariables,
  Proposal,
  ProposalStatus,
  VoteOption,
} from '@plopmenz/diamond-governance-sdk';
import { BigNumber, ContractTransaction } from 'ethers';

export type CanVote = {
  Yes: boolean;
  No: boolean;
  Abstain: boolean;
};

export type UseProposalData = {
  loading: boolean;
  error: string | null;
  proposal: Proposal | null;
  canExecute: boolean;
  canVote: CanVote;
  votes: AddressVotes[] | null;
  refetch: () => void;
};

export type UseProposalProps = {
  id: string | undefined;
  address: string | undefined;
  useDummyData?: boolean;
};

/**
 * Dummy mint tokens action
 */
export const dummyMintAction: ProposalMintAction = {
  method: ACTIONS.mint_tokens.method,
  interface: ACTIONS.mint_tokens.interface,
  params: {
    _addresses: [
      '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
      '0x23868C8ed12EAD37ef76457e7B6443192e231442',
    ],
    _amounts: [
      BigNumber.from('0x4563918244F40000'),
      BigNumber.from('0x4563918244F40000'),
    ],
  },
};

/**
 * Dummy withdraw assets actions.
 * Includes a variant for each token type.
 */
export const dummyWithdrawActions: ProposalWithdrawAction[] = [
  {
    interface: ACTIONS.withdraw_assets.interface,
    method: ACTIONS.withdraw_assets.method.native,
    params: {
      _to: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
      _value: BigNumber.from('0x4563918244F40000'),
    },
  },
  {
    interface: ACTIONS.withdraw_assets.interface,
    method: ACTIONS.withdraw_assets.method.erc20,
    params: {
      _from: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
      _to: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
      _amount: BigNumber.from('0x4563918244F40000'),
      _contractAddress: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa', // Token address of WETH on mumbai
    },
  },
  {
    interface: ACTIONS.withdraw_assets.interface,
    method: ACTIONS.withdraw_assets.method.erc721,
    params: {
      _from: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
      _to: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
      _tokenId: BigNumber.from(1),
      _contractAddress: '0x042FF2201D1015730d2414DaBF5d627e3e69e7CA', // Test11 NFT on mumbai
    },
  },
  {
    interface: ACTIONS.withdraw_assets.interface,
    method: ACTIONS.withdraw_assets.method.erc1155,
    params: {
      _from: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
      _to: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
      _tokenId: BigNumber.from(1),
      _amount: BigNumber.from(1),
      _contractAddress: '0x29Ba2441Cc4a5Da648f9abb284bc99FDF94dc446', // Some ERC1155 on mumbai
    },
  },
];

/**
 * Dummy merge pull request action
 */
export const dummyMergeAction: ProposalMergeAction = {
  method: ACTIONS.merge_pr.method,
  interface: ACTIONS.merge_pr.interface,
  params: {
    _owner: 'githubtraining',
    _repo: 'hellogitworld',
    _pull_number: '174',
  },
};

/**
 * Dummy mint tokens action
 * @note Not yet correct
 */
export const dummyChangeParamsAction: ProposalChangeParamAction = {
  method: ACTIONS.change_param.method,
  interface: ACTIONS.change_param.interface,
  params: {
    _plugin: 'TokenVoting',
    _param: 'supportThreshold',
    _value: '1',
  },
};

/**
 * Dummy proposal data, representing what is returned by the SDK.
 * @note The Proposal type returned by the SDK is auto-generated, and therefore contains a lot of unnecessary fields, which are ignored here by casting to the right types.
 */
export const dummyProposal: Proposal = {
  id: 0,
  fromHexString: undefined,
  getStatus: () => ProposalStatus.Active,
  CanVote: () => Promise.resolve(true),
  Vote: () => Promise.resolve({} as ContractTransaction),
  Execute: () => Promise.resolve({} as ContractTransaction),
  CanExecute: () => Promise.resolve(true),
  Refresh: () => Promise.resolve(),
  data: {
    allowFailureMap: BigNumber.from('0x00'),
    actions: [],
    executed: false,
    open: true,
    metadata:
      '0x697066733a2f2f516d51766d38383964544231315452516e37664b4a356545586e624d76376b5437574a4a62677a686472377a3166',
    parameters: {
      earlyExecution: true,
      endDate: BigNumber.from('0x645be01d'),
      startDate: BigNumber.from('0x64593d1d'),
      maxSingleWalletPower: BigNumber.from('0x14'),
      minParticipationThresholdPower: BigNumber.from('0x01'),
      snapshotBlock: BigNumber.from('0x021b5d8c'),
      supportThreshold: 1,
      votingMode: 1,
    } as IPartialVotingProposalFacet.ProposalParametersStructOutput,
    creator: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
    executor: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
    voterList: ['0x2B868C8ed12EAD37ef76457e7B6443192e231442'],
    tally: {
      yes: BigNumber.from('0x4563918244F40000'),
      no: BigNumber.from('0x00'),
      abstain: BigNumber.from('0x00'),
    } as IPartialVotingProposalFacet.TallyStructOutput,
  },
  metadata: {
    title: 'Title',
    description: 'Description',
    resources: [],
    body: '<p>This is the body</p>',
  },
  status: ProposalStatus.Active,
  actions: [],
  startDate: new Date('2023-05-08T18:19:09.000Z'),
  endDate: new Date('2023-05-10T18:19:09.000Z'),
  creationDate: new Date('2023-05-08T18:09:09.000Z'),
} as unknown as Proposal;

export const dummyVotes: AddressVotes[] = [
  {
    address: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
    votes: [
      {
        option: VoteOption.Yes,
        amount: BigNumber.from('0x4563918244F40000'),
      } as unknown as IPartialVotingFacet.PartialVoteStructOutput,
    ],
  },
];

/**
 * Parses a proposal, returning the same proposal with the actions parsed.
 * @param proposal The proposal to parse
 */
export const parseProposal = (
  proposal: Proposal,
  variableMap: Set<string>
): Proposal => {
  proposal.actions = proposal.actions.map((action) => {
    if (variableMap.has(getIdentifier(action)))
      return {
        ...action,
        interface: 'DAO',
        method: 'ChangeParam',
      };
    return action;
  });
  return proposal;
};

export const useProposal = ({
  id,
  address,
  useDummyData = false,
}: UseProposalProps): UseProposalData => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [canExecute, setCanExecute] = useState<boolean>(false);
  const [canVote, setCanVote] = useState<CanVote>({
    Yes: false,
    No: false,
    Abstain: false,
  });
  const [votes, setVotes] = useState<AddressVotes[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { anonClient, client } = useDiamondSDKContext();
  const { proposalVotingPower } = useVotingPower({
    address,
    proposal: proposal ?? undefined,
  });

  const fetchProposal = async (client?: DiamondGovernanceClient) => {
    if (!client) return;
    if (!id) {
      setError('Proposal not found');
      setLoading(false);
      return;
    }

    try {
      const daoProposal: Proposal = await client.sugar.GetProposal(+id);

      if (daoProposal) {
        setProposal(daoProposal);
        setError(null);
        setLoading(false);
        fetchVotes(daoProposal);
        checkCanExecute(daoProposal);
        checkCanVote(daoProposal);
      } else {
        setError('Proposal not found');
        setLoading(false);
        setVotes(null);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error && e.message === 'Invalid id')
        setError('Proposal not found');
      else setError('An error occurred');
      setLoading(false);
    }
  };

  const fetchVotes = async (proposal: Proposal) => {
    if (!client || !proposal) return;
    try {
      const votes = await proposal.GetVotes();
      setVotes(votes);
    } catch (e) {
      console.error(e);
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setProposal(dummyProposal);
    setVotes(dummyVotes);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    fetchProposal(client ?? anonClient);
  }, [client, anonClient, id]);

  const checkCanExecute = async (proposal: Proposal) => {
    // Fetch if the current proposal can be executed
    try {
      const canExecuteData = await proposal.CanExecute();
      setCanExecute(canExecuteData);
    } catch (e) {
      console.error('Error fetching canExecute', e);
    }
  };

  const checkCanVote = async (proposal: Proposal) => {
    // Check if proposal.id === canVoteId to avoid unnecessary refetching of the canVote data
    if (!proposalVotingPower) return;

    try {
      console.log('fetching CanVote', proposalVotingPower);

      const values = [VoteOption.Abstain, VoteOption.Yes, VoteOption.No];
      const canVoteData = await Promise.all(
        values.map((vote) => proposal.CanVote(vote, proposalVotingPower))
      );
      setCanVote({
        Yes: canVoteData[1],
        No: canVoteData[2],
        Abstain: canVoteData[0],
      });
    } catch (e) {
      console.error('Error fetching canVote', e);
    }
  };

  useEffect(() => {
    if (!proposal) return;
    checkCanExecute(proposal);
    checkCanVote(proposal);
  }, [proposalVotingPower]);

  return {
    loading,
    error,
    proposal,
    canExecute,
    canVote,
    votes,
    // Only allow refetching if not using dummy data
    refetch: () => {
      if (proposal) {
        proposal.Refresh();
        checkCanExecute(proposal);
        checkCanVote(proposal);
      }
    },
  };
};
