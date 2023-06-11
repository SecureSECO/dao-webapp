/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { CONFIG } from '@/src/lib/constants/config';
import { erc20ABI } from '@/src/lib/constants/erc20ABI';
import { getErrorMessage } from '@/src/lib/utils';
import { parseTokenAmount } from '@/src/lib/utils/token';
import { BigNumber, ContractTransaction, ethers } from 'ethers';

import { useLocalStorage } from './useLocalStorage';

type QueryResponse = any;
type CheckResponse = any;

type UseSearchSECOProps = {
  useDummyData?: boolean;
};

const defaultProps: UseSearchSECOProps = {
  useDummyData: false,
};

type UseSearchSECOData = {
  queryResult: QueryResponse;
  hashes: string[];
  cost: number | null;
  session: SessionData | null;
  miningData: MiningData[] | null;
  hashReward: BigNumber | null;
  runQuery: (url: string, token: string) => Promise<QueryResponse>;
  resetQuery: (clearQueryResult?: boolean) => void;
  startSession: () => Promise<SessionData>;
  payForSession: (session: SessionData) => Promise<ContractTransaction>;
  claimReward: (
    hashCount: BigNumber,
    repFrac: BigNumber
  ) => Promise<ContractTransaction>;
};

/**
 * Represents a session. A session is used to track the status of a payment / query.
 */
type SessionData = {
  id: string;
  secret: string;
  hashes: string[];
  cost: number;
  fetch_status: 'idle' | 'pending' | 'success' | 'error';
  timestamp?: number;
  data?: any;
  error?: string;
};

type MiningData = {
  minerId: string;
  claimableHashes: number;
  status: string;
};

interface ResultData {
  Hash: string;
  FileName: string;
  FunctionName: string;
  LineNumber: number;
  LineNumberEnd: number;
}

export const dummyQueryResult = {
  methodData: [
    {
      method_hash: '9917d1b8a373ac2ac6d92ced37558db2',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '7',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: [
        '3',
        '0af1d147-b483-76a7-9e14-7f6828b94a60',
        '66163fed-c2bd-940d-b4a6-ec6e153a90c4',
        'a6ad6bc8-a201-ff89-c5d3-0ea9c00a16d0',
      ],
    },
    {
      method_hash: '897dadeff0b5432633e7f4a8b568fe9f',
      projectID: '1790983771',
      startVersion: '1527797086000',
      startVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: 'isOdd',
      file: 'index.js',
      lineNumber: '12',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: [
        '2',
        '0af1d147-b483-76a7-9e14-7f6828b94a60',
        '66163fed-c2bd-940d-b4a6-ec6e153a90c4',
      ],
    },
    {
      method_hash: '8c5d123198562f030ee15579e08e4224',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '28',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: ['1', '0af1d147-b483-76a7-9e14-7f6828b94a60'],
    },
    {
      method_hash: '16d5818bec817cdab47ed68b07aa511c',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '19',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: ['1', '0af1d147-b483-76a7-9e14-7f6828b94a60'],
    },
    {
      method_hash: '6bac8a660e8db4b32ab77c5fb8682744',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '8',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: ['1', '0af1d147-b483-76a7-9e14-7f6828b94a60'],
    },
  ],
  authorData: [
    {
      username: 'Error parsing author id: 3',
    },
  ],
  projectData: [
    {
      id: '1790983771',
      versionTime: '1527703251000',
      versionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      license: 'MIT License',
      name: 'is-odd',
      url: 'https://github.com/i-voted-for-trump/is-odd',
      authorName: 'a601fbd4-9cbd-62d8-2587-fd60d02e296b',
      authorMail: '1',
    },
    {
      id: '1790983771',
      versionTime: '1527797086000',
      versionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      license: 'MIT License',
      name: 'is-odd',
      url: 'https://github.com/i-voted-for-trump/is-odd',
      authorName: 'a601fbd4-9cbd-62d8-2587-fd60d02e296b',
      authorMail: '1',
    },
  ],
};

/**
 * Utility functions to interact with the SearchSECO database and API
 * @returns Functions and results of interacting with the SearchSECO database and API
 */
export const useSearchSECO = (
  props?: UseSearchSECOProps
): UseSearchSECOData => {
  const { client } = useDiamondSDKContext();

  const { useDummyData } = Object.assign(defaultProps, props);
  const [queryResult, setQueryResult] = useState<CheckResponse | null>(null);
  const [hashes, setHashes] = useState<string[]>([]);
  const [cost, setCost] = useState<number | null>(null);

  const [session, setSession] = useLocalStorage<SessionData | null>(
    'searchSECOSession',
    null
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [doPoll, setDoPoll] = useState<boolean>(true);

  const [miningData, setMiningData] = useState<MiningData[] | null>(null);
  // SECOIN reward per hash, in 18 decimal precision
  const [hashReward, setHashReward] = useState<BigNumber | null>(null);

  const API_URL = CONFIG.SEARCHSECO_API_URL;

  // Continuously poll for session data
  useEffect(() => {
    const poll = async () => {
      if (session && doPoll) {
        await getSessionData();
      }
    };

    poll();
    const interval = setInterval(poll, 10000);

    return () => clearInterval(interval);
  }, [sessionId, doPoll]);

  // Recover session from local storage
  useEffect(() => {
    if (session) {
      setSessionId(session.id);
      setHashes(session.hashes);
      setCost(session.cost);
    }
  }, [session]);

  useEffect(() => {
    if (client) {
      getMiningData();
    }
  }, [client]);

  /**
   * Runs the query and checks the cost of retrieving data about those hashes
   * @param url Github URL repository
   * @param token Github access token
   * @returns Promise that resolves when the query is complete
   */
  const runQuery = async (url: string, token: string): Promise<void> => {
    if (useDummyData) {
      setQueryResult(dummyQueryResult);
      const session = {
        id: 'dummySessionId',
        secret: 'dummySecret',
        fetch_status: 'success',
        hashes: ['dummyHash'],
        data: null,
        cost: 0,
      } as SessionData;
      setSession(session);
      setHashes(session.hashes);
      setCost(session.cost);
      setDoPoll(false);
      return Promise.resolve();
    }

    try {
      const response = await fetch(`${API_URL}/monetization/cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const res = await response.json();
      if (res.status !== 'ok') {
        console.log(res);
        throw new Error(`API request failed, please try again`);
      }

      console.log(res);
      setCost(res.cost);
      setHashes(res.hashes);
    } catch (e) {
      console.error(e);
      throw getErrorMessage(e);
    }
  };

  /**
   * Starts a session with the SearchSECO API. A session keeps track of
   * the data fetching status and more
   * @returns {Promise<SessionData>} Promise that resolves when the session is started
   */
  const startSession = async (): Promise<SessionData> => {
    if (useDummyData) {
      setQueryResult(dummyQueryResult);
      const session = {
        id: 'dummySessionId',
        secret: 'dummySecret',
        fetch_status: 'success',
        hashes: ['dummyHash'],
        data: null,
        cost: 0,
      } as SessionData;
      setSession(session);
      setHashes(session.hashes);
      setCost(session.cost);
      return session;
    }

    // Start a session
    const sessionResponse = await fetch(
      `${API_URL}/monetization/startSession`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hashes,
        }),
      }
    );

    if (!sessionResponse.ok) {
      throw new Error(
        `API request failed with status ${sessionResponse.status}`
      );
    }

    const sessionRes = await sessionResponse.json();

    if (sessionRes.status !== 'ok') {
      console.log(sessionRes);
      throw new Error(`API request failed, please try again.`);
    }

    // Store session in local storage
    const session: SessionData = {
      id: sessionRes.sessId,
      secret: sessionRes.secret,
      fetch_status: 'idle',
      hashes,
      data: null,
      cost: cost || 0,
    };
    setSession(session);

    return session;
  };

  /**
   * Pay for hashes via SDK
   * @param session Session data
   * @returns Promise that resolves when the hashes are paid for
   */
  const payForSession = async (
    session: SessionData
  ): Promise<ContractTransaction> => {
    if (!session) {
      throw new Error('Session is not defined');
    }

    if (!client) {
      throw new Error('No client found');
    }

    const { id, hashes } = session;

    const IChangeableTokenContract =
      await client.pure.IChangeableTokenContract();
    const ERC20Contract = new ethers.Contract(
      await IChangeableTokenContract.getTokenContractAddress(),
      erc20ABI,
      client.pure.signer
    );

    // Approve the dao to spend the cost of the session
    const allowanceAmount = parseTokenAmount(session.cost, 18);
    const tx = await ERC20Contract.approve(
      client.pure.pluginAddress,
      allowanceAmount
    );
    await tx.wait();

    // Call the actual payForHashes function
    const monetizationFacet = await client.pure.ISearchSECOMonetizationFacet();
    return await monetizationFacet.payForHashes(hashes.length, id);
  };

  /**
   * Updates `session` with the latest session data from the SearchSECO API
   */
  const getSessionData = async () => {
    if (!session) {
      return;
    }

    const sessionResponse = await fetch(
      `${API_URL}/monetization/getData?sessId=${session.id}&secret=${session.secret}`
    );

    if (!sessionResponse.ok) {
      throw new Error(
        `API request failed with status ${sessionResponse.status}`
      );
    }

    const sessionRes = await sessionResponse.json();
    if (sessionRes.status === 'ok') {
      setSession({
        ...session,
        fetch_status: sessionRes.fetch_status,
        data: sessionRes.data,
        timestamp: sessionRes.timestamp,
      });

      if (sessionRes.fetch_status === 'success') {
        setQueryResult(dummyQueryResult);
        setDoPoll(false);
      }
    } else {
      console.error(sessionRes.error);
      console.log(sessionRes);

      setSession({
        ...session,
        fetch_status: 'error',
        error: sessionRes.error ?? 'Unknown error',
      });
    }
  };

  /**
   * Resets the query state & deletes the session
   */
  const resetQuery = (clearQueryResult: boolean = true) => {
    if (clearQueryResult) {
      setQueryResult(null);
      setCost(null);
      setHashes([]);
    }
    setSession(null);
    setSessionId(null);
    setDoPoll(true);
  };

  /**
   * Retrieves data about your mining performance & hash reward
   */
  const getMiningData = async () => {
    if (!client) {
      return;
    }

    const address = await client.pure.signer.getAddress();

    const res = await fetch(
      `${API_URL}/rewarding/miningData?address=${address}`
    );
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();

    if (json.status !== 'ok') {
      console.log(json);
      throw new Error(`API request failed, please try again.`);
    }

    const rows = json.data;

    const data: MiningData[] = rows.map((row: any) => {
      return {
        minerId: row.id as string,
        claimableHashes: parseInt(row.claimable_hashes as string),
        status: row.status as string,
      } as MiningData;
    });

    setMiningData(data);

    const rewarding = await client.pure.ISearchSECORewardingFacet();
    const hashReward = await rewarding.getHashReward();

    // setHashReward(hashReward);
    setHashReward(BigNumber.from(1000000000000000)); // FIXME: remove this
  };

  /**
   * Claims the mining rewards from all miners
   * @param hashCount Number of hashes to claim
   * @param repFrac Fraction which should be paid in rep, rest is paid in coin
   */
  const claimReward = async (
    hashCount: BigNumber,
    repFrac: BigNumber
  ): Promise<ContractTransaction> => {
    if (!client) {
      throw new Error('No client found');
    }

    const address = await client.pure.signer.getAddress();

    const res = await fetch(`${API_URL}/rewarding/reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
      }),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();

    if (json.status !== 'ok') {
      console.error(json);
      throw new Error(`API request failed, please try again.`);
    }

    const { proof, nonce } = json;

    const rewarding = await client.pure.ISearchSECORewardingFacet();
    return await rewarding.rewardMinerForHashes(
      address,
      hashCount,
      nonce,
      repFrac,
      proof.sig
    );
  };

  return {
    queryResult,
    hashes,
    cost,
    session,
    miningData,
    hashReward,
    runQuery,
    resetQuery,
    startSession,
    payForSession,
    claimReward,
  };
};
