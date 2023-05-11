/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useVotingPower } from '@/src/hooks/useVotingPower';
import { getErrorMessage } from '@/src/lib/utils';
import {
  VoteOption,
  Proposal,
  IPartialVotingProposalFacet,
  ProposalStatus,
} from '@plopmenz/diamond-governance-sdk';
import { BigNumber, ContractTransaction, constants } from 'ethers';
import { useEffect, useState } from 'react';

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
  // Voting power of currently given address
  // This value is simply a re-export of the useVotingPower hook
  votingPower: BigNumber;
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
export const dummyMintAction = {
  method: 'mintVotingPower(address,uint256,uint256)',
  interface: 'IMintableGovernanceStructure',
  params: {
    _to: [
      {
        _to: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
        _amount: BigNumber.from('0x4563918244F40000'),
        _tokenId: BigNumber.from(0),
      },
      {
        _to: '0x23868C8ed12EAD37ef76457e7B6443192e231442',
        _amount: BigNumber.from('0x4563918244F40000'),
        _tokenId: BigNumber.from(0),
      },
    ],
  },
};

/**
 * Dummy withdraw assets action
 * @note Not yet correct
 */
export const dummyWithdrawAction = {
  method: 'withdraw',
  interface: 'IWithdraw',
  params: {
    _to: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
    _amount: BigNumber.from('0x4563918244F40000'),
    _tokenAddress: constants.AddressZero,
  },
};

/**
 * Dummy merge pull request action
 */
export const dummyMergeAction = {
  method: 'mergePullRequest(string,string,string)',
  interface: 'IGithubPullRequestFacet',
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
export const dummyChangeParamsAction = {
  method: 'change',
  interface: 'IChange',
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
    tally: {
      yes: BigNumber.from('0x01'),
      no: BigNumber.from('0x00'),
      abstain: BigNumber.from('0x01'),
    } as IPartialVotingProposalFacet.TallyStructOutput,
  },
  metadata: {
    title: 'Title',
    description: 'Description',
    resources: [],
    body: '',
  },
  status: ProposalStatus.Active,
  actions: [],
  startDate: new Date('2023-05-08T18:19:09.000Z'),
  endDate: new Date('2023-05-10T18:19:09.000Z'),
  creatorAddress: '0x2B868C8ed12EAD37ef76457e7B6443192e231442',
} as any as Proposal;

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
  // const [votingPower, setVotingPower] = useState<BigNumber>(BigNumber.from(0));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useDiamondSDKContext();
  const { votingPower } = useVotingPower({
    address,
    blockNumber: proposal?.data.parameters.snapshotBlock,
  });

  const fetchProposal = async () => {
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
      } else {
        setError('Proposal not found');
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
      setLoading(false);
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setProposal(dummyProposal);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (client) setLoading(true);
    fetchProposal();
  }, [client, id]);

  useEffect(() => {
    const checkCanExecute = async () => {
      if (!proposal) return;
      // Fetch if the current proposal can be executed
      try {
        const canExecuteData = await proposal.CanExecute();
        setCanExecute(canExecuteData);
        // Will fail if no signer is available, so check for signer existence first
        // if (signer) {
        //   const canExecuteProposal = await votingClient.methods.canExecute(id);
        //   if (canExecuteProposal) setCanExecute(true);
        //   else setCanExecute(false);
        // }
      } catch (e) {
        console.error('Error fetching canExecute', e);
      }
    };

    const checkCanVote = async () => {
      if (!proposal || !address || !client) return;
      try {
        const values = [VoteOption.Abstain, VoteOption.Yes, VoteOption.No];
        const canVoteData = await Promise.all(
          values.map((vote) => {
            return proposal.CanVote(vote, votingPower);
          })
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

    checkCanExecute();
    checkCanVote();
  }, [proposal]);

  return {
    loading,
    error,
    proposal,
    canExecute,
    canVote,
    votingPower,
    // Only allow refetching if not using dummy data
    refetch: () => (!useDummyData ? fetchProposal() : void 0),
  };
};
