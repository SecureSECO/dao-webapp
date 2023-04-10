/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { TokenVotingClient, VoteValues } from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

type CanVote = {
  YES: boolean;
  NO: boolean;
  ABSTAIN: boolean;
};

export type UseCanVoteData = {
  loading: boolean;
  error: string | null;
  canVote: CanVote;
  refetch: () => void;
};

export type UseCanVoteProps = {
  proposalId: string | undefined;
  address: string | undefined;
  useDummyData?: boolean;
};

/**
 * @returns Whether or not a user can vote on each specific vote option (YES, NO, ABSTAIN)
 */
export const useCanVote = ({
  proposalId,
  address,
  useDummyData = false,
}: UseCanVoteProps): UseCanVoteData => {
  const [canVote, setCanVote] = useState<CanVote>({
    YES: false,
    NO: false,
    ABSTAIN: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingClient } = useAragonSDKContext();

  const fetchCanVote = async () => {
    if (!votingClient || !address) return;
    if (!proposalId || !address) {
      setError('Proposal not found');
      setLoading(false);
      return;
    }

    try {
      const values = [VoteValues.ABSTAIN, VoteValues.YES, VoteValues.NO];
      const canVoteData = await Promise.all(
        values.map((vote) => {
          return (votingClient as TokenVotingClient)?.methods.canVote({
            voterAddressOrEns: address,
            proposalId,
            vote,
          });
        })
      );

      if (canVoteData) {
        setCanVote({
          YES: canVoteData[1],
          NO: canVoteData[2],
          ABSTAIN: canVoteData[0],
        });
        setLoading(false);
        setError(null);
      } else setCanVote({ YES: false, NO: false, ABSTAIN: false });
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
    setCanVote({ YES: true, NO: true, ABSTAIN: true });
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (votingClient && address) setLoading(true);
    fetchCanVote();
    setLoading(false);
  }, [votingClient, proposalId, address]);

  return {
    loading,
    error,
    canVote,
    refetch: () => (!useDummyData ? fetchCanVote() : void 0),
  };
};